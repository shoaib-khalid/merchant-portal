import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySalesComponent } from './components/daily-sales/daily-sales.component';
import { NgApexchartsModule } from "ng-apexcharts";
import {HomeModule} from 'src/app/modules/home/home.module';
import { MonthlySalesComponent } from './components/monthly-sales/monthly-sales.component';


@NgModule({
  declarations: [DailySalesComponent, MonthlySalesComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    HomeModule
  ]
})
export class ReportingModule { }
