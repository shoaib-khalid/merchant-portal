import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RouterModule } from '@angular/router';
import { FlowsComponent } from './components/flows/flows.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { SharedSidePanelComponent } from './components/shared-side-panel/shared-side-panel.component';
import { SuccessAnimationComponent } from './components/success-animation/success-animation.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorPopUpComponent } from './components/error-pop-up/error-pop-up.component';
import { EmailVerifiedComponent } from './components/email-verified/email-verified.component';


@NgModule({
  declarations: [LandingPageComponent, FlowsComponent, SharedHeaderComponent, SharedSidePanelComponent, SuccessAnimationComponent, LoadingComponent, ErrorPopUpComponent, EmailVerifiedComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  exports: [SharedHeaderComponent,SharedSidePanelComponent,SuccessAnimationComponent]
})
export class HomeModule { }
