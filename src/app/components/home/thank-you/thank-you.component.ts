import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container max-w-3xl mx-auto px-4 py-8 text-center">
      <div class="space-y-6">
        <i class="i-heroicons-check-circle text-6xl text-green-500 mx-auto"></i>

        <h1 class="text-3xl font-bold">Thank You for Your Application!</h1>

        <p class="text-xl">
          Your application reference number is: <br/>
          <span class="font-mono text-2xl">{{ applicationId }}</span>
        </p>

        <div class="bg-gray-50 p-6 rounded-lg text-left space-y-4">
          <h2 class="text-xl font-semibold">Next Steps</h2>
          <ol class="space-y-3">
            <li class="flex gap-2">
              <i class="i-heroicons-document-magnifying-glass"></i>
              <span>AI Verification of your documents</span>
            </li>
            <li class="flex gap-2">
              <i class="i-heroicons-user-circle"></i>
              <span>Back-office review</span>
            </li>
            <li class="flex gap-2">
              <i class="i-heroicons-check-badge"></i>
              <span>DebiCheck authorization</span>
            </li>
            <li class="flex gap-2">
              <i class="i-heroicons-banknotes"></i>
              <span>Loan payout to your account</span>
            </li>
          </ol>
        </div>

        <div class="flex justify-center gap-4">
          <a routerLink="/status"
             [queryParams]="{ref: applicationId}"
             class="px-6 py-3 bg-primary text-white rounded-lg">
            Track Application Status
          </a>
          <a routerLink="/"
             class="px-6 py-3 border rounded-lg">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  `
})
export class ThankYouComponent {
  private route = inject(ActivatedRoute);

  applicationId = this.route.snapshot.paramMap.get('id') || 'Unknown';
}
