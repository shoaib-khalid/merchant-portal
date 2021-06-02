import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service'

@Component({
  selector: 'app-monthly-sales',
  templateUrl: './monthly-sales.component.html',
  styleUrls: ['./monthly-sales.component.css']
})
export class MonthlySalesComponent implements OnInit {
  monSales: any = [];
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.showMonths()
  }
  async showMonths() {
    var d = new Date();
    const endMonth = d.getMonth();
    const endYear = d.getFullYear().toString().slice(-2)
    var startMonth: any = "";
    d.setMonth(d.getMonth() - 2)
    startMonth = d.getMonth();
    const startYear = d.getFullYear().toString().slice(-2);
    const data: any = await this.apiCalls.getMonthlySales(`${startMonth}-${startYear}`, `${endMonth}-${endYear}`);
    this.monSales = data.data;
  }
}
