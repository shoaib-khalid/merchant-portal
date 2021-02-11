import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FlowDialog } from 'src/app/modules/flow-builder/components/flow-dialog/flow-dialog.component';

import { Helper } from './helpers/graph-helper';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FlowBuilderModule } from './modules/flow-builder/flow-builder.module';
import { UserOnboardingModule } from './modules/user-onboarding/user-onboarding.module';
import {ProductManagementModule} from './modules/product-management/product-management.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    FlowBuilderModule,
    AppRoutingModule,
    UserOnboardingModule,
    ProductManagementModule
  ], entryComponents: [FlowDialog],
  providers: [Helper, { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
