import { Component } from '@angular/core';
import { HeroSectionComponent } from '../home/hero-section/hero-section.component';
import { WhyChooseUsComponent } from '../home/why-choose-us/why-choose-us.component';
import { TestimonialsComponent } from '../home/testimonials/testimonials.component';
import { CtaComponent } from '../home/cta/cta.component';

@Component({
  selector: 'app-landing',
  imports: [
    HeroSectionComponent,
    WhyChooseUsComponent,
    TestimonialsComponent,
    CtaComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
