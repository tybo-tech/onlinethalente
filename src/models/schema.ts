import { User } from './User';

// ===== CORE APPLICATION INTERFACE =====
export interface Application {
  // Legacy fields (keep for backward compatibility)
  comment?: string;
  created_at?: any;
  
  // Core loan details
  amount: number;
  requestedAmount?: number; // Original amount requested
  approvedAmount?: number; // Final approved amount
  type: string; // '15th', '25th', '30th' - repayment day
  purpose?: string;
  bankStatement?: string;
  
  // Enhanced status management
  status: 'draft' | 'submitted' | 'under_review' | 'pending_documents' | 'approved' | 'rejected' | 'disbursed' | 'active' | 'completed' | 'defaulted';
  substatus?: string; // Additional status details
  
  // Application metadata
  applicationNumber?: string; // Auto-generated unique reference
  loanProductId?: number; // Reference to loan product
  
  // Financial calculations
  interestRate?: number; // Annual percentage rate
  monthlyPayment?: number; // Calculated monthly payment
  totalRepayable?: number; // Total amount to be repaid
  term?: number; // Loan duration in months
  
  // Personal information (embedded)
  personalInfo?: PersonalInfo;
  
  // Employment information
  employmentInfo?: EmploymentInfo;
  
  // Document management
  documents?: ApplicationDocument[];
  requiredDocuments?: string[]; // List of required document types
  
  // Risk assessment
  creditAssessment?: CreditAssessment;
  
  // Timeline tracking
  timeline?: ApplicationTimeline;
  
  // Administrative notes
  adminNotes?: string;
  rejectionReason?: string;
  approvalConditions?: string[];
  
  // Payment information
  disbursementMethod?: 'bank_transfer' | 'cash' | 'mobile_money';
  bankDetails?: BankDetails;
  
  // Relationship data (populated from joins)
  _user?: User;
  _loanProduct?: LoanProduct;
  _paymentSchedule?: PaymentSchedule[];
  _notifications?: SystemNotification[];
}

// ===== SUPPORTING INTERFACES =====

// Personal Information
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  dependents?: number;
  phoneNumber: string;
  alternativePhone?: string;
  email: string;
  preferredLanguage?: string;
}

// Address Information
export interface Address {
  streetAddress: string;
  suburb?: string;
  city: string;
  province: string;
  postalCode: string;
  country?: string;
  residenceType?: 'owned' | 'rented' | 'family' | 'other';
  yearsAtAddress?: number;
}

// Employment Information
export interface EmploymentInfo {
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'pensioner' | 'student';
  employerName?: string;
  jobTitle?: string;
  workAddress?: Address;
  employmentStartDate?: string;
  monthlyIncome?: number;
  additionalIncome?: number;
  incomeSource?: string;
  payrollNumber?: string;
  supervisorContact?: string;
}

// Bank Details
export interface BankDetails {
  bankName: string;
  accountType: 'savings' | 'current' | 'transmission';
  accountNumber: string;
  branchCode: string;
  accountHolderName: string;
}

// Document Management
export interface ApplicationDocument {
  id?: string;
  type: 'id_document' | 'proof_of_income' | 'bank_statement' | 'proof_of_address' | 'employment_letter' | 'payslip';
  fileName: string;
  originalName: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  verifiedBy?: number; // Admin user ID
  verificationDate?: string;
  rejectionReason?: string;
  expiryDate?: string;
  notes?: string;
}

// Credit Assessment
export interface CreditAssessment {
  score: number; // Credit score out of 1000
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  affordabilityRatio: number; // Debt-to-income ratio
  recommendedAmount: number;
  maxAffordableAmount: number;
  assessmentDate: string;
  assessedBy?: number; // Admin user ID
  factors: AssessmentFactor[];
  creditBureauCheck?: boolean;
  previousLoans?: number;
  defaultHistory?: boolean;
}

// Assessment Factors
export interface AssessmentFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

// Application Timeline
export interface ApplicationTimeline {
  created?: string;
  submitted?: string;
  documentsReceived?: string;
  underReview?: string;
  creditCheckCompleted?: string;
  approved?: string;
  rejected?: string;
  disbursed?: string;
  firstPaymentDue?: string;
  completed?: string;
  defaulted?: string;
}

// Loan Products
export interface LoanProduct {
  id: number;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number; // months
  maxTerm: number; // months
  interestRate: number; // annual percentage
  processingFee?: number;
  requiredDocuments: string[];
  eligibilityCriteria: string[];
  features: string[];
  isActive: boolean;
  targetMarket?: string;
  riskCategory?: 'low' | 'medium' | 'high';
}

