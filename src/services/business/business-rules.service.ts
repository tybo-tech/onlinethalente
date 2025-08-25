// src/app/services/business/business-rules.service.ts
import { Injectable } from '@angular/core';
import {
  Application, LoanOffer, OfferCounter, PayCycle,
  ApplicationStatus, SalaryDay
} from '../../models/schema';
import { ICollectionData, CollectionNames } from '../../models/ICollection';

@Injectable({ providedIn: 'root' })
export class BusinessRulesService {
  // ---------- Date helpers ----------
  currentPeriodISO(d = new Date()): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }
  monthPrefix(d = new Date()): string {
    return this.currentPeriodISO(d).slice(0, 7); // 'YYYY-MM'
  }

  // ---------- Window logic ----------
  isWindowOpen(salaryDay: SalaryDay, d = new Date()): boolean {
    const day = d.getDate();
    if (salaryDay === 15) return day >= 16 && day <= 25;
    if (salaryDay === 25) return day >= 26 || day === 30 || day === 31; // end-of-month wrap
    if (salaryDay === 31) return day >= 1 && day <= 15;
    return false;
  }
  nextOpenDate(salaryDay: SalaryDay): number {
    if (salaryDay === 15) return 1;
    if (salaryDay === 25) return 16;
    return 26; // 31st group
  }

  // ---------- Validators ----------
  validatePayCycle(pc: PayCycle): string[] {
    const errs: string[] = [];
    if (![15, 25, 31].includes(pc.salary_day)) errs.push('salary_day must be 15|25|31');
    if (![1, 16, 26].includes(pc.release_day)) errs.push('release_day must be 1|16|26');
    if (!pc.label) errs.push('label is required');
    return errs;
  }

  validateLoanOffer(lo: LoanOffer): string[] {
    const errs: string[] = [];
    if (!Number.isInteger(lo.pay_cycle_id)) errs.push('pay_cycle_id required');
    if (!Number.isInteger(lo.amount_cents) || lo.amount_cents <= 0) errs.push('amount_cents must be > 0');
    if (!Number.isInteger(lo.slots_total) || lo.slots_total < 0) errs.push('slots_total must be >= 0');
    return errs;
  }

  validateOfferCounter(oc: OfferCounter): string[] {
    const errs: string[] = [];
    if (!Number.isInteger(oc.offer_id)) errs.push('offer_id required');
    if (!/^\d{4}-\d{2}-01$/.test(oc.period)) errs.push('period must be YYYY-MM-01');
    if (!Number.isInteger(oc.slots_remaining) || oc.slots_remaining < 0) errs.push('slots_remaining >= 0');
    return errs;
  }

  validateApplication(a: Application): string[] {
    const errs: string[] = [];
    if (!a.full_name) errs.push('full_name required');
    if (!a.email) errs.push('email required');
    if (!a.phone) errs.push('phone required');
    if (!a.bank_name) errs.push('bank_name required');
    if (!a.salary_account) errs.push('salary_account required');
    if (![15, 25, 31].includes(a.salary_day)) errs.push('salary_day must be 15|25|31');
    if (!Number.isInteger(a.requested_amount_cents) || a.requested_amount_cents <= 0) errs.push('requested_amount_cents > 0');
    if (!Object.values(ApplicationStatus).includes(a.status)) errs.push('status invalid');
    return errs;
  }

  // ---------- Save hygiene ----------
  touch<T>(node: ICollectionData<T>): void {
    node.website_id = node.website_id || CollectionNames.WebsiteId;
    node.updated_at = new Date().toISOString();
    if (!node.created_at) node.created_at = node.updated_at;
    if (node.selected == null) node.selected = false;
    if (!Array.isArray(node.children)) node.children = [];
  }
}
