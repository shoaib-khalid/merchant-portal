import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductsComponent } from './components/products/products.component';
import { ChooseVerticleComponent } from './components/choose-verticle/choose-verticle.component';
import {RouterModule } from '@angular/router';
import {HomeModule} from 'src/app/modules/home/home.module';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { OrdersComponent } from './components/orders/orders.component';
import { CartComponent } from './components/cart/cart.component';
import { SingleOrderComponent } from './components/order-details/single-order.component';
import { SingleCartComponent } from './components/cart-details/single-cart.component';



@NgModule({
  declarations: [AddProductComponent, ProductsComponent, ChooseVerticleComponent, OrdersComponent, CartComponent, SingleOrderComponent, SingleCartComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeModule,
    FormsModule,
    TagInputModule
  ]
})
export class ProductManagementModule { }
