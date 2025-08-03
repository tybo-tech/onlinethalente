// apply.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormInput } from '../../../../models/FormInput';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../models/ICollection';
import { Application, ApplicationDocument } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { UserService } from '../../../../services/user.service';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormComponent,
  ],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss',
})
export class ApplyComponent implements OnInit {
  // Enhanced form structure - organized by sections
  email = 'support@onlinethalente.co.za';
  personalInfoInputs: FormInput[] = [
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your last name',
    },
    {
      key: 'idNumber',
      label: 'ID Number',
      type: 'text',
      required: true,
      placeholder: 'Enter your South African ID number',
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: 'Enter your mobile number',
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
    },
    {
      key: 'maritalStatus',
      label: 'Marital Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Single', value: 'single' },
        { label: 'Married', value: 'married' },
        { label: 'Divorced', value: 'divorced' },
        { label: 'Widowed', value: 'widowed' },
      ],
      placeholder: 'Select your marital status',
    },
    {
      key: 'dependents',
      label: 'Number of Dependents',
      type: 'number',
      placeholder: 'How many people depend on your income?',
    },
  ];

  addressInputs: FormInput[] = [
    {
      key: 'streetAddress',
      label: 'Street Address',
      type: 'text',
      required: true,
      placeholder: 'Enter your physical address',
    },
    {
      key: 'suburb',
      label: 'Suburb',
      type: 'text',
      placeholder: 'Enter suburb/area',
    },
    {
      key: 'city',
      label: 'City',
      type: 'text',
      required: true,
      placeholder: 'Enter your city',
    },
    {
      key: 'province',
      label: 'Province',
      type: 'select',
      required: true,
      options: [
        { label: 'Gauteng', value: 'gauteng' },
        { label: 'Western Cape', value: 'western_cape' },
        { label: 'KwaZulu-Natal', value: 'kwazulu_natal' },
        { label: 'Eastern Cape', value: 'eastern_cape' },
        { label: 'Free State', value: 'free_state' },
        { label: 'Limpopo', value: 'limpopo' },
        { label: 'Mpumalanga', value: 'mpumalanga' },
        { label: 'North West', value: 'north_west' },
        { label: 'Northern Cape', value: 'northern_cape' },
      ],
      placeholder: 'Select your province',
    },
    {
      key: 'postalCode',
      label: 'Postal Code',
      type: 'text',
      required: true,
      placeholder: 'Enter postal code',
    },
    {
      key: 'residenceType',
      label: 'Residence Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Own Home', value: 'owned' },
        { label: 'Renting', value: 'rented' },
        { label: 'Living with Family', value: 'family' },
        { label: 'Other', value: 'other' },
      ],
      placeholder: 'Select residence type',
    },
  ];

  employmentInputs: FormInput[] = [
    {
      key: 'employmentStatus',
      label: 'Employment Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Permanently Employed', value: 'employed' },
        { label: 'Self Employed', value: 'self_employed' },
        { label: 'Pensioner', value: 'pensioner' },
        { label: 'Student', value: 'student' },
        { label: 'Unemployed', value: 'unemployed' },
      ],
      placeholder: 'Select your employment status',
    },
    {
      key: 'employerName',
      label: 'Employer Name',
      type: 'text',
      placeholder: 'Enter your employer name',
    },
    {
      key: 'jobTitle',
      label: 'Job Title',
      type: 'text',
      placeholder: 'Enter your job title/position',
    },
    {
      key: 'monthlyIncome',
      label: 'Monthly Income (Net)',
      type: 'number',
      required: true,
      placeholder: 'Enter your monthly take-home salary',
    },
    {
      key: 'additionalIncome',
      label: 'Additional Income',
      type: 'number',
      placeholder: 'Any additional monthly income (optional)',
    },
    {
      key: 'employmentStartDate',
      label: 'Employment Start Date',
      type: 'date',
      placeholder: 'When did you start working here?',
    },
  ];

  loanDetailsInputs: FormInput[] = [
    {
      key: 'amount',
      label: 'Loan Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter the amount you wish to borrow',
    },
    {
      key: 'type',
      label: 'Repayment Date',
      type: 'select',
      required: true,
      options: [
        { label: '15th of each month', value: '15th' },
        { label: '25th of each month', value: '25th' },
        { label: '30th of each month', value: '30th' },
      ],
      placeholder: 'Select your preferred repayment date',
    },
    {
      key: 'term',
      label: 'Loan Term',
      type: 'select',
      required: true,
      options: [
        { label: '3 months', value: 3 },
        { label: '6 months', value: 6 },
        { label: '12 months', value: 12 },
        { label: '18 months', value: 18 },
        { label: '24 months', value: 24 },
      ],
      placeholder: 'Select loan duration',
    },
    {
      key: 'purpose',
      label: 'Loan Purpose',
      type: 'select',
      required: true,
      options: [
        { label: 'Debt Consolidation', value: 'debt_consolidation' },
        { label: 'Home Improvement', value: 'home_improvement' },
        { label: 'Medical Expenses', value: 'medical' },
        { label: 'Education', value: 'education' },
        { label: 'Vehicle Purchase', value: 'vehicle' },
        { label: 'Emergency Expenses', value: 'emergency' },
        { label: 'Business Investment', value: 'business' },
        { label: 'Other', value: 'other' },
      ],
      placeholder: 'What will you use the loan for?',
    },
    {
      key: 'purposeDescription',
      label: 'Purpose Description',
      type: 'textarea',
      placeholder: 'Please provide more details about the loan purpose',
    },
  ];

  bankDetailsInputs: FormInput[] = [
    {
      key: 'bankName',
      label: 'Bank Name',
      type: 'select',
      required: true,
      options: [
        { label: 'ABSA Bank', value: 'absa' },
        { label: 'Standard Bank', value: 'standard_bank' },
        { label: 'FNB', value: 'fnb' },
        { label: 'Nedbank', value: 'nedbank' },
        { label: 'Capitec Bank', value: 'capitec' },
        { label: 'Discovery Bank', value: 'discovery' },
        { label: 'African Bank', value: 'african_bank' },
        { label: 'Other', value: 'other' },
      ],
      placeholder: 'Select your bank',
    },
    {
      key: 'accountType',
      label: 'Account Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Savings Account', value: 'savings' },
        { label: 'Current Account', value: 'current' },
        { label: 'Transmission Account', value: 'transmission' },
      ],
      placeholder: 'Select account type',
    },
    {
      key: 'accountNumber',
      label: 'Account Number',
      type: 'text',
      required: true,
      placeholder: 'Enter your account number',
    },
    {
      key: 'branchCode',
      label: 'Branch Code',
      type: 'text',
      required: true,
      placeholder: 'Enter branch code',
    },
    {
      key: 'accountHolderName',
      label: 'Account Holder Name',
      type: 'text',
      required: true,
      placeholder: 'Name as it appears on your account',
    },
  ];

  documentInputs: FormInput[] = [
    {
      key: 'idDocument',
      label: 'Copy of ID Document',
      type: 'image',
      required: true,
      placeholder: 'Upload a clear copy of your ID document',
    },
    {
      key: 'bankStatement',
      label: '3 Months Bank Statement',
      type: 'image',
      required: true,
      placeholder: 'Upload your 3 months bank statement',
    },
    {
      key: 'proofOfIncome',
      label: 'Proof of Income',
      type: 'image',
      required: true,
      placeholder: 'Upload recent payslip or proof of income',
    },
    {
      key: 'proofOfAddress',
      label: 'Proof of Address',
      type: 'image',
      required: true,
      placeholder: 'Upload utility bill or proof of residence',
    },
  ];

  // Current form inputs (for backward compatibility)
  formInputs: FormInput[] = this.loanDetailsInputs;

  // Application flow state
  currentStep = 1;
  totalSteps = 6;
  stepTitles = [
    'Personal Information',
    'Address Details',
    'Employment Information',
    'Loan Details',
    'Bank Details',
    'Document Upload',
  ];

  // Form data collection
  applicationData: any = {}; // Use any for flexibility during form building
  initialData: any = {};
  loading = false;
  calculatedPayment = 0;
  calculatedTotal = 0;

  constructor(
    private service: CollectionDataService<Application>,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const localData = localStorage.getItem('applicationDraft');
    if (localData) {
      const parsed = JSON.parse(localData);
      this.initialData = {
        amount: parsed.amount,
        type: parsed.cycle, // map 'cycle' to 'type'
      };
      this.applicationData = { ...this.initialData };
    }

    // Set initial form inputs based on current step
    this.updateFormInputsForStep();
  }

  updateFormInputsForStep(): void {
    switch (this.currentStep) {
      case 1:
        this.formInputs = this.personalInfoInputs;
        break;
      case 2:
        this.formInputs = this.addressInputs;
        break;
      case 3:
        this.formInputs = this.employmentInputs;
        break;
      case 4:
        this.formInputs = this.loanDetailsInputs;
        this.calculateLoanPayments();
        break;
      case 5:
        this.formInputs = this.bankDetailsInputs;
        break;
      case 6:
        this.formInputs = this.documentInputs;
        break;
      default:
        this.formInputs = this.loanDetailsInputs;
    }
  }

  calculateLoanPayments(): void {
    const amount = this.applicationData.amount || 0;
    const term = this.applicationData.term || 12;
    const interestRate = 0.14; // 14% annual rate - should come from settings

    if (amount > 0 && term > 0) {
      const monthlyRate = interestRate / 12;
      const payment =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1);

      this.calculatedPayment = Math.round(payment * 100) / 100;
      this.calculatedTotal = Math.round(payment * term * 100) / 100;
    }
  }

  onStepData(data: any): void {
    // Save current step data
    this.applicationData = { ...this.applicationData, ...data };

    // Save draft to localStorage
    localStorage.setItem(
      'applicationDraft',
      JSON.stringify(this.applicationData)
    );

    // Auto-calculate payments if on loan details step
    if (this.currentStep === 4) {
      this.calculateLoanPayments();
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateFormInputsForStep();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateFormInputsForStep();
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
      this.updateFormInputsForStep();
    }
  }

  getCurrentStepData(): any {
    switch (this.currentStep) {
      case 1:
        return this.extractPersonalInfo();
      case 2:
        return this.extractAddressInfo();
      case 3:
        return this.extractEmploymentInfo();
      case 4:
        return this.extractLoanDetails();
      case 5:
        return this.extractBankDetails();
      case 6:
        return this.extractDocuments();
      default:
        return {};
    }
  }

  private extractPersonalInfo(): any {
    const data = this.applicationData;
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      idNumber: data.idNumber,
      phoneNumber: data.phoneNumber,
      email: data.email,
      maritalStatus: data.maritalStatus,
      dependents: data.dependents,
    };
  }

  private extractAddressInfo(): any {
    const data = this.applicationData;
    return {
      streetAddress: data.streetAddress,
      suburb: data.suburb,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      residenceType: data.residenceType,
    };
  }

  private extractEmploymentInfo(): any {
    const data = this.applicationData;
    return {
      employmentStatus: data.employmentStatus,
      employerName: data.employerName,
      jobTitle: data.jobTitle,
      monthlyIncome: data.monthlyIncome,
      additionalIncome: data.additionalIncome,
      employmentStartDate: data.employmentStartDate,
    };
  }

  private extractLoanDetails(): any {
    const data = this.applicationData;
    return {
      amount: data.amount,
      type: data.type,
      term: data.term,
      purpose: data.purpose,
      purposeDescription: data.purposeDescription,
    };
  }

  private extractBankDetails(): any {
    const data = this.applicationData;
    return {
      bankName: data.bankName,
      accountType: data.accountType,
      accountNumber: data.accountNumber,
      branchCode: data.branchCode,
      accountHolderName: data.accountHolderName,
    };
  }

  private extractDocuments(): any {
    const data = this.applicationData;
    return {
      idDocument: data.idDocument,
      bankStatement: data.bankStatement,
      proofOfIncome: data.proofOfIncome,
      proofOfAddress: data.proofOfAddress,
    };
  }

  onSave(data: any) {
    // Combine current step data with accumulated data
    this.applicationData = { ...this.applicationData, ...data };

    if (this.currentStep < this.totalSteps) {
      // If not on last step, just go to next step
      this.nextStep();
      return;
    }

    // Final submission on last step
    const user = this.userService.getUser;
    if (!user || !user.id) {
      alert('Please log in first.');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    // Build comprehensive application object
    const applicationPayload: Application = {
      // Legacy fields for backward compatibility
      comment: this.applicationData.purposeDescription || '',

      // Core loan details
      amount: this.applicationData.amount,
      requestedAmount: this.applicationData.amount,
      type: this.applicationData.type,
      purpose: this.applicationData.purpose,
      term: this.applicationData.term,

      // Financial calculations
      monthlyPayment: this.calculatedPayment,
      totalRepayable: this.calculatedTotal,
      interestRate: 0.14, // Should come from settings

      // Personal information embedded
      personalInfo: {
        firstName: this.applicationData.firstName,
        lastName: this.applicationData.lastName,
        idNumber: this.applicationData.idNumber,
        phoneNumber: this.applicationData.phoneNumber,
        email: this.applicationData.email,
        maritalStatus: this.applicationData.maritalStatus,
        dependents: this.applicationData.dependents,
      },

      // Employment information
      employmentInfo: {
        employmentStatus: this.applicationData.employmentStatus,
        employerName: this.applicationData.employerName,
        jobTitle: this.applicationData.jobTitle,
        monthlyIncome: this.applicationData.monthlyIncome,
        additionalIncome: this.applicationData.additionalIncome,
        employmentStartDate: this.applicationData.employmentStartDate,
        workAddress: {
          streetAddress: this.applicationData.streetAddress,
          city: this.applicationData.city,
          province: this.applicationData.province,
          postalCode: this.applicationData.postalCode,
          country: 'South Africa',
        },
      },

      // Bank details
      bankDetails: {
        bankName: this.applicationData.bankName,
        accountType: this.applicationData.accountType,
        accountNumber: this.applicationData.accountNumber,
        branchCode: this.applicationData.branchCode,
        accountHolderName: this.applicationData.accountHolderName,
      },

      // Document references
      bankStatement: this.applicationData.bankStatement,
      documents: this.buildDocumentArray(),

      // Application metadata
      applicationNumber: this.generateApplicationNumber(),
      status: 'submitted',

      // Timeline
      timeline: {
        created: new Date().toISOString(),
        submitted: new Date().toISOString(),
      },

      // Risk assessment placeholder
      creditAssessment: {
        score: 0,
        riskLevel: 'medium',
        affordabilityRatio: this.calculateAffordabilityRatio(),
        recommendedAmount: this.applicationData.amount,
        maxAffordableAmount: this.calculateMaxAffordable(),
        assessmentDate: new Date().toISOString(),
        factors: [],
      },
    };

    const payload: ICollectionData<Application> = {
      id: 0,
      website_id: CollectionNames.WebsiteId,
      collection_id: CollectionNames.Applications,
      parent_id: user.id,
      data: applicationPayload,
    };

    this.service.addData(payload).subscribe({
      next: (response) => {
        localStorage.removeItem('applicationDraft');
        alert(
          'Application submitted successfully! You will receive updates via email and SMS.'
        );
        this.router.navigate(['/profile']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Application submission error:', error);
        alert('Error submitting your application. Please try again.');
        this.loading = false;
      },
    });
  }

  private buildDocumentArray(): ApplicationDocument[] {
    const documents: ApplicationDocument[] = [];
    const docTypes = [
      'idDocument',
      'bankStatement',
      'proofOfIncome',
      'proofOfAddress',
    ];

    docTypes.forEach((type) => {
      if (this.applicationData[type]) {
        documents.push({
          type: type as any,
          fileName: `${type}_${Date.now()}`,
          originalName: this.applicationData[type],
          url: this.applicationData[type],
          uploadedAt: new Date().toISOString(),
          status: 'pending',
        });
      }
    });

    return documents;
  }

  private generateApplicationNumber(): string {
    const prefix = 'OT';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `${prefix}-${year}-${random}`;
  }

  private calculateAffordabilityRatio(): number {
    const income = this.applicationData.monthlyIncome || 0;
    const payment = this.calculatedPayment || 0;
    return income > 0 ? payment / income : 0;
  }

  private calculateMaxAffordable(): number {
    const income = this.applicationData.monthlyIncome || 0;
    const affordableRatio = 0.35; // 35% of income
    const maxPayment = income * affordableRatio;
    const term = this.applicationData.term || 12;
    const interestRate = 0.14 / 12; // Monthly rate

    if (maxPayment > 0 && term > 0) {
      return (
        (maxPayment * (Math.pow(1 + interestRate, term) - 1)) /
        (interestRate * Math.pow(1 + interestRate, term))
      );
    }
    return 0;
  }

  onCancel() {
    // Save draft before exiting
    if (Object.keys(this.applicationData).length > 0) {
      localStorage.setItem(
        'applicationDraft',
        JSON.stringify(this.applicationData)
      );
    }
    this.router.navigate(['/']);
  }

  getStepButtonClass(step: number): string {
    if (step === this.currentStep) {
      return 'bg-indigo-600 text-white';
    } else if (step < this.currentStep) {
      return 'bg-green-100 text-green-700 hover:bg-green-200';
    } else {
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  }

  getProgressPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }
}
