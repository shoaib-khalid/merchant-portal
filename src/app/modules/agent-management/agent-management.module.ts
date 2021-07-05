import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SuggestionPopupComponent } from './components/agents/suggestion-popup/suggestion-popup.component';
import { AccountsComponent } from './components/agents/accounts.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MobileAppRocketComponent } from './components/agents/mobile-app-rocket/mobile-app-rocket.component';
import { BrowserModule } from '@angular/platform-browser'
import { HomeModule } from 'src/app/modules/home/home.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { EditAgentComponent } from './components/edit-agent/edit-agent.component';

@NgModule({
  declarations: [SuggestionPopupComponent, AccountsComponent, MobileAppRocketComponent, AddAgentComponent, EditAgentComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    BrowserModule,
    HomeModule,
    FormsModule,
    RouterModule
  ]
})
export class AgentManagementModule { }

