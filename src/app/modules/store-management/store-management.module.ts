import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ManageStoresComponent} from 'src/app/modules/store-management/components/manage-stores/manage-stores.component';
import {HomeModule} from 'src/app/modules/home/home.module';
@NgModule({
  declarations: [ManageStoresComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeModule
  ]
})
export class StoreManagementModule { }
