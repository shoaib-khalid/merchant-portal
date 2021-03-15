import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RouterModule } from '@angular/router';
import { FlowsComponent } from './components/flows/flows.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { MatMenuModule } from '@angular/material/menu';
import { SharedSidePanelComponent } from './components/shared-side-panel/shared-side-panel.component';



@NgModule({
  declarations: [LandingPageComponent, FlowsComponent, SharedHeaderComponent, SharedSidePanelComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  exports: [SharedHeaderComponent,SharedSidePanelComponent]
})
export class HomeModule { }
