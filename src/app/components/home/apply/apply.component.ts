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
  verifyingId = false;
  idVerified = false;

  // Message states
  successMessage = '';
  errorMessage = '';
  showMessage = false;

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
    // // Map application data to form fields
    // if (application.personalInfo) {
    //   this.idNumber = application.personalInfo.idNumber || '';
    //   this.firstName = application.personalInfo.firstName || '';
    //   this.lastName = application.personalInfo.lastName || '';
    //   this.phoneNumber = application.personalInfo.phoneNumber || '';
    //   this.email = application.personalInfo.email || '';
    //   this.maritalStatus = application.personalInfo.maritalStatus || '';
    // }

    // if (application.employmentInfo) {
    //   this.employmentStatus = application.employmentInfo.employmentStatus || 'employed';
    //   this.employerName = application.employmentInfo.employerName || '';
    //   this.monthlyIncome = application.employmentInfo.monthlyIncome || 0;
    // }

    // if (application.bankDetails) {
    //   this.bankName = application.bankDetails.bankName || '';
    //   this.accountNumber = application.bankDetails.accountNumber || '';
    //   this.branchCode = application.bankDetails.branchCode || '';
    //   this.accountType = application.bankDetails.accountType || 'savings';
    // }
  }

  // Step validation
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1: // ID Verification
        return this.idNumber.length === 13 && this.idVerified && this.isValidSouthAfricanId(this.idNumber);
      case 2: // Personal Details
        return this.firstName.length > 0 && this.lastName.length > 0 &&
               this.phoneNumber.length > 0 && this.email.length > 0 &&
               this.email.includes('@') && this.phoneNumber.length >= 10;
      case 3: // Employment Info
        return this.employmentStatus.length > 0 && this.monthlyIncome > 0 &&
               (this.employmentStatus === 'self_employed' || this.employerName.length > 0);
      case 4: // Banking Details
        return this.bankName.length > 0 && this.accountNumber.length > 0 &&
               this.branchCode.length > 0 && this.accountNumber.length >= 8;
      case 5: // Review
        return true;
      default:
        return false;
    }
  }

  // Verify ID Number and create/load user
  async verifyIdNumber(): Promise<void> {
    if (this.idNumber.length !== 13) {
      this.showError('Please enter a valid 13-digit ID number');
      return;
    }

    // Basic ID number validation (South African format)
    if (!this.isValidSouthAfricanId(this.idNumber)) {
      this.showError('Please enter a valid South African ID number');
      return;
    }

    this.verifyingId = true;
    this.clearMessages();

    try {
      const user = await this.applicationService.verifyUserByIdNumber(this.idNumber);

      if (user) {
        this.idVerified = true;

        // Determine if this is a returning user or new user
        const isReturningUser = user.id && user.id > 0;

        // Pre-populate fields if user exists and has data
        if (user.name && user.name.trim()) {
          const nameParts = user.name.split(' ');
          this.firstName = nameParts[0] || '';
          this.lastName = nameParts.slice(1).join(' ') || '';
        }
        this.email = user.email || '';
        this.phoneNumber = user.phone || '';

        // Save the verified ID to the application
        this.saveCurrentStepData();

        // Show appropriate success message
        if (isReturningUser) {
          this.showSuccess(`Welcome back, ${user.name || 'valued customer'}! Your details have been pre-filled.`);
        } else {
          this.showSuccess('ID verified successfully! We\'ve created your account. Please complete your details below.');
        }

        // Auto-advance to next step after 2 seconds if user has complete info
        if (isReturningUser && this.firstName && this.lastName && this.email) {
          setTimeout(() => {
            this.nextStep();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('ID verification failed:', error);
      this.showError('Unable to verify ID number. Please check your number and try again.');
      this.idVerified = false;
    } finally {
      this.verifyingId = false;
    }
  }

  // South African ID validation
  private isValidSouthAfricanId(idNumber: string): boolean {
    if (idNumber.length !== 13) return false;

    // Check if all characters are digits
    if (!/^\d{13}$/.test(idNumber)) return false;

    // Basic date validation (YYMMDD format)
    const year = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
  }

  // Reset ID verification if ID number changes
  onIdNumberChange(): void {
    this.idVerified = false;
    this.clearMessages();
  }

  // Message handling methods
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.showMessage = true;

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      this.clearMessages();
    }, 5000);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.showMessage = true;
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.showMessage = false;
  }  // Navigation methods
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

    // switch (this.currentStep) {
    //   case 1: // ID Verification
    //     updates.personalInfo = {
    //       firstName: this.currentApplication.personalInfo?.firstName || '',
    //       lastName: this.currentApplication.personalInfo?.lastName || '',
    //       idNumber: this.idNumber,
    //       phoneNumber: this.currentApplication.personalInfo?.phoneNumber || '',
    //       email: this.currentApplication.personalInfo?.email || '',
    //       maritalStatus: this.currentApplication.personalInfo?.maritalStatus,
    //       nationality: this.currentApplication.personalInfo?.nationality,
    //       dateOfBirth: this.currentApplication.personalInfo?.dateOfBirth,
    //       gender: this.currentApplication.personalInfo?.gender,
    //       dependents: this.currentApplication.personalInfo?.dependents,
    //       alternativePhone: this.currentApplication.personalInfo?.alternativePhone,
    //       preferredLanguage: this.currentApplication.personalInfo?.preferredLanguage
    //     };
    //     break;

    //   case 2: // Personal Details
    //     updates.personalInfo = {
    //       firstName: this.firstName,
    //       lastName: this.lastName,
    //       idNumber: this.currentApplication.personalInfo?.idNumber || this.idNumber,
    //       phoneNumber: this.phoneNumber,
    //       email: this.email,
    //       maritalStatus: this.maritalStatus as any,
    //       nationality: this.currentApplication.personalInfo?.nationality,
    //       dateOfBirth: this.currentApplication.personalInfo?.dateOfBirth,
    //       gender: this.currentApplication.personalInfo?.gender,
    //       dependents: this.currentApplication.personalInfo?.dependents,
    //       alternativePhone: this.currentApplication.personalInfo?.alternativePhone,
    //       preferredLanguage: this.currentApplication.personalInfo?.preferredLanguage
    //     };

    //     // Also update the user record with the new information
    //     this.updateUserInformation();
    //     break;

    //   case 3: // Employment Info
    //     updates.employmentInfo = {
    //       ...this.currentApplication.employmentInfo,
    //       employmentStatus: this.employmentStatus as any,
    //       employerName: this.employerName,
    //       monthlyIncome: this.monthlyIncome
    //     };
    //     break;

    //   case 4: // Banking Details
    //     updates.bankDetails = {
    //       bankName: this.bankName,
    //       accountNumber: this.accountNumber,
    //       branchCode: this.branchCode,
    //       accountType: this.accountType as any,
    //       accountHolderName: this.currentApplication.bankDetails?.accountHolderName || `${this.firstName} ${this.lastName}`
    //     };
    //     break;
    // }

    this.applicationService.updateApplication(updates);
  }

  // Update user information when personal details are filled
  private async updateUserInformation(): Promise<void> {
    const currentUser = this.applicationService.getCurrentUser();
    if (!currentUser) return;

    try {
      const updatedUser = {
        ...currentUser,
        name: `${this.firstName} ${this.lastName}`,
        email: this.email,
        phone: this.phoneNumber,
        updated_at: new Date().toISOString()
      };

      // Update via user service
      await this.applicationService.updateUserInformation(updatedUser);
    } catch (error) {
      console.error('Failed to update user information:', error);
      // Don't block the flow if user update fails
    }
  }  // Submit application
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
