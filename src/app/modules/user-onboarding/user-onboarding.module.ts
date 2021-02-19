import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [SignUpComponent, SignInComponent, PageNotFoundComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class UserOnboardingModule { }
