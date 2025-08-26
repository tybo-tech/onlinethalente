// -----------------------------------------------------------
// Domain enums & helper types
// -----------------------------------------------------------
export type SalaryDay = 15 | 25 | 31;

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  VERIFIED = 'VERIFIED',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  PAID = 'PAID',
  PARTIALLY_REPAID = 'PARTIALLY_REPAID',
  FULLY_REPAID = 'FULLY_REPAID',
  OVERDUE = 'OVERDUE',
}

export enum AIVerification {
  PENDING = 'PENDING',
  PASS = 'PASS',
  WARN = 'WARN',
  FAIL = 'FAIL',
}

export enum DebiCheckStatus {
  INITIATED = 'INITIATED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  RTC = 'RTC',
  PAYFAST = 'PAYFAST',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  REFUNDED = 'REFUNDED',
}

export type DocumentKind = 'BANK_STATEMENT';

// -----------------------------------------------------------
// Data interfaces for each collection
// (These go into ICollectionData<T>.data)
// -----------------------------------------------------------

// pay_cycles
export interface PayCycle {
  /** 15, 25 or 31 (salary date group) */
  salary_day: SalaryDay;
  /** '15th','25th','31st' */
  label: string;
  /** 16, 26 or 1 (release/open day) */
  release_day: number;
  /** Extra copy shown when sold out (optional override) */
  sold_out_message?: string;
}

// loan_offers
export interface LoanOffer {
  /** FK -> pay_cycles (ICollectionData id) */
  pay_cycle_id: number;
  /** cents to avoid float issues: 70000 = R700 */
  amount_cents: number;
  /** monthly slots at reset */
  slots_total: number;
  /** toggle */
  is_active: boolean;
  /** optional label for UI (e.g., "R700") */
  label?: string;
  /** Message to show when slots are full */
  sold_out_message?: string;
}

// offer_counters (per month)
export interface OfferCounter {
  /** FK -> loan_offers id */
  offer_id: number;
  /** first day of month 'YYYY-MM-01' */
  period: string;
  /** remaining slots in current month */
  slots_remaining: number;
}

// applications
export interface Application {
  /** FK -> users.id */
  user_id: number;
  /** FK -> pay_cycles id */
  pay_cycle_id: number;
  /** FK -> loan_offers id (optional; derived from clicked button) */
  offer_id?: number;

  requested_amount_cents: number;

  // Customer-provided banking & payroll info (from form)
  bank_name: string;
  salary_account: string;
  salary_day: SalaryDay;

  // Contact snapshot (redundant for convenience)
  full_name: string;
  phone: string;
  email: string;

  // Tracking fields
  id?: number;
  status: ApplicationStatus;
  submission_date?: string;
  decline_reason?: string;
  ai_verification: AIVerification;

  // Repayment tracking fields
  total_repaid_cents?: number; // Total amount repaid so far
  outstanding_balance_cents?: number; // Remaining balance
  repayment_due_date?: string; // ISO - When repayment is due
  last_repayment_date?: string; // ISO - Last payment received
  repayment_schedule?: {
    installments: number; // e.g., 1 for lump sum, 2+ for installments
    installment_amount_cents: number; // Amount per installment
    frequency: 'WEEKLY' | 'MONTHLY' | 'LUMP_SUM';
  };

  notes?: string;
  assigned_to_user_id?: number; // admin/agent

  // Audit timestamps
  created_at: string; // ISO
  updated_at?: string; // ISO
  submitted_at?: string; // ISO
  verified_at?: string; // ISO - When application was verified
  approved_at?: string; // ISO
  declined_at?: string; // ISO - When application was declined
  paid_at?: string; // ISO - When loan was disbursed
  fully_repaid_at?: string; // ISO - When loan was fully repaid
  overdue_at?: string; // ISO - When loan became overdue
}

// application_documents
export interface ApplicationDocument {
  /** FK -> applications id */
  application_id: number;
  kind: DocumentKind; // 'BANK_STATEMENT'
  storage_url: string;
  /** optional structured AI output */
  ai_result?: {
    verdict: AIVerification;
    reasons?: string[];
    meta?: Record<string, any>;
  };
  uploaded_at?: string; // ISO
}

// debicheck_events
export interface DebiCheckEvent {
  /** FK -> applications id */
  application_id: number;
  status: DebiCheckStatus;
  payload?: any; // raw response if needed
  created_at?: string; // ISO
}

// payments (enhanced for repayment tracking)
export interface Payment {
  /** FK -> applications id */
  application_id: number;
  method: PaymentMethod; // RTC | PAYFAST
  status: PaymentStatus; // PENDING | SUCCESS | FAILED | PAID | PARTIAL | REFUNDED
  payment_type: 'DISBURSEMENT' | 'REPAYMENT'; // Track if it's loan payout or customer repayment
  reference?: string;
  amount_cents: number;

  // Enhanced tracking
  running_balance_cents?: number; // Outstanding balance after this payment
  installment_number?: number; // Which installment this represents (1, 2, 3...)

  // Metadata
  description?: string; // e.g., "Installment 1 of 3", "Full repayment", "Partial payment"
  gateway_transaction_id?: string; // PayFast or bank reference

  processed_at?: string; // ISO
  created_at?: string; // ISO
}

