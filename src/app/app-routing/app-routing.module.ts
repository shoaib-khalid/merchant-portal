import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from '../modules/flow-builder/components/main/main.component';
import { SignUpComponent } from 'src/app/modules/user-onboarding/components/sign-up/sign-up.component';
import { SignInComponent } from 'src/app/modules/user-onboarding/components/sign-in/sign-in.component';
import { AddProductComponent } from 'src/app/modules/product-management/components/add-product/add-product.component'
// import { LandingPageComponent } from 'src/app/modules/home/components/landing-page/landing-page.component';
import { ChooseVerticleComponent } from 'src/app/modules/store-management/components/choose-verticle/choose-verticle.component';
import { PageNotFoundComponent } from 'src/app/modules/user-onboarding/components/page-not-found/page-not-found.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service.ts.service';
import { FlowsComponent } from 'src/app/modules/home/components/flows/flows.component';
import { SharedHeaderComponent } from 'src/app/modules/home/components/shared-header/shared-header.component';
import { ProductsComponent } from 'src/app/modules/product-management/components/products/products.component';
import { StorePageComponent } from 'src/app/modules/store-management/components/store-page/store-page.component';
import { OrdersComponent } from 'src/app/modules/order-management/components/orders/orders.component';
import { ForgotPasswordComponent } from 'src/app/modules/user-onboarding/components/forgot-password/forgot-password.component';
import { CartComponent } from 'src/app/modules/cart-management/components/cart/cart.component';
import { SingleCartComponent } from 'src/app/modules/cart-management/components/cart-details/single-cart.component';
import { SingleOrderComponent } from 'src/app/modules/order-management/components/order-details/single-order.component';
import { ManageStoresComponent } from 'src/app/modules/store-management/components/manage-stores/manage-stores.component';
import { EditProductComponent } from 'src/app/modules/product-management/components/edit-product/edit-product.component'
import { CategoriesComponent } from 'src/app/modules/product-management/components/categories/categories.component';
import { EditStoreComponent } from 'src/app/modules/store-management/components/edit-store/edit-store.component';
import { CustomersComponent } from 'src/app/modules/order-management/components/customers/customers.component';
import { ChannelsComponent } from 'src/app/modules/user-onboarding/components/channels/channels.component';
import { AccountsComponent } from 'src/app/modules/agent-management/components/agents/accounts.component';
import { AddAgentComponent } from 'src/app/modules/agent-management/components/add-agent/add-agent.component';
import { EditAgentComponent } from 'src/app/modules/agent-management/components/edit-agent/edit-agent.component'
import { DailySalesComponent } from 'src/app/modules/reporting/components/daily-sales/daily-sales.component';
import { SettlementComponent } from 'src/app/modules/reporting/components/settlement/settlement.component';
import { EmailVerifiedComponent } from '../modules/home/components/email-verified/email-verified.component';
import { ProfileComponent } from '../modules/user-onboarding/components/profile/profile.component';
import { LandingPageComponent } from '../modules/external-design/components/landing-page/landing-page.component';
import { FAndBComponent } from '../modules/external-design/components/f-and-b/f-and-b.component';
import { ECommerceComponent } from '../modules/external-design/components/e-commerce/e-commerce.component';
import { ServicesComponent } from '../modules/external-design/components/services/services.component';
import { WhySymplifiedComponent } from '../modules/external-design/components/why-symplified/why-symplified.component';
import { PricingComponent } from '../modules/external-design/components/pricing-f-and-b/pricing.component';
import { PricingECommerceComponent } from '../modules/external-design/components/pricing-e-commerce/pricing-e-commerce.component';
import { PricingEServicesComponent } from '../modules/external-design/components/pricing-e-services/pricing-e-services.component';
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
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: "sales",
    component: DailySalesComponent,
    canActivate: [AuthGuardService],
    children: []
  },
//   {
//     path: '',
//     component: LandingPageComponent,
//     canActivate: [AuthGuardService],
//     children: []
//   },
  { path: '', redirectTo: "signin", pathMatch: "full" },
  {
    path: 'f-and-b',
    component: FAndBComponent,
    canActivate: [],
    children: []
  },
  {
    path: 'e-commerce',
    component: ECommerceComponent,
    canActivate: [],
    children: []
  },
  {
    path: 'services',
    component: ServicesComponent,
    canActivate: [],
    children: []
  },

  {
    path: 'why-symplified',
    component: WhySymplifiedComponent,
    canActivate: [],
    children: []
  },
  {
    path: 'pricing-f-and-b',
    component: PricingComponent,
    canActivate: [],
    children: []
  },
  {
    path: 'pricing-e-commerce',
    component: PricingECommerceComponent,
    canActivate: [],
    children: []
  },
  {
    path: 'pricing-services',
    component: PricingEServicesComponent,
    canActivate: [],
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
    path: 'products/:id',
    component: EditProductComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'store/:verticleCode',
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
    path: 'product-categories',
    component: CategoriesComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'stores/:id',
    component: EditStoreComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'user-channels',
    component: ChannelsComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'agent-accounts',
    component: AccountsComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'agent-accounts/add',
    component: AddAgentComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'agent-accounts/:id',
    component: EditAgentComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'settlement',
    component: SettlementComponent,
    canActivate: [AuthGuardService],
    children: []
  },
  {
    path: 'email-verified',
    component: EmailVerifiedComponent,
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
