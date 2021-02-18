import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from '../modules/flow-builder/components/main/main.component';
import { SignUpComponent } from 'src/app/modules/user-onboarding/components/sign-up/sign-up.component';
import { SignInComponent } from 'src/app/modules/user-onboarding/components/sign-in/sign-in.component';
import { AddProductComponent } from 'src/app/modules/product-management/components/add-product/add-product.component'
import { LandingPageComponent } from 'src/app/modules/home/components/landing-page/landing-page.component';
import { ChooseVerticleComponent } from 'src/app/modules/product-management/components/choose-verticle/choose-verticle.component';
import {PageNotFoundComponent} from 'src/app/modules/user-onboarding/components/page-not-found/page-not-found.component';
const routes: Routes = [

  {
    path: 'flow/:id',
    component: MainComponent,
    children: []
  },
  {
    path: 'chooseverticle',
    component: ChooseVerticleComponent,
    children: []
  },
  {
    path: 'signup',
    component: SignUpComponent,
    children: []
  },
  {
    path: "signin",
    component: SignInComponent,
    children: []
  },
  {
    path: "products/add",
    component: AddProductComponent,
    children: []
  },
  {
    path: '',
    component: LandingPageComponent,
    children: []
  },
  {
    path: 'flowbuilder',

    component: MainComponent,
    children: []
  },{
    path: '**',
    component:PageNotFoundComponent,
    children:[]
  }

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
