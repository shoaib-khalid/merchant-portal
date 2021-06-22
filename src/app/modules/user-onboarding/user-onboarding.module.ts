import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeModule } from 'src/app/modules/home/home.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { CreateNewComponent } from './components/channels/create-new/create-new.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { EditAgentComponent } from './components/edit-agent/edit-agent.component';
import { MatSelectModule } from '@angular/material/select';
import { MobileAppRocketComponent } from './components/accounts/mobile-app-rocket/mobile-app-rocket.component';
import { SuggestionPopupComponent } from './components/accounts/suggestion-popup/suggestion-popup.component';

@NgModule({
  declarations: [SignUpComponent, SignInComponent, PageNotFoundComponent, ForgotPasswordComponent, ChannelsComponent, CreateNewComponent, AccountsComponent, AddAgentComponent, EditAgentComponent, MobileAppRocketComponent, SuggestionPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HomeModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class UserOnboardingModule { }
