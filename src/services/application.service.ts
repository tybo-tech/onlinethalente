import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Application, PersonalInfo, EmploymentInfo, BankDetails, CreditAssessment, ApplicationDocument, Address } from '../models/schema';
import { CollectionDataService } from './collection.data.service';
import { ICollectionData } from '../models/ICollection';

export interface ApplicationStep {
  id: number;
  name: string;
  route: string;
  completed: boolean;
  valid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly STORAGE_KEY = 'loan_application_draft';
  private readonly APPLICATION_ID_KEY = 'current_application_id';

  // Application steps configuration
  public readonly steps: ApplicationStep[] = [
    { id: 1, name: 'Loan Selection', route: '/hero', completed: false, valid: false },
    { id: 2, name: 'Personal Info', route: '/apply/personal', completed: false, valid: false },
    { id: 3, name: 'Employment', route: '/apply/employment', completed: false, valid: false },
    { id: 4, name: 'Banking', route: '/apply/banking', completed: false, valid: false },
    { id: 5, name: 'Documents', route: '/apply/documents', completed: false, valid: false },
    { id: 6, name: 'Review', route: '/apply/review', completed: false, valid: false }
  ];

  // BehaviorSubjects for reactive state management
  private applicationSubject = new BehaviorSubject<Application | null>(null);
  private currentStepSubject = new BehaviorSubject<number>(1);
  private stepsSubject = new BehaviorSubject<ApplicationStep[]>([...this.steps]);

  // Public observables
  public application$ = this.applicationSubject.asObservable();
  public currentStep$ = this.currentStepSubject.asObservable();
  public steps$ = this.stepsSubject.asObservable();

  constructor(
    private router: Router,
    private collectionDataService: CollectionDataService
  ) {
    this.loadFromStorage();
  }

  /**
   * Initialize a new application (like adding to cart)
   */
  initializeApplication(amount: number, paymentCycle: number): string {
    const applicationId = this.generateApplicationId();

    const newApplication: Application = {
      amount: amount,
      type: paymentCycle.toString(), // Converted to string as expected by schema
      status: 'draft',
      created_at: new Date(),
      personalInfo: {
        firstName: '',
        lastName: '',
        idNumber: '',
        dateOfBirth: '', // String as per schema
        gender: undefined, // Optional field
        maritalStatus: undefined, // Optional field
        nationality: 'South African',
        phoneNumber: '',
        email: '',
        preferredLanguage: 'English'
      },
      employmentInfo: {
        employmentStatus: 'employed',
        employerName: '',
        jobTitle: '',
        monthlyIncome: 0,
        additionalIncome: 0
      },
      bankDetails: {
        bankName: '',
        accountType: 'savings',
        accountNumber: '',
        branchCode: '',
        accountHolderName: ''
      },
      documents: [],
      creditAssessment: {
        score: 0,
        riskLevel: 'medium',
        affordabilityRatio: 0,
        recommendedAmount: 0,
        maxAffordableAmount: 0,
        assessmentDate: new Date().toISOString(),
        factors: []
      }
    };

    this.setApplication(newApplication);
    this.setCurrentApplicationId(applicationId);
    this.updateStepStatus(1, true, true);

    return applicationId;
  }

