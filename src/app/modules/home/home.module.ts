import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {MatIconModule} from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
@NgModule({
  declarations: [FlowsComponent, SharedHeaderComponent, SharedSidePanelComponent, SuccessAnimationComponent, LoadingComponent, ErrorPopUpComponent, EmailVerifiedComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  exports: [SharedHeaderComponent,SharedSidePanelComponent,SuccessAnimationComponent],
  providers:[MatIconRegistry]
})
export class HomeModule { }