// Payment Schedule
export interface PaymentSchedule {
  id?: number;
  applicationId: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  fees?: number;
  remainingBalance: number;
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'waived';
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: 'bank_transfer' | 'cash' | 'debit_order' | 'mobile_money';
  transactionReference?: string;
  lateFee?: number;
  notes?: string;
}

// System Notifications
export interface SystemNotification {
  id?: number;
  userId: number;
  type: 'application_update' | 'payment_reminder' | 'document_request' | 'approval' | 'rejection' | 'disbursement';
  category: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  applicationId?: number;
  paymentId?: number;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired?: boolean;
  actionUrl?: string;
  scheduledFor?: string;
  sentAt?: string;
  readAt?: string;
  expiresAt?: string;
}

// Communication Log
export interface CommunicationLog {
  id?: number;
  applicationId: number;
  userId: number;
  adminId?: number;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'system';
  direction: 'inbound' | 'outbound';
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  createdAt: string;
  attachments?: string[];
}


// ===== ENHANCED SETTINGS =====


// ===== ENHANCED SETTINGS =====

export interface ISetting {
  type: string;         // Grouping (e.g., 'interest', 'limits', 'loan', 'notifications')
  key: string;          // Unique system key (e.g., 'base_interest_rate')
  label: string;        // Human-friendly label for display
  value: string | number | boolean; // Actual stored value
  input_type: 'number' | 'percent' | 'text' | 'toggle' | 'select' | 'textarea' | 'date'; // Field type
  description?: string; // Optional help text for UI
  category?: 'system' | 'business' | 'risk' | 'communication' | 'compliance';
  isEditable?: boolean; // Whether admins can modify this setting
  validation?: SettingValidation;
  options?: SettingOption[]; // For select inputs
  dependencies?: string[]; // Other settings this depends on
}

// Setting Validation Rules
export interface SettingValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string; // Regex pattern
  customMessage?: string;
}

// Setting Options for Select Types
export interface SettingOption {
  label: string;
  value: string | number;
  description?: string;
  isDefault?: boolean;
}

// Loan System Settings (predefined settings structure)
export interface LoanSystemSettings {
  // Interest & Fees
  baseInterestRate: number;
  latePenaltyRate: number;
  processingFeePercentage: number;
  maxProcessingFee: number;
  
  // Loan Limits
  minLoanAmount: number;
  maxLoanAmount: number;
  minLoanTerm: number;
  maxLoanTerm: number;
  
  // Risk Assessment
  minCreditScore: number;
  maxDebtToIncomeRatio: number;
  requireCreditBureauCheck: boolean;
  
  // Document Requirements
  requiredDocuments: string[];
  documentExpiryDays: number;
  
  // Business Rules
  maxActiveLoansPerUser: number;
  allowRefinancing: boolean;
  gracePeriodDays: number;
  
  // Communication
  sendSmsNotifications: boolean;
  sendEmailNotifications: boolean;
  reminderDaysBefore: number;
  
  // System
  applicationNumberPrefix: string;
  autoApprovalEnabled: boolean;
  autoApprovalThreshold: number;
}

// ===== UTILITY TYPES =====

// Application with calculated fields
export interface ApplicationWithCalculations extends Application {
  calculatedMonthlyPayment: number;
  calculatedTotalRepayable: number;
  riskScore: number;
  affordabilityStatus: 'good' | 'acceptable' | 'poor';
  recommendationStatus: 'auto_approve' | 'manual_review' | 'auto_reject';
}

// Application summary for listings
export interface ApplicationSummary {
  id: number;
  applicationNumber: string;
  userId: number;
  userName: string;
  amount: number;
  status: string;
  submittedAt: string;
  riskLevel?: string;
  daysInCurrentStatus: number;
  hasUnreadMessages: boolean;
}

// Dashboard statistics
export interface LoanDashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalDisbursed: number;
  totalOutstanding: number;
  averageProcessingTime: number;
  approvalRate: number;
  defaultRate: number;
  monthlyGrowth: number;
}

// User application history
export interface UserApplicationHistory {
  totalApplications: number;
  approvedLoans: number;
  rejectedApplications: number;
  activeLoans: number;
  completedLoans: number;
  totalBorrowed: number;
  totalRepaid: number;
  currentOutstanding: number;
  creditScore: number;
  paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
  nextPaymentDue?: string;
  nextPaymentAmount?: number;
}
