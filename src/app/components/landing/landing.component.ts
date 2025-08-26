import { Component } from '@angular/core';
import { WhyChooseUsComponent } from '../home/why-choose-us/why-choose-us.component';
import { TestimonialsComponent } from '../home/testimonials/testimonials.component';
import { CtaComponent } from '../home/cta/cta.component';
import { LandingHeroComponent } from "../home/landing/landing.component";

@Component({
  selector: 'app-landing',
  imports: [
    WhyChooseUsComponent,
    TestimonialsComponent,
    CtaComponent,
    LandingHeroComponent
],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
