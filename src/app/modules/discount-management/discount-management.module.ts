import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { RouterModule } from '@angular/router';
import { HomeModule } from '../home/home.module';
import { FormsModule } from '@angular/forms';
import { DiscountTierComponent } from './components/discount-tier/discount-tier.component';



@NgModule({
  declarations: [DiscountsComponent, DiscountTierComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeModule,
    FormsModule
  ]
})
export class DiscountManagementModule { }
