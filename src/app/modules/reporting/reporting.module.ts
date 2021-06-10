import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySalesComponent } from './components/daily-sales/daily-sales.component';
import { NgApexchartsModule } from "ng-apexcharts";
import {HomeModule} from 'src/app/modules/home/home.module';
import { MonthlySalesComponent } from './components/monthly-sales/monthly-sales.component';
import { SettlementComponent } from './components/settlement/settlement.component';


@NgModule({
  declarations: [DailySalesComponent, MonthlySalesComponent, SettlementComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    HomeModule
  ]
})
export class ReportingModule { }
