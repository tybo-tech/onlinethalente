import { Injectable, inject } from '@angular/core';
import { forkJoin, map, switchMap, Observable, of, catchError } from 'rxjs';
import { ICollectionData } from '../../models/ICollection';
import { ApplicationStatus, Application, PaymentMethod } from '../../models/schema';
import { LendingAdapter } from './lending.adapter';

type Ok = { ok: true };
type Fail = { ok: false; error: string };

@Injectable({ providedIn: 'root' })
export class AdminUseCases {
  private la = inject(LendingAdapter);

  /** Dashboard KPIs for the current month (one-shot HTTP) */
  kpis$(): Observable<{
    submitted: number;
    verified: number;
    approved: number;
    paid: number;
    disbursed_cents: number;
    remainingByOffer: { offer_id: number; slots_remaining: number }[];
    offers: ICollectionData<any>[];
  }> {
    const monthPrefix = this.la.currentPeriodISO().slice(0, 7); // 'YYYY-MM'
    return forkJoin({
      apps: this.la.applications$(),
      pays: this.la.payments$(),
      offers: this.la.loanOffers$(),
    }).pipe(
      map(({ apps, pays, offers }) => {
        const count = (s: ApplicationStatus) => apps.filter(a => a.data.status === s).length;

        const disbursed_cents = pays
          .filter(p => (p.data.processed_at || '').startsWith(monthPrefix) && p.data.status === 'SUCCESS')
          .reduce((sum, p) => sum + (p.data.amount_cents || 0), 0);

        // Calculate remaining slots from active offers directly
        const remainingByOffer = offers
          .filter(o => o.data.is_active)
          .map(o => ({ offer_id: o.id, slots_remaining: o.data.slots_total }));

        return {
          submitted: count(ApplicationStatus.SUBMITTED),
          verified: count(ApplicationStatus.VERIFIED),
          approved: count(ApplicationStatus.APPROVED),
          paid: count(ApplicationStatus.PAID),
          disbursed_cents,
          remainingByOffer,
          offers,
        };
      })
    );
  }

  /** Approve: decrement offer slots + mark app + create PENDING payment */
  approveApplication$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    if (!appNode.data.offer_id) {
      return of({ ok: false, error: 'Application has no offer_id' });
    }

    return forkJoin({
      offers: this.la.loanOffers$(),
    }).pipe(
      switchMap(({ offers }) => {
        const offer = offers.find(o => o.id === appNode.data.offer_id);
        if (!offer) return of({ ok: false, error: 'Offer not found' });

        return this._decrementAndApprove(appNode, offer);
      }),
      catchError((e) => of({ ok: false, error: e?.message || 'Approve failed' }))
    );
  }

  // Internals
  private _decrementAndApprove(
    appNode: ICollectionData<Application>,
    offerNode: ICollectionData<any>
  ): Observable<Ok | Fail> {
    if (offerNode.data.slots_total <= 0) {
      return of({ ok: false, error: 'No slots remaining for this offer' });
    }

    // 1) decrement offer slots (optimistic)
    offerNode.data.slots_total -= 1;

    // 2) mark application approved
    appNode.data.status = ApplicationStatus.APPROVED;
    appNode.data.approved_at = new Date().toISOString();

    // 3) create a PENDING payment node
    const amount = appNode.data.requested_amount_cents;

    return forkJoin([
      this.la.update(offerNode),
      this.la.update(appNode),
      this.la.createPayment(appNode.id, amount, PaymentMethod.RTC),
    ]).pipe(
      // Soft re-check to reduce race risk (not a replacement for server TX!)
      switchMap(() => this.la.loanOffers$()),
      map((after) => {
        const latest = after.find(o => o.id === offerNode.id);
        if (latest && latest.data.slots_total < 0) {
          // Rollback signal (you could emit an alert / request admin retry)
          return { ok: false, error: 'Offer slots went negative; please retry.' } as Fail;
        }
        return { ok: true } as Ok;
      }),
      catchError((e) => of({ ok: false, error: e?.message || 'Approve failed' }))
    );
  }
}