  /**
   * Navigate to specific step (like checkout navigation)
   */
  navigateToStep(stepId: number, applicationId?: string): void {
    if (applicationId && applicationId !== this.getCurrentApplicationId()) {
      this.loadApplication(applicationId);
    }

    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      this.setCurrentStep(stepId);

      // Build route with application ID
      const currentAppId = this.getCurrentApplicationId();
      const route = stepId === 1 ? step.route : `${step.route}/${currentAppId}`;

      this.router.navigate([route]);
    }
  }

  /**
   * Navigate to next step
   */
  nextStep(): void {
    const currentStep = this.currentStepSubject.value;
    if (currentStep < this.steps.length) {
      this.navigateToStep(currentStep + 1);
    }
  }

  /**
   * Navigate to previous step
   */
  previousStep(): void {
    const currentStep = this.currentStepSubject.value;
    if (currentStep > 1) {
      this.navigateToStep(currentStep - 1);
    }
  }

  /**
   * Update application data (like updating cart)
   */
  updateApplication(updates: Partial<Application>): void {
    const current = this.applicationSubject.value;
    if (current) {
      const updated = {
        ...current,
        ...updates
      };
      this.setApplication(updated);
    }
  }

  /**
   * Update specific step completion status
   */
  updateStepStatus(stepId: number, completed: boolean, valid: boolean): void {
    const steps = [...this.stepsSubject.value];
    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (stepIndex !== -1) {
      steps[stepIndex] = {
        ...steps[stepIndex],
        completed,
        valid
      };
      this.stepsSubject.next(steps);
      this.saveStepsToStorage();
    }
  }

  /**
   * Get current application
   */
  getCurrentApplication(): Application | null {
    return this.applicationSubject.value;
  }

  /**
   * Get current step number
   */
  getCurrentStep(): number {
    return this.currentStepSubject.value;
  }

  /**
   * Get application progress percentage
   */
  getProgressPercentage(): number {
    const completedSteps = this.stepsSubject.value.filter(s => s.completed).length;
    return Math.round((completedSteps / this.steps.length) * 100);
  }

  /**
   * Check if can proceed to next step
   */
  canProceedToNextStep(): boolean {
    const currentStep = this.currentStepSubject.value;
    const step = this.stepsSubject.value.find(s => s.id === currentStep);
    return step?.valid ?? false;
  }

  /**
   * Submit application to server
   */
  async submitApplication(): Promise<boolean> {
    const application = this.applicationSubject.value;
    if (!application) {
      throw new Error('No application to submit');
    }

    try {
      // Update application status
      const submittedApplication = {
        ...application,
        status: 'submitted' as const
      };

      // Save to server via collection data service
      const collectionData: ICollectionData<Application> = {
        id: 0, // Will be set by server
        collection_id: 'applications',
        parent_id: 0,
        website_id: '1',
        data: submittedApplication,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await this.collectionDataService.addData(collectionData).toPromise();

      // Update local state
      this.setApplication(submittedApplication);
      this.updateStepStatus(6, true, true);

      // Clear draft from localStorage but keep for confirmation page
      this.clearDraft();

      return true;
    } catch (error) {
      console.error('Failed to submit application:', error);
      return false;
    }
  }

  /**
   * Load application by ID (for URL-based access)
   */
  loadApplication(applicationId: string): void {
    // First try localStorage
    const stored = this.loadApplicationFromStorage(applicationId);
    if (stored) {
      this.setApplication(stored);
      this.setCurrentApplicationId(applicationId);
      return;
    }

    // If not in localStorage, try to load from server
    // This would require additional API endpoint to get by application ID
    console.warn(`Application ${applicationId} not found in localStorage`);
  }

  /**
   * Clear current application (like clearing cart)
   */
  clearApplication(): void {
    this.applicationSubject.next(null);
    this.currentStepSubject.next(1);
    this.stepsSubject.next([...this.steps]);
    this.clearStorage();
  }

  /**
   * Save application draft to localStorage
   */
  private setApplication(application: Application): void {
    this.applicationSubject.next(application);
    this.saveToStorage();
  }

  /**
   * Set current step
   */
  private setCurrentStep(step: number): void {
    this.currentStepSubject.next(step);
    localStorage.setItem('current_step', step.toString());
  }

  /**
   * Generate unique application ID
   */
  private generateApplicationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `APP-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Get current application ID
   */
  private getCurrentApplicationId(): string | null {
    return localStorage.getItem(this.APPLICATION_ID_KEY);
  }

  /**
   * Set current application ID
   */
  private setCurrentApplicationId(id: string): void {
    localStorage.setItem(this.APPLICATION_ID_KEY, id);
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    const application = this.applicationSubject.value;
    if (application) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(application));
    }
  }

  /**
   * Save steps to localStorage
   */
  private saveStepsToStorage(): void {
    const steps = this.stepsSubject.value;
    localStorage.setItem('application_steps', JSON.stringify(steps));
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const storedSteps = localStorage.getItem('application_steps');
      const currentStep = localStorage.getItem('current_step');

      if (stored) {
        const application = JSON.parse(stored);
        this.applicationSubject.next(application);
      }

      if (storedSteps) {
        const steps = JSON.parse(storedSteps);
        this.stepsSubject.next(steps);
      }

      if (currentStep) {
        this.currentStepSubject.next(parseInt(currentStep, 10));
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }

  /**
   * Load specific application from storage
   */
  private loadApplicationFromStorage(applicationId: string): Application | null {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${applicationId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load application from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear draft from localStorage
   */
  private clearDraft(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Clear all storage
   */
  private clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.APPLICATION_ID_KEY);
    localStorage.removeItem('application_steps');
    localStorage.removeItem('current_step');
  }
}
