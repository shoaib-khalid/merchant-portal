import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductsComponent } from './components/products/products.component';
import { ChooseVerticleComponent } from './components/choose-verticle/choose-verticle.component';



@NgModule({
  declarations: [AddProductComponent, ProductsComponent, ChooseVerticleComponent],
  imports: [
    CommonModule
  ]
})
export class ProductManagementModule { }
