import { Injectable, inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { LendingAdapter } from './business/lending.adapter';
import { BusinessRulesService } from './business/business-rules.service';
import { Application, ApplicationStatus, AIVerification, SalaryDay } from '../models/schema';

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

  visibleOffers$(salaryDay: SalaryDay) {
    const period = this.rules.currentPeriodISO();
    return combineLatest([
      this.la.payCycles$(),
      this.la.loanOffers$(),
      this.la.offerCounters$(),
    ]).pipe(
      map(([pcs, offers, counters]) => {
        const pc = pcs.find(p => p.data.salary_day === salaryDay);
        if (!pc) return [];

        const isWindowOpen = this.rules.isWindowOpen(salaryDay);
        const byId = new Map(
          counters
            .filter(c => c.data.period === period)
            .map(c => [c.data.offer_id, c])
        );

        return offers
          .filter(o => o.data.is_active && o.data.pay_cycle_id === pc.id)
          .map(o => {
            const counter = byId.get(o.id);
            const slots_remaining = counter?.data.slots_remaining ?? 0;

            return {
              id: o.id,
              amount_cents: o.data.amount_cents,
              slots_remaining,
              pay_cycle_label: pc.data.label,
              disabled: !isWindowOpen || slots_remaining <= 0,
              sold_out_message: slots_remaining <= 0 ? (pc.data.sold_out_message || 'No slots available') : undefined
            };
          });
      })
    );
  }

  createApplication(data: Partial<Application>) {
    return this.la.add<Application>('applications', {
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
      status: ApplicationStatus.SUBMITTED
    });
  }

  addApplicationDoc(application_id: number, url: string, kind: string) {
    return this.la.add('application_documents', { application_id, url, kind });
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

  async searchApplication(email?: string, idNumber?: string): Promise<Application | null> {
    // TODO: Implement proper search through lending adapter
    // For now, return mock data for demonstration
    return {
      id: 12345,
      status: 'SUBMITTED',
      submission_date: new Date().toISOString(),
      data: {
        email,
        idNumber
      }
    } as any;
  }

  async getApplicationById(id: string): Promise<Application | null> {
    // TODO: Implement proper lookup through lending adapter
    // For now, return mock data for demonstration
    return {
      id: parseInt(id),
      status: 'SUBMITTED',
      submission_date: new Date().toISOString(),
      data: {}
    } as any;
  }
}
