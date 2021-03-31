import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {ManageStoresComponent} from 'src/app/modules/store-management/components/manage-stores/manage-stores.component';
import {StorePageComponent} from './components/store-page/store-page.component';
import {HomeModule} from 'src/app/modules/home/home.module';
@NgModule({
  declarations: [ManageStoresComponent,StorePageComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeModule,
    FormsModule
  ]
})
export class StoreManagementModule { }
