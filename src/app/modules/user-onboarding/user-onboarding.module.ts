import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [SignUpComponent, SignInComponent, PageNotFoundComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class UserOnboardingModule { }