// repayment_plans (new collection for structured repayment tracking)
export interface RepaymentPlan {
  /** FK -> applications id */
  application_id: number;
  plan_type: 'LUMP_SUM' | 'INSTALLMENTS';
  total_amount_cents: number; // Original loan amount + interest/fees
  installments_count: number; // 1 for lump sum, 2+ for installments
  installment_amount_cents: number;
  frequency: 'WEEKLY' | 'MONTHLY' | 'LUMP_SUM';

  // Status tracking
  is_active: boolean;
  total_paid_cents: number;
  outstanding_balance_cents: number;

  // Dates
  start_date: string; // ISO - When repayment plan starts
  due_date: string; // ISO - Final due date
  next_payment_due: string; // ISO - Next installment due

  // Audit
  created_at: string; // ISO
  updated_at?: string; // ISO
}

// banking_details (org-level)
export interface BankingDetails {
  account_holder: string;
  bank_name: string;
  account_number: string;
  branch_code?: string;
  // PayFast config (if exposed in admin)
  payfast_merchant_id?: string;
  payfast_merchant_key?: string;
  payfast_passphrase?: string;
  updated_by_user_id?: number;
  updated_at?: string; // ISO
}

// -----------------------------------------------------------
// Init helpers (pure data payloads to feed initCollectionData)
// -----------------------------------------------------------



export const initPayCycle = (salary_day: SalaryDay): PayCycle => ({
  salary_day,
  label: `${salary_day}th`,
  release_day: salary_day === 15 ? 16 : salary_day === 25 ? 26 : 1,
  sold_out_message:
    salary_day === 15
      ? 'Kindly come back on the 1st.'
      : salary_day === 25
      ? 'Kindly come back on the 16th.'
      : 'Kindly come back on the 26th.',
});

export const initLoanOffer = (
  pay_cycle_id: number,
  amount_cents: number,
  slots_total: number
): LoanOffer => ({
  pay_cycle_id,
  amount_cents,
  slots_total,
  is_active: true,
  label: `R${(amount_cents / 100).toFixed(0)}`,
});

export const initOfferCounter = (
  offer_id: number,
  periodISOyyyyMm01: string,
  slots_total: number
): OfferCounter => ({
  offer_id,
  period: periodISOyyyyMm01,
  slots_remaining: slots_total,
});

export const initApplication = (args: Partial<Application>): Application => {
  const now = new Date().toISOString();
  return {
    user_id: 0,
    pay_cycle_id: 0,
    offer_id: undefined,
    requested_amount_cents: 0,
    bank_name: '',
    salary_account: '',
    salary_day: 15,
    full_name: '',
    phone: '',
    email: '',
    status: ApplicationStatus.SUBMITTED,
    ai_verification: AIVerification.PENDING,
    notes: '',
    assigned_to_user_id: undefined,
    // Required timestamps
    created_at: now,
    submitted_at: now,
    // Optional timestamps
    updated_at: undefined,
    approved_at: undefined,
    paid_at: undefined,
    ...args,
  };
};

export const initApplicationDocument = (
  application_id: number,
  storage_url: string
): ApplicationDocument => ({
  application_id,
  kind: 'BANK_STATEMENT',
  storage_url,
  ai_result: { verdict: AIVerification.PENDING },
  uploaded_at: new Date().toISOString(),
});

export const initDebiCheckEvent = (
  application_id: number,
  status: DebiCheckStatus,
  payload?: any
): DebiCheckEvent => ({
  application_id,
  status,
  payload,
  created_at: new Date().toISOString(),
});

export const initPayment = (
  application_id: number,
  method: PaymentMethod,
  amount_cents: number,
  payment_type: 'DISBURSEMENT' | 'REPAYMENT' = 'DISBURSEMENT'
): Payment => ({
  application_id,
  method,
  status: PaymentStatus.PENDING,
  payment_type,
  reference: '',
  amount_cents,
  processed_at: '',
  created_at: new Date().toISOString(),
});

export const initRepaymentPlan = (
  application_id: number,
  total_amount_cents: number,
  plan_type: 'LUMP_SUM' | 'INSTALLMENTS' = 'LUMP_SUM',
  installments_count: number = 1
): RepaymentPlan => {
  const installment_amount = plan_type === 'LUMP_SUM' ? total_amount_cents : Math.ceil(total_amount_cents / installments_count);
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setMonth(dueDate.getMonth() + (plan_type === 'LUMP_SUM' ? 1 : installments_count));

  return {
    application_id,
    plan_type,
    total_amount_cents,
    installments_count,
    installment_amount_cents: installment_amount,
    frequency: plan_type === 'LUMP_SUM' ? 'LUMP_SUM' : 'MONTHLY',
    is_active: true,
    total_paid_cents: 0,
    outstanding_balance_cents: total_amount_cents,
    start_date: now.toISOString(),
    due_date: dueDate.toISOString(),
    next_payment_due: now.toISOString(),
    created_at: now.toISOString(),
  };
};

export const initBankingDetails = (): BankingDetails => ({
  account_holder: '',
  bank_name: '',
  account_number: '',
  branch_code: '',
  payfast_merchant_id: '',
  payfast_merchant_key: '',
  payfast_passphrase: '',
  updated_by_user_id: 0,
  updated_at: new Date().toISOString(),
});
