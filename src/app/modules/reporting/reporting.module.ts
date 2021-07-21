import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySalesComponent } from './components/daily-sales/daily-sales.component';
import { NgApexchartsModule } from "ng-apexcharts";
import {HomeModule} from 'src/app/modules/home/home.module';
import { MonthlySalesComponent } from './components/monthly-sales/monthly-sales.component';
import { SettlementComponent } from './components/settlement/settlement.component';
// import { BrowserModule } from "@angular/platform-browser";
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [DailySalesComponent, MonthlySalesComponent, SettlementComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    HomeModule,
    // BrowserModule,
    DataTablesModule
  ],
  bootstrap: [DailySalesComponent],
})
export class ReportingModule { }
