import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeModule} from 'src/app/modules/home/home.module';
import { SingleCartComponent } from '../cart-management/components/cart-details/single-cart.component';
import {CartComponent} from '../cart-management/components/cart/cart.component'
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CartComponent,SingleCartComponent],
  imports: [
    CommonModule,
    HomeModule,
    RouterModule,
    FormsModule
  ]
})
export class CartManagementModule { }
