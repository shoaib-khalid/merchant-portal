import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FlowDialog } from 'src/app/modules/flow-builder/components/flow-dialog/flow-dialog.component';
import { HttpConfigInterceptor } from 'src/app/services/httpconfig.interceptor';
import { Helper } from './helpers/graph-helper';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from 'src/app/services/app.config.ts.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FlowBuilderModule } from './modules/flow-builder/flow-builder.module';
import { UserOnboardingModule } from './modules/user-onboarding/user-onboarding.module';
import { ProductManagementModule } from './modules/product-management/product-management.module';
import { HomeModule } from './modules/home/home.module';
import { StoreManagementModule } from './modules/store-management/store-management.module';
import { CartManagementModule } from './modules/cart-management/cart-management.module';
import { OrderManagementModule } from './modules/order-management/order-management.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { AgentManagementModule } from './modules/agent-management/agent-management.module';
import { DiscountManagementModule } from './modules/discount-management/discount-management.module';
import { BrowserModule } from "@angular/platform-browser";
// import { DataTablesModule } from "angular-datatables";

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [
    HttpClientModule,
    FlowBuilderModule,
    AppRoutingModule,
    UserOnboardingModule,
    ProductManagementModule,
    HomeModule,
    StoreManagementModule,
    CartManagementModule,
    OrderManagementModule,
    ReportingModule,
    AgentManagementModule,
    BrowserModule,
    DiscountManagementModule
    // DataTablesModule.forRoot()
  ], entryComponents: [FlowDialog],
  providers: [Helper, { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }, },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }, AppConfig, {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
