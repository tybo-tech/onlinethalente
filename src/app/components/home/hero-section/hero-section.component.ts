import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-section.component.html',
})
export class HeroSectionComponent {
  amount = 2500;
  cycle = '15th';
  cycles = ['15th', '25th', '31st'];

  constructor(
    private router: Router,
    private applicationService: ApplicationService
  ) {}

  onSubmit() {
    // Convert cycle to number for payment cycle (assuming months)
    const paymentCycle = this.getCycleAsMonths(this.cycle);

    // Initialize application using the service (like adding to cart)
    const applicationId = this.applicationService.initializeApplication(
      this.amount,
      paymentCycle
    );

    // Navigate to first step of application process
    this.applicationService.navigateToStep(2, applicationId); // Step 2 is personal info
  }

  private getCycleAsMonths(cycle: string): number {
    // Convert payment day to standard loan terms
    // This is a simplified mapping - you can adjust based on business logic
    switch (cycle) {
      case '15th': return 6; // 6 months
      case '25th': return 12; // 12 months
      case '31st': return 24; // 24 months
      default: return 12;
    }
  }
}
