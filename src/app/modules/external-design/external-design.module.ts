import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FAndBComponent } from './components/f-and-b/f-and-b.component';
import { ECommerceComponent } from './components/e-commerce/e-commerce.component';
import { ServicesComponent } from './components/services/services.component';
import { WhySymplifiedComponent } from './components/why-symplified/why-symplified.component';
import { PricingComponent } from './components/pricing-f-and-b/pricing.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [LandingPageComponent, FAndBComponent, ECommerceComponent, ServicesComponent, WhySymplifiedComponent, PricingComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ExternalDesignModule { }
