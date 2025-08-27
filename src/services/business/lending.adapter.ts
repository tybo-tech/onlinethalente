import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, of } from 'rxjs';
import { CollectionDataService } from '../collection.data.service';
import { ICollectionData, initCollectionData } from '../../models/ICollection';
import {
  PayCycle,
  LoanOffer,
  OfferCounter,
  Application,
  ApplicationDocument,
  Payment,
  BankingDetails,
  PaymentMethod,
  PaymentStatus,
  DebiCheckEvent
} from '../../models/schema';

type Node<T> = ICollectionData<T>;

@Injectable({ providedIn: 'root' })
export class LendingAdapter {
  private cds = inject(CollectionDataService<any, any>);

  // ---- Lists (one-shot HTTP)
  payCycles$(): Observable<Node<PayCycle>[]> {
    return this.cds.getDataByCollectionId(
      'pay_cycles'
    ) as unknown as Observable<Node<PayCycle>[]>;
  }
  loanOffers$(): Observable<Node<LoanOffer>[]> {
    return this.cds.getDataByCollectionId(
      'loan_offers'
    ) as unknown as Observable<Node<LoanOffer>[]>;
  }
  offerCounters$(): Observable<Node<OfferCounter>[]> {
    return this.cds.getDataByCollectionId(
      'offer_counters'
    ) as unknown as Observable<Node<OfferCounter>[]>;
  }
  applications$(): Observable<Node<Application>[]> {
    return this.cds.getDataByCollectionId(
      'applications'
    ) as unknown as Observable<Node<Application>[]>;
  }
  applicationDocs$(
    applicationId: number
  ): Observable<Node<ApplicationDocument>[]> {
    return (
      this.cds.getDataByCollectionId(
        'application_documents'
      ) as unknown as Observable<Node<ApplicationDocument>[]>
    ).pipe(
      map((docs) => docs.filter((d) => d.data.application_id === applicationId))
    );
  }
  payments$(): Observable<Node<Payment>[]> {
    return this.cds.getDataByCollectionId('payments') as unknown as Observable<
      Node<Payment>[]
    >;
  }
  bankingDetails$(): Observable<Node<BankingDetails>[]> {
    return this.cds.getDataByCollectionId(
      'banking_details'
    ) as unknown as Observable<Node<BankingDetails>[]>;
  }

  /** Get DebiCheck events for an application */
  getDebiCheckEvents$(applicationId: number): Observable<Node<DebiCheckEvent>[]> {
    return (
      this.cds.getDataByCollectionId(
        'debicheck_events'
      ) as unknown as Observable<Node<DebiCheckEvent>[]>
    ).pipe(
      map((events) => events.filter((e) => e.data.application_id === applicationId))
    );
  }

  // ---- Mutations
  add<T>(
    collection_id: string,
    data: T,
    parent_id = 0
  ): Observable<ICollectionData<T>> {
    const node = initCollectionData<T, any>(
      collection_id as any,
      data,
      parent_id
    );
    return this.cds.addData(node) as unknown as Observable<ICollectionData<T>>;
  }
  update<T>(node: Node<T>): Observable<Node<T>> {
    return this.cds.updateData(node) as unknown as Observable<Node<T>>;
  }
  remove<T>(node: Node<T>): Observable<void> {
    return this.cds.deleteData(node.id) as Observable<void>;
  }

  // Query
  getById<T>(id: number) {
    return this.cds.getDataById(id).pipe(
      map((node) => node || null)
    );
  }

  listByCollection<T>(collectionId: string) {
    return this.cds.getDataByCollectionId(collectionId).pipe(
      map((nodes) => nodes.filter((node) => node.id !== null))
    );
  }

  // ---- Helpers
  /** First day of current month in local time 'YYYY-MM-01' */
  currentPeriodISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }

  createPayment(
    application_id: number,
    amount_cents: number,
    method: PaymentMethod = PaymentMethod.RTC
  ): Observable<ICollectionData<Payment>> {
    return this.add<Payment>('payments', {
      application_id,
      method,
      status: PaymentStatus.PENDING,
      amount_cents,
      payment_type: 'DISBURSEMENT',
      reference: '',
      processed_at: '',
    }, application_id);
  }

  /** Update offer counter when an application is submitted */
  updateOfferCounter(
    offerId: number,
    period: string,
    slotsDecrement: number = 1
  ): Observable<Node<OfferCounter> | null> {
    return this.offerCounters$().pipe(
      switchMap((counters: Node<OfferCounter>[]) => {
        const counter = counters.find((c: Node<OfferCounter>) =>
          c.data.offer_id === offerId && c.data.period === period
        );

        if (!counter) {
          console.warn(`No counter found for offer ${offerId} in period ${period}`);
          return of(null);
        }

        // Update the counter
        const updatedCounter = {
          ...counter,
          data: {
            ...counter.data,
            slots_remaining: Math.max(0, counter.data.slots_remaining - slotsDecrement)
          }
        };

        // Save the updated counter
        return this.update(updatedCounter);
      })
    );
  }

  /** Update loan offer slots_total when an application is submitted */
  decrementLoanOfferSlots(
    offerId: number,
    slotsDecrement: number = 1
  ): Observable<Node<LoanOffer> | null> {
    return this.loanOffers$().pipe(
      switchMap((offers: Node<LoanOffer>[]) => {
        const offer = offers.find((o: Node<LoanOffer>) => o.id === offerId);

        if (!offer) {
          console.warn(`No loan offer found with ID ${offerId}`);
          return of(null);
        }

        // Update the offer's slots_total
        const updatedOffer = {
          ...offer,
          data: {
            ...offer.data,
            slots_total: Math.max(0, offer.data.slots_total - slotsDecrement)
          }
        };

        // Save the updated offer
        return this.update(updatedOffer);
      })
    );
  }
}
