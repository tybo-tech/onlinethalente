// apply.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Application } from '../../../../models/schema';
import { ApplicationService, ApplicationStep } from '../../../../services/application.service';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss',
})
export class ApplyComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  // Service-driven state
  currentApplication: Application | null = null;
  currentStep = 1;
  steps: ApplicationStep[] = [];

  // Simple form fields for current step
  idNumber = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  email = '';
  maritalStatus = '';
  employmentStatus = 'employed';
  employerName = '';
  monthlyIncome = 0;
  bankName = '';
  accountNumber = '';
  branchCode = '';
  accountType = 'savings';

  // Options for select fields
  maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
  ];

  employmentStatusOptions = [
    { value: 'employed', label: 'Permanently Employed' },
    { value: 'self_employed', label: 'Self Employed' },
    { value: 'pensioner', label: 'Pensioner' },
    { value: 'student', label: 'Student' }
  ];

  bankOptions = [
    { value: 'absa', label: 'ABSA Bank' },
    { value: 'standard_bank', label: 'Standard Bank' },
    { value: 'fnb', label: 'FNB' },
    { value: 'nedbank', label: 'Nedbank' },
    { value: 'capitec', label: 'Capitec Bank' }
  ];

  accountTypeOptions = [
    { value: 'savings', label: 'Savings Account' },
    { value: 'current', label: 'Current Account' },
    { value: 'transmission', label: 'Transmission Account' }
  ];

  // Loading states
  loading = false;

  // Step titles for progress display
  stepTitles = [
    'ID Verification',
    'Personal Details',
    'Employment Info',
    'Banking Details',
    'Review & Submit'
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    // Subscribe to application service state
    this.subscriptions.push(
      this.applicationService.application$.subscribe(app => {
        this.currentApplication = app;
        if (app) {
          this.loadApplicationData(app);
        }
      }),

      this.applicationService.currentStep$.subscribe(step => {
        this.currentStep = step;
      }),

      this.applicationService.steps$.subscribe(steps => {
        this.steps = steps;
      })
    );

    // Check for application ID in route
    const applicationId = this.route.snapshot.paramMap.get('id');
    if (applicationId) {
      this.applicationService.loadApplication(applicationId);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadApplicationData(application: Application): void {
    // Map application data to form fields
    if (application.personalInfo) {
      this.idNumber = application.personalInfo.idNumber || '';
      this.firstName = application.personalInfo.firstName || '';
      this.lastName = application.personalInfo.lastName || '';
      this.phoneNumber = application.personalInfo.phoneNumber || '';
      this.email = application.personalInfo.email || '';
      this.maritalStatus = application.personalInfo.maritalStatus || '';
    }

    if (application.employmentInfo) {
      this.employmentStatus = application.employmentInfo.employmentStatus || 'employed';
      this.employerName = application.employmentInfo.employerName || '';
      this.monthlyIncome = application.employmentInfo.monthlyIncome || 0;
    }

    if (application.bankDetails) {
      this.bankName = application.bankDetails.bankName || '';
      this.accountNumber = application.bankDetails.accountNumber || '';
      this.branchCode = application.bankDetails.branchCode || '';
      this.accountType = application.bankDetails.accountType || 'savings';
    }
  }

  // Step validation
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1: // ID Verification
        return this.idNumber.length === 13; // South African ID is 13 digits
      case 2: // Personal Details
        return this.firstName.length > 0 && this.lastName.length > 0 &&
               this.phoneNumber.length > 0 && this.email.length > 0;
      case 3: // Employment Info
        return this.employmentStatus.length > 0 && this.monthlyIncome > 0;
      case 4: // Banking Details
        return this.bankName.length > 0 && this.accountNumber.length > 0 &&
               this.branchCode.length > 0;
      case 5: // Review
        return true;
      default:
        return false;
    }
  }

  // Navigation methods
  nextStep(): void {
    if (!this.isCurrentStepValid()) {
      alert('Please complete all required fields before proceeding.');
      return;
    }

    this.saveCurrentStepData();
    this.applicationService.updateStepStatus(this.currentStep, true, true);
    this.applicationService.nextStep();
  }

  previousStep(): void {
    this.saveCurrentStepData();
    this.applicationService.previousStep();
  }

  goToStep(step: number): void {
    this.saveCurrentStepData();
    this.applicationService.navigateToStep(step);
  }

  // Save current step data to application service
  private saveCurrentStepData(): void {
    if (!this.currentApplication) return;

    const updates: Partial<Application> = {};

    switch (this.currentStep) {
      case 1: // ID Verification
        updates.personalInfo = {
          firstName: this.currentApplication.personalInfo?.firstName || '',
          lastName: this.currentApplication.personalInfo?.lastName || '',
          idNumber: this.idNumber,
          phoneNumber: this.currentApplication.personalInfo?.phoneNumber || '',
          email: this.currentApplication.personalInfo?.email || '',
          maritalStatus: this.currentApplication.personalInfo?.maritalStatus,
          nationality: this.currentApplication.personalInfo?.nationality,
          dateOfBirth: this.currentApplication.personalInfo?.dateOfBirth,
          gender: this.currentApplication.personalInfo?.gender,
          dependents: this.currentApplication.personalInfo?.dependents,
          alternativePhone: this.currentApplication.personalInfo?.alternativePhone,
          preferredLanguage: this.currentApplication.personalInfo?.preferredLanguage
        };
        break;

      case 2: // Personal Details
        updates.personalInfo = {
          firstName: this.firstName,
          lastName: this.lastName,
          idNumber: this.currentApplication.personalInfo?.idNumber || this.idNumber,
          phoneNumber: this.phoneNumber,
          email: this.email,
          maritalStatus: this.maritalStatus as any,
          nationality: this.currentApplication.personalInfo?.nationality,
          dateOfBirth: this.currentApplication.personalInfo?.dateOfBirth,
          gender: this.currentApplication.personalInfo?.gender,
          dependents: this.currentApplication.personalInfo?.dependents,
          alternativePhone: this.currentApplication.personalInfo?.alternativePhone,
          preferredLanguage: this.currentApplication.personalInfo?.preferredLanguage
        };
        break;

      case 3: // Employment Info
        updates.employmentInfo = {
          ...this.currentApplication.employmentInfo,
          employmentStatus: this.employmentStatus as any,
          employerName: this.employerName,
          monthlyIncome: this.monthlyIncome
        };
        break;

      case 4: // Banking Details
        updates.bankDetails = {
          bankName: this.bankName,
          accountNumber: this.accountNumber,
          branchCode: this.branchCode,
          accountType: this.accountType as any,
          accountHolderName: this.currentApplication.bankDetails?.accountHolderName || `${this.firstName} ${this.lastName}`
        };
        break;
    }

    this.applicationService.updateApplication(updates);
  }

  // Submit application
  async submitApplication(): Promise<void> {
    if (!this.isCurrentStepValid()) {
      alert('Please complete all required fields.');
      return;
    }

    this.loading = true;
    this.saveCurrentStepData();

    try {
      const success = await this.applicationService.submitApplication();
      if (success) {
        alert('Application submitted successfully! You will receive updates via email and SMS.');
        this.router.navigate(['/profile']);
      } else {
        alert('Error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting your application. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  // Progress calculation
  getProgressPercentage(): number {
    return this.applicationService.getProgressPercentage();
  }

  // Step styling
  getStepClass(stepNumber: number): string {
    if (stepNumber === this.currentStep) {
      return 'bg-blue-600 text-white';
    } else if (stepNumber < this.currentStep) {
      return 'bg-green-100 text-green-700';
    } else {
      return 'bg-gray-100 text-gray-600';
    }
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  }
}
