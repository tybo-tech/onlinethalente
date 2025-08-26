import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { BusinessRulesService } from './business-rules.service';
import {
  PayCycle, LoanOffer, OfferCounter, Application,
  ApplicationStatus, SalaryDay, AIVerification
} from '../../models/schema';
import { ICollectionData } from '../../models/ICollection';
import { LendingAdapter } from './lending.adapter';

@Injectable({ providedIn: 'root' })
export class SeedDevDataService {
  private la = inject(LendingAdapter);
  private rules = inject(BusinessRulesService);

  /** Ensure pay cycles (15/25/31), 2 offers per cycle (R700 x6, R500 x10), counters for this month, banking row. */
  seedAdminBaseline$(): Observable<void> {
    const period = this.rules.currentPeriodISO();

    return forkJoin({
      pcs: this.la.payCycles$(),
      offers: this.la.loanOffers$(),
      counters: this.la.offerCounters$(),
      bankRows: this.la.bankingDetails$(),
    }).pipe(
      switchMap(({ pcs, offers, counters, bankRows }) => {
        const ensurePc$ = (
          day: SalaryDay,
          label: string,
          release: number
        ): Observable<ICollectionData<PayCycle>> => {
          const found = pcs.find(p => p.data.salary_day === day);
          if (found) return of(found);
          const data: PayCycle = { salary_day: day, label, release_day: release, sold_out_message: undefined };
          return this.la.add<PayCycle>('pay_cycles', data);
        };

        // 1) Pay cycles
        return forkJoin([
          ensurePc$(15, '15th', 16),
          ensurePc$(25, '25th', 26),
          ensurePc$(31, '31st', 1),
        ]).pipe(
          switchMap(([pc15, pc25, pc31]) => {
            // 2) Offers (R700/R500 per cycle)
            const ensureOffer$ = (
              pc: ICollectionData<PayCycle>,
              amount: number,
              slots: number,
              interestRate: number = 24.0
            ): Observable<ICollectionData<LoanOffer>> => {
              const exists = offers.find(o => o.data.pay_cycle_id === pc.id && o.data.amount_cents === amount);
              if (exists) return of(exists);
              const lo: LoanOffer = {
                pay_cycle_id: pc.id,
                amount_cents: amount,
                interest_rate_percent: interestRate,
                slots_total: slots,
                is_active: true,
                label: `R${(amount / 100).toFixed(0)}`
              };
              return this.la.add<LoanOffer>('loan_offers', lo);
            };

            return forkJoin([
              ensureOffer$(pc15, 70000, 6, 24.0), ensureOffer$(pc15, 50000, 10, 22.0),
              ensureOffer$(pc25, 70000, 6, 24.0), ensureOffer$(pc25, 50000, 10, 22.0),
              ensureOffer$(pc31, 70000, 6, 24.0), ensureOffer$(pc31, 50000, 10, 22.0),
            ]).pipe(
              switchMap((createdOffers) => {
                const allOffers = [...offers, ...createdOffers];

                // 3) Counters for this month (seed to slots_total if missing)
                const ensureCounter$ = (
                  offer: ICollectionData<LoanOffer>
                ): Observable<ICollectionData<OfferCounter>> => {
                  const exists = counters.find(c => c.data.offer_id === offer.id && c.data.period === period);
                  if (exists) return of(exists);
                  const oc: OfferCounter = {
                    offer_id: offer.id,
                    period,
                    slots_remaining: offer.data.slots_total
                  };
                  return this.la.add<OfferCounter>('offer_counters', oc);
                };

                const counterTasks: Observable<ICollectionData<OfferCounter>>[] =
                  allOffers.filter(o => o.data.is_active).map(o => ensureCounter$(o));

                // Explicitly type the stream to avoid null unions
                const countersRun$: Observable<ICollectionData<OfferCounter>[]> =
                  counterTasks.length ? forkJoin(counterTasks) : of([]);

                // 4) Banking details (ensure one row)
                const ensureBanking$ = bankRows.length
                  ? of(bankRows[0])
                  : this.la.add('banking_details', {
                      account_holder: 'Onlinethalente (Pty) Ltd',
                      bank_name: 'Discovery Bank',
                      account_number: '000123456789',
                      branch_code: '679000',
                      payfast_merchant_id: '10000100',
                      payfast_merchant_key: 'abc123xyz',
                      payfast_passphrase: '',
                    });

                return countersRun$.pipe(
                  switchMap(() => ensureBanking$),
                  map(() => void 0) // <- end with void to satisfy return signature
                );
              })
            );
          })
        );
      })
    );
  }

  /** Optional: seed a couple of sample applications into SUBMITTED to test the queue */
  seedSampleApplications$(): Observable<void> {
    return forkJoin({
      offers: this.la.loanOffers$(),
      apps: this.la.applications$(),
    }).pipe(
      switchMap(({ offers, apps }) => {
        if (!offers.length) return of(void 0);
        if (apps.length > 0) return of(void 0);

        const createSampleApp = (
          full_name: string,
          email: string,
          phone: string,
          offerId: number,
          amount: number,
          salary_day: SalaryDay
        ): Application => {
          const now = new Date().toISOString();
          return {
            user_id: 0,
            pay_cycle_id: offers.find(o => o.id === offerId)!.data.pay_cycle_id,
            offer_id: offerId,
            requested_amount_cents: amount,
            bank_name: 'Discovery',
            salary_account: '1234567890',
            salary_day,
            full_name, email, phone,
            status: ApplicationStatus.SUBMITTED,
            ai_verification: AIVerification.PENDING,
            created_at: now,
            submitted_at: now,
            updated_at: now
          };
        };

        const offer15 = offers.find(o => o.data.amount_cents === 70000) || offers[0];
        const offer25 = offers.find(o => o.data.pay_cycle_id !== offer15.data.pay_cycle_id) || offers[1];

        return forkJoin([
          this.la.add<Application>('applications', createSampleApp('Jane Doe', 'jane@example.com', '0834567890', offer15.id, 70000, 15)),
          this.la.add<Application>('applications', createSampleApp('Thabo M.', 'thabo@example.com', '0721112222', offer25.id, 50000, 25))
        ]).pipe(map(() => void 0));
      })
    );
  }
}
