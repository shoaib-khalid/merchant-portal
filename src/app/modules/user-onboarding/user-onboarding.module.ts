import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {HomeModule} from 'src/app/modules/home/home.module';
import { StorePageComponent } from './components/store-page/store-page.component';

@NgModule({
  declarations: [SignUpComponent, SignInComponent, PageNotFoundComponent, StorePageComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HomeModule
  ]
})
export class UserOnboardingModule { }
