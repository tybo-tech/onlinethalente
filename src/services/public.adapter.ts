import { Injectable, inject } from '@angular/core';
import { combineLatest, map, firstValueFrom } from 'rxjs';
import { LendingAdapter } from './business/lending.adapter';
import { BusinessRulesService } from './business/business-rules.service';
import { ToastService } from './toast.service';
import { LocalDoc } from '../app/components/home/apply/document-uploader';
import {
  Application,
  ApplicationStatus,
  AIVerification,
  SalaryDay,
} from '../models/schema';
import { ICollectionData } from '../models/ICollection';

export interface VisibleOffer {
  id: number;
  amount_cents: number;
  slots_remaining: number;
  pay_cycle_label: string;
  disabled: boolean;
  sold_out_message?: string;
}

@Injectable({ providedIn: 'root' })
export class PublicAdapter {
  private la = inject(LendingAdapter);
  private rules = inject(BusinessRulesService);
  private toast = inject(ToastService);

  async validateApplicationEligibility(userId: number): Promise<boolean> {
    try {
      // Get all applications for the user
      const applications = await firstValueFrom(this.la.applications$());
      const userApplications = applications.filter(
        (app) => app.parent_id === userId
      );

      // If no applications, user can apply
      if (!userApplications || userApplications.length === 0) {
        return true;
      }

      // Check if all existing applications are paid or rejected
      const hasOpenApplications = userApplications.some(
        (app) =>
          app.data.status === ApplicationStatus.SUBMITTED ||
          app.data.status === ApplicationStatus.VERIFIED ||
          app.data.status === ApplicationStatus.APPROVED
      );

      if (hasOpenApplications) {
        this.toast.error(
          'You have pending applications. Please complete or pay existing applications before applying for a new loan.'
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking application eligibility:', error);
      this.toast.error(
        'Error checking your application status. Please try again.'
      );
      return false;
    }
  }

  validateBankStatements(documents: LocalDoc[]): boolean {
    // Check if documents array exists and has items
    if (!documents || documents.length === 0) {
      this.toast.error(
        'Please upload your bank statements. This is required for all applications.'
      );
      return false;
    }

    // Consider all PDF or image files as bank statements for now
    const bankStatements = documents.filter(
      (doc) =>
        doc.type.includes('pdf') ||
        doc.type.includes('jpeg') ||
        doc.type.includes('png')
    );

    if (bankStatements.length === 0) {
      this.toast.error(
        'Please upload your bank statements in PDF or image format.'
      );
      return false;
    }

    return true;
  }

  visibleOffers$(salaryDay: SalaryDay) {
    const period = this.rules.currentPeriodISO();
    return combineLatest([
      this.la.payCycles$(),
      this.la.loanOffers$(),
      this.la.offerCounters$(),
    ]).pipe(
      map(([pcs, offers, counters]) => {
        const pc = pcs.find((p) => p.data.salary_day === salaryDay);
        if (!pc) return [];

        const isWindowOpen = this.rules.isWindowOpen(salaryDay);
        const byId = new Map(
          counters
            .filter((c) => c.data.period === period)
            .map((c) => [c.data.offer_id, c])
        );

        return offers
          .filter((o) => o.data.is_active && o.data.pay_cycle_id === pc.id)
          .map((o) => {
            const counter = byId.get(o.id);
            const counterSlots = counter?.data.slots_remaining ?? 0;
            const offerSlots = o.data.slots_total ?? 0;

            // Available slots is the minimum of counter slots and offer slots
            const slots_remaining = Math.min(counterSlots, offerSlots);

            return {
              id: o.id,
              amount_cents: o.data.amount_cents,
              slots_remaining,
              pay_cycle_label: pc.data.label,
              disabled: !isWindowOpen || slots_remaining <= 0 || offerSlots <= 0,
              sold_out_message:
                slots_remaining <= 0 || offerSlots <= 0
                  ? pc.data.sold_out_message || 'No slots available'
                  : undefined,
            };
          });
      })
    );
  }

  createApplication(data: Partial<Application>) {
    return this.la.add<Application>(
      'applications',
      {
        user_id: 0,
        pay_cycle_id: 0,
        requested_amount_cents: 0,
        bank_name: '',
        salary_account: '',
        salary_day: 15,
        full_name: '',
        phone: '',
        email: '',
        ai_verification: AIVerification.PENDING,
        created_at: new Date().toISOString(),
        ...data,
        status: ApplicationStatus.SUBMITTED,
      },
      data.user_id
    );
  }

  /** Decrement offer counter when application is submitted */
  decrementOfferCounter(offerId: number): Promise<boolean> {
    const period = this.rules.currentPeriodISO();
    return firstValueFrom(
      this.la.updateOfferCounter(offerId, period, 1).pipe(
        map(result => !!result)
      )
    ).catch(error => {
      console.error('Failed to update offer counter:', error);
      return false;
    });
  }

  /** Decrement loan offer slots_total when application is submitted */
  decrementLoanOfferSlots(offerId: number): Promise<boolean> {
    return firstValueFrom(
      this.la.decrementLoanOfferSlots(offerId, 1).pipe(
        map(result => !!result)
      )
    ).catch(error => {
      console.error('Failed to update loan offer slots:', error);
      return false;
    });
  }

  addApplicationDoc(application_id: number, url: string, kind: string) {
    return this.la.add(
      'application_documents',
      { application_id, url, kind },
      application_id // Make sure to include the application ID as the parent ID
    );
  }

  getNextOpenDate(salaryDay: SalaryDay): string {
    const date = this.rules.nextOpenDate(salaryDay);
    return date.toString();
  }

  isWindowOpen(salaryDay: SalaryDay): boolean {
    return this.rules.isWindowOpen(salaryDay);
  }

  getWindowMessage(salaryDay: SalaryDay): string {
    return salaryDay === 15
      ? 'Kindly come back on the 16th.'
      : salaryDay === 25
      ? 'Kindly come back on the 26th.'
      : 'Kindly come back on the 1st.';
  }

  async searchApplication(
    email?: string,
    idNumber?: string
  ): Promise<Application | null> {
    // TODO: Implement proper search through lending adapter
    // For now, return mock data for demonstration
    return {
      id: 12345,
      status: 'SUBMITTED',
      submission_date: new Date().toISOString(),
      data: {
        email,
        idNumber,
      },
    } as any;
  }

  async getApplicationById(id: number): Promise<ICollectionData<Application> | null> {
    const app = await firstValueFrom(this.la.getById<Application>(id));
    return app;
  }
}
