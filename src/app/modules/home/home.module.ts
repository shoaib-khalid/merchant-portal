import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RouterModule } from '@angular/router';
import { FlowsComponent } from './components/flows/flows.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@NgModule({
  declarations: [LandingPageComponent, FlowsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule
  ]
})
export class HomeModule { }
