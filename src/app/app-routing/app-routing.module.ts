import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from '../modules/flow-builder/components/main/main.component';
import { SignUpComponent } from 'src/app/modules/user-onboarding/components/sign-up/sign-up.component';
import { SignInComponent } from 'src/app/modules/user-onboarding/components/sign-in/sign-in.component';
import { AddProductComponent } from 'src/app/modules/product-management/components/add-product/add-product.component'
import { LandingPageComponent } from 'src/app/modules/home/components/landing-page/landing-page.component';
import { ChooseVerticleComponent } from 'src/app/modules/product-management/components/choose-verticle/choose-verticle.component';
import { PageNotFoundComponent } from 'src/app/modules/user-onboarding/components/page-not-found/page-not-found.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service.ts.service';
import { FlowsComponent } from 'src/app/modules/home/components/flows/flows.component';
import { SharedHeaderComponent } from 'src/app/modules/home/components/shared-header/shared-header.component';
import { ProductsComponent } from 'src/app/modules/product-management/components/products/products.component';
import { StorePageComponent } from 'src/app/modules/store-management/components/store-page/store-page.component';
import { OrdersComponent } from 'src/app/modules/product-management/components/orders/orders.component';
import { ForgotPasswordComponent } from 'src/app/modules/user-onboarding/components/forgot-password/forgot-password.component';
import { CartComponent } from 'src/app/modules/product-management/components/cart/cart.component';
import { SingleCartComponent } from 'src/app/modules/product-management/components/cart-details/single-cart.component';
import { SingleOrderComponent } from 'src/app/modules/product-management/components/order-details/single-order.component';
import { ManageStoresComponent } from 'src/app/modules/store-management/components/manage-stores/manage-stores.component';


const routes: Routes = [

  {
    path: 'flows/:id',
    component: MainComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'chooseverticle',
    component: ChooseVerticleComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'flows',
    component: FlowsComponent,
    canActivate: [AuthGuardService],
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
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'header',
    component: SharedHeaderComponent,
    children: []
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'store',
    component: StorePageComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    children: []
  },
  {
    path: 'carts',
    component: CartComponent,
    canActivate: [AuthGuardService],
    children: []
  }, {
    path: 'carts/cart-details',
    component: SingleCartComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'orders/order-details',
    component: SingleOrderComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'store-management',
    component: ManageStoresComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    children: []
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
