import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from '../modules/flow-builder/components/main/main.component';
import { SignUpComponent } from 'src/app/modules/user-onboarding/components/sign-up/sign-up.component';
import { SignInComponent } from 'src/app/modules/user-onboarding/components/sign-in/sign-in.component';
import {AddProductComponent} from 'src/app/modules/product-management/components/add-product/add-product.component'
import {ProductsComponent} from 'src/app/modules/product-management/components/products/products.component';
const routes: Routes = [

  {
    path: 'flow/:id',
    component: MainComponent,
    children: []
  },
  {
    path: 'signup',
    component: SignUpComponent,
    children: []
  },
  {
    path:"signin",
    component:SignInComponent,
    children:[]
  },
  {
    path:"product/add",
    component:AddProductComponent,
    children:[]
  },
  {
    path: '**',

    component: MainComponent,
    children: []
  },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
