import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';



@NgModule({
  declarations: [SignUpComponent, SignInComponent],
  imports: [
    CommonModule
  ]
})
export class UserOnboardingModule { }
