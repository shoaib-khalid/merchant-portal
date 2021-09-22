import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { RouterModule } from '@angular/router';
import { HomeModule } from '../home/home.module';
import { FormsModule } from '@angular/forms';
import { DiscountTierComponent } from './components/discount-tier/discount-tier.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { EditDiscountComponent } from './components/edit-discount/edit-discount.component';
import { EditDiscountTierComponent } from './components/edit-discount-tier/edit-discount-tier.component';



@NgModule({
  declarations: [DiscountsComponent, DiscountTierComponent, EditDiscountComponent, EditDiscountTierComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule
  ]
})
export class DiscountManagementModule { }
