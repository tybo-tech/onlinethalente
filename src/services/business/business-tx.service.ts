// src/app/services/business/business-tx.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, switchMap, map, catchError } from 'rxjs';
import { ICollectionData } from '../../models/ICollection';
import {
  Application, OfferCounter, ApplicationStatus, PaymentMethod,
  DebiCheckEvent, DebiCheckStatus, AIVerification
} from '../../models/schema';
import { BusinessRulesService } from './business-rules.service';
import { LendingAdapter } from './lending.adapter';

export type Ok = { ok: true };
export type Fail = { ok: false; error: string };

@Injectable({ providedIn: 'root' })
export class BusinessTxService {
  private la = inject(LendingAdapter);
  private rules = inject(BusinessRulesService);

  updateAIVerification$(appNode: ICollectionData<Application>, status: AIVerification): Observable<Ok | Fail> {
    const updatedApp = {
      ...appNode,
      data: {
        ...appNode.data,
        ai_verification: status
      }
    };
    return this.la.update(updatedApp).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError(err => of({ ok: false, error: err.message } as Fail))
    );
  }

  verifyApplication$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const now = new Date().toISOString();
    const updatedApp = {
      ...appNode,
      data: {
        ...appNode.data,
        status: ApplicationStatus.VERIFIED,
        updated_at: now,
        verified_at: now
      }
    };
    return this.la.update(updatedApp).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError(err => of({ ok: false, error: err.message } as Fail))
    );
  }

  declineApplication$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const now = new Date().toISOString();
    const updatedApp = {
      ...appNode,
      data: {
        ...appNode.data,
        status: ApplicationStatus.DECLINED,
        updated_at: now,
        declined_at: now
      }
    };
    return this.la.update(updatedApp).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError(err => of({ ok: false, error: err.message } as Fail))
    );
  }

  markApplicationPaid$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const now = new Date().toISOString();
    const updatedApp = {
      ...appNode,
      data: {
        ...appNode.data,
        status: ApplicationStatus.PAID,
        updated_at: now,
        paid_at: now
      }
    };
    return this.la.update(updatedApp).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError(err => of({ ok: false, error: err.message } as Fail))
    );
  }

  markApplicationPartiallyRepaid$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const now = new Date().toISOString();
    const updatedApp = {
      ...appNode,
      data: {
        ...appNode.data,
        status: ApplicationStatus.PARTIALLY_REPAID,
        updated_at: now,
        last_repayment_date: now
      }
    };
    return this.la.update(updatedApp).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError(err => of({ ok: false, error: err.message } as Fail))
    );
  }

  markApplicationFullyRepaid$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const now = new Date().toISOString();
    const updatedApp = {
      ...appNode,
      data: {
        ...appNode.data,
        status: ApplicationStatus.FULLY_REPAID,
        updated_at: now,
        fully_repaid_at: now,
        last_repayment_date: now
      }
    };
    return this.la.update(updatedApp).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError(err => of({ ok: false, error: err.message } as Fail))
    );
  }

  markApplicationOverdue$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const now = new Date().toISOString();
    const updatedApp = {
      ...appNode,
      data: {
        ...appNode.data,
        status: ApplicationStatus.OVERDUE,
        updated_at: now,
        overdue_at: now
      }
    };
    return this.la.update(updatedApp).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError(err => of({ ok: false, error: err.message } as Fail))
    );
  }

  /**
   * Approve Application (client-orchestrated):
   *  1) ensure monthly counter exists
   *  2) decrement counter
   *  3) set application APPROVED
   *  4) create PENDING payment
   * Compensates (rollback) on failure.
   */
  approveApplication$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const errs = this.rules.validateApplication(appNode.data);
    if (errs.length) return of({ ok: false, error: errs.join('; ') });

    if (!appNode.data.offer_id) return of({ ok: false, error: 'Application has no offer_id' });

    const period = this.rules.currentPeriodISO();
    const origApp = { ...appNode.data };

    return forkJoin({
      counters: this.la.offerCounters$(),
      offers: this.la.loanOffers$(),
    }).pipe(
      switchMap(({ counters, offers }) => {
        const offer = offers.find(o => o.id === appNode.data.offer_id);
        if (!offer) return of({ ok: false, error: 'Offer not found' } as Fail);

        let counter = counters.find(c => c.data.offer_id === offer.id && c.data.period === period);
        if (!counter) {
          // Create missing monthly counter
          return this.la
            .add<OfferCounter>('offer_counters', {
              offer_id: offer.id,
              period,
              slots_remaining: offer.data.slots_total,
            })
            .pipe(switchMap((created) => this._decrementApproveAndCreatePayment(appNode, created as any)));
        }
        return this._decrementApproveAndCreatePayment(appNode, counter);
      }),
      catchError((e) => of({ ok: false, error: e?.message || 'Approval failed' }))
    );
  }

  private _decrementApproveAndCreatePayment(
    appNode: ICollectionData<Application>,
    counterNode: ICollectionData<OfferCounter>
  ): Observable<Ok | Fail> {
    if (counterNode.data.slots_remaining <= 0) {
      return of({ ok: false, error: 'No slots remaining for this offer' });
    }

    const origCounter = { ...counterNode.data };

    // 1) decrement counter
    counterNode.data.slots_remaining -= 1;
    this.rules.touch(counterNode);

    // 2) approve app
    appNode.data.status = ApplicationStatus.APPROVED;
    appNode.data.approved_at = new Date().toISOString();
    this.rules.touch(appNode);

    // 3) write updates, then create payment
    return forkJoin([
      this.la.update(counterNode),
      this.la.update(appNode),
    ]).pipe(
      switchMap(() =>
        this.la.createPayment(appNode.id, appNode.data.requested_amount_cents, PaymentMethod.RTC)
      ),
      map(() => ({ ok: true } as Ok)),
      catchError((e) =>
        // COMPENSATE (best-effort)
        forkJoin([
          (counterNode.data.slots_remaining = origCounter.slots_remaining, this.la.update(counterNode)),
          (appNode.data = { ...appNode.data, status: ApplicationStatus.SUBMITTED, approved_at: undefined }, this.la.update(appNode)),
        ]).pipe(
          switchMap(() => of({ ok: false, error: e?.message || 'Approval failed' } as Fail)),
          catchError(() => of({ ok: false, error: 'Approval failed (rollback attempted)' } as Fail))
        )
      )
    );
  }

  /** Mark a Payment SUCCESS and set its Application to PAID */
  markPaid$(
    paymentNode: ICollectionData<{ application_id: number; processed_at?: string; status: string; reference?: string }>,
    reference?: string
  ): Observable<Ok | Fail> {
    const now = new Date().toISOString();
    paymentNode.data.status = 'SUCCESS';
    paymentNode.data.processed_at = now;
    if (reference) paymentNode.data.reference = reference;
    this.rules.touch(paymentNode);

    return this.la.update(paymentNode).pipe(
      switchMap(() => this.la.applications$()),
      switchMap((apps) => {
        const app = apps.find(a => a.id === paymentNode.data.application_id);
        if (!app) return of({ ok: false, error: 'Application not found' } as Fail);
        app.data.status = ApplicationStatus.PAID;
        app.data.paid_at = now;
        this.rules.touch(app);
        return this.la.update(app).pipe(map(() => ({ ok: true } as Ok)));
      }),
      catchError((e) => of({ ok: false, error: e?.message || 'Mark paid failed' }))
    );
  }

  /** Initialize DebiCheck process for an application */
  initDebiCheck$(appNode: ICollectionData<Application>): Observable<Ok | Fail> {
    const event: DebiCheckEvent = {
      application_id: appNode.id,
      status: DebiCheckStatus.INITIATED,
      created_at: new Date().toISOString()
    };

    return this.la.add('debicheck_events', event, appNode.id).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError((e) => of({ ok: false, error: e?.message || 'DebiCheck init failed' }))
    );
  }

  /** Confirm or fail a DebiCheck process for an application */
  confirmDebiCheck$(
    appNode: ICollectionData<Application>,
    success = true,
    payload?: any
  ): Observable<Ok | Fail> {
    const event: DebiCheckEvent = {
      application_id: appNode.id,
      status: success ? DebiCheckStatus.CONFIRMED : DebiCheckStatus.FAILED,
      payload,
      created_at: new Date().toISOString()
    };

    return this.la.add('debicheck_events', event, appNode.id).pipe(
      map(() => ({ ok: true } as Ok)),
      catchError((e) => of({ ok: false, error: e?.message || 'DebiCheck confirmation failed' }))
    );
  }

  /** Get DebiCheck events for an application */
  debiCheckEvents$(appNode: ICollectionData<Application>): Observable<ICollectionData<DebiCheckEvent>[]> {
    return this.la.getDebiCheckEvents$(appNode.id);
  }
}
