import { Component } from '@angular/core';
import { TestimonialsComponent } from "../testimonials/testimonials.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about-us',
  imports: [TestimonialsComponent, FormsModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  amount = 2500;
  cycle = '15th';
  cycles = ['15th', '25th', '31st'];
}
