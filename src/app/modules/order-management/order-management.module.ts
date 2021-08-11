import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeModule} from 'src/app/modules/home/home.module';
import { OrdersComponent } from '../order-management/components/orders/orders.component';
import { SingleOrderComponent } from '../order-management/components/order-details/single-order.component';
import {RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomersComponent } from './components/customers/customers.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [OrdersComponent,SingleOrderComponent, CustomersComponent],
  imports: [
    CommonModule,
    HomeModule,
    RouterModule,
    FormsModule,
    MatIconModule
  ]
})
export class OrderManagementModule { }
