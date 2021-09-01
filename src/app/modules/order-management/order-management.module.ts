import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeModule} from 'src/app/modules/home/home.module';
import { OrdersComponent } from '../order-management/components/orders/orders.component';
import { SingleOrderComponent } from '../order-management/components/order-details/single-order.component';
import {RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomersComponent } from './components/customers/customers.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  declarations: [OrdersComponent,SingleOrderComponent, CustomersComponent],
  imports: [
    CommonModule,
    HomeModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule
  ]
})
export class OrderManagementModule { }
