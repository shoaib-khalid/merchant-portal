import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductsComponent } from './components/products/products.component';
import { ChooseVerticleComponent } from '../store-management/components/choose-verticle/choose-verticle.component';
import {RouterModule } from '@angular/router';
import {HomeModule} from 'src/app/modules/home/home.module';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreateNewComponent } from './components/categories/create-new/create-new.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { EditCategoryComponent } from './components/categories/edit-category/edit-category.component';



@NgModule({
  declarations: [AddProductComponent, ProductsComponent, ChooseVerticleComponent, EditProductComponent, CategoriesComponent, CreateNewComponent, EditCategoryComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeModule,
    FormsModule,
    MatDialogModule,
    TagInputModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    CKEditorModule,
    ReactiveFormsModule
  ]
})
export class ProductManagementModule { }
