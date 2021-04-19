import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeModule } from 'src/app/modules/home/home.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChannelsComponent } from './components/channels/channels.component';

@NgModule({
  declarations: [SignUpComponent, SignInComponent, PageNotFoundComponent, ForgotPasswordComponent, ChannelsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HomeModule
  ]
})
export class UserOnboardingModule { }
