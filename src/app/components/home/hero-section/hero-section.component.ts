import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onSubmit() {
    const app = {
      amount: this.amount,
      cycle: this.cycle,
    };

    // Save to localStorage
    localStorage.setItem('applicationDraft', JSON.stringify(app));

    // Navigate to /apply
    this.router.navigate(['/apply']);
  }
}
