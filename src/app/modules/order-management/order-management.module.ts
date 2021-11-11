import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeModule} from 'src/app/modules/home/home.module';
import { OrdersComponent } from '../order-management/components/orders/orders.component';
import { SingleOrderComponent } from '../order-management/components/order-details/single-order.component';
import { SelectProviderPopupComponent } from '../order-management/components/order-details/select-provider-popup/select-provider-popup.component';
import {RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomersComponent } from './components/customers/customers.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [OrdersComponent,SingleOrderComponent, CustomersComponent,SelectProviderPopupComponent],
  imports: [
    CommonModule,
    HomeModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule
  ]
})
export class OrderManagementModule { }
