import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductsComponent } from './components/products/products.component';



@NgModule({
  declarations: [AddProductComponent, ProductsComponent],
  imports: [
    CommonModule
  ]
})
export class ProductManagementModule { }
