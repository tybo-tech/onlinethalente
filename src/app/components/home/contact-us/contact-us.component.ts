import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqSectionComponent } from "../faq-section/faq-section.component";

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, FormsModule, FaqSectionComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
 contact = {
    name: '',
    email: '',
    message: ''
  };

  showSuccess = false;

  onSubmit() {
    // Mock "send" action
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
      this.contact = { name: '', email: '', message: '' }; // Reset form
    }, 2200);
  }
}
