import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {ManageStoresComponent} from 'src/app/modules/store-management/components/manage-stores/manage-stores.component';
import {StorePageComponent} from './components/store-page/store-page.component';
import {HomeModule} from 'src/app/modules/home/home.module';
import { EditStoreComponent } from './components/edit-store/edit-store.component';
@NgModule({
  declarations: [ManageStoresComponent,StorePageComponent, EditStoreComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeModule,
    FormsModule
  ]
})
export class StoreManagementModule { }
