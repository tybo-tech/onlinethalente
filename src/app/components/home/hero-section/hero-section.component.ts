import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  onSubmit() {
    const app = {
      amount: this.amount,
      cycle: this.cycle,
    };
    console.log('Loan application data:', app);
    alert('Continue to next step — user info form.');
  }
}
