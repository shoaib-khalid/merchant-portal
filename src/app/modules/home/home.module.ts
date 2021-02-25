import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RouterModule } from '@angular/router';
import { FlowsComponent } from './components/flows/flows.component';



@NgModule({
  declarations: [LandingPageComponent, FlowsComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomeModule { }
