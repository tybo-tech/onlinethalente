import { Injectable, inject } from '@angular/core';
import { forkJoin, map, switchMap, Observable, of, catchError } from 'rxjs';
import { ICollectionData } from '../../models/ICollection';
import { ApplicationStatus, OfferCounter, Application, PaymentMethod } from '../../models/schema';
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
      counters: this.la.offerCounters$(),
    }).pipe(
      map(({ apps, pays, offers, counters }) => {
        const count = (s: ApplicationStatus) => apps.filter(a => a.data.status === s).length;

        const disbursed_cents = pays
          .filter(p => (p.data.processed_at || '').startsWith(monthPrefix) && p.data.status === 'SUCCESS')
          .reduce((sum, p) => sum + (p.data.amount_cents || 0), 0);

        const period = this.la.currentPeriodISO();
        const remainingByOffer = counters
          .filter(c => c.data.period === period)
          .map(c => ({ offer_id: c.data.offer_id, slots_remaining: c.data.slots_remaining }));

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

  /** Ensure counters exist for all active offers for the current month */
  seedMonthlyCounters$(): Observable<null | unknown> {
    const period = this.la.currentPeriodISO();
    return forkJoin({
      offers: this.la.loanOffers$(),
      counters: this.la.offerCounters$(),
    }).pipe(
      switchMap(({ offers, counters }) => {
        const tasks: Observable<unknown>[] = [];
        for (const o of offers.filter(x => x.data.is_active)) {
          const exists = counters.find(c => c.data.offer_id === o.id && c.data.period === period);
          if (!exists) {
            tasks.push(
              this.la.add<OfferCounter>('offer_counters', {
                offer_id: o.id,
                period,
                slots_remaining: o.data.slots_total,
              })
            );
          }
        }
        return tasks.length ? forkJoin(tasks) : of(null);
      })
    );
  }

  /** Approve: decrement counter (soft-guard) + mark app + create PENDING payment */
  approveApplication$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const period = this.la.currentPeriodISO();

    if (!appNode.data.offer_id) {
      return of({ ok: false, error: 'Application has no offer_id' });
    }

    return forkJoin({
      counters: this.la.offerCounters$(),
      offers: this.la.loanOffers$(),
    }).pipe(
      switchMap(({ counters, offers }) => {
        let counter = counters.find(c => c.data.offer_id === appNode.data.offer_id && c.data.period === period);
        const offer = offers.find(o => o.id === appNode.data.offer_id);
        if (!offer) return of({ ok: false, error: 'Offer not found' });

        // Create counter for this month if missing
        if (!counter) {
          return this.la
            .add<OfferCounter>('offer_counters', {
              offer_id: offer.id,
              period,
              slots_remaining: offer.data.slots_total,
            })
            .pipe(switchMap((created) => this._decrementAndApprove(appNode, created as ICollectionData<OfferCounter>)));
        }

        return this._decrementAndApprove(appNode, counter);
      }),
      catchError((e) => of({ ok: false, error: e?.message || 'Approve failed' }))
    );
  }

  // Internals
  private _decrementAndApprove(
    appNode: ICollectionData<Application>,
    counterNode: ICollectionData<OfferCounter>
  ): Observable<Ok | Fail> {
    if (counterNode.data.slots_remaining <= 0) {
      return of({ ok: false, error: 'No slots remaining for this offer' });
    }

    // 1) decrement counter (optimistic)
    counterNode.data.slots_remaining -= 1;

    // 2) mark application approved
    appNode.data.status = ApplicationStatus.APPROVED;
    appNode.data.approved_at = new Date().toISOString();

    // 3) create a PENDING payment node
    const amount = appNode.data.requested_amount_cents;

    return forkJoin([
      this.la.update(counterNode),
      this.la.update(appNode),
      this.la.createPayment(appNode.id, amount, PaymentMethod.RTC),
    ]).pipe(
      // Soft re-check to reduce race risk (not a replacement for server TX!)
      switchMap(() => this.la.offerCounters$()),
      map((after) => {
        const latest = after.find(c => c.id === counterNode.id);
        if (latest && latest.data.slots_remaining < 0) {
          // Rollback signal (you could emit an alert / request admin retry)
          return { ok: false, error: 'Counter went negative; please retry.' } as Fail;
        }
        return { ok: true } as Ok;
      }),
      catchError((e) => of({ ok: false, error: e?.message || 'Approve failed' }))
    );
  }
}
