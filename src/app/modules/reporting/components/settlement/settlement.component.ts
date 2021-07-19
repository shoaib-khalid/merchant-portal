import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.css']
})
export class SettlementComponent implements OnInit {

  settlement:any=[];
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.getSettlement();
  }

  /**
   * 
   * @returns todays date and date from 28 days ago
   */
  last28days() {
    var d = new Date();
    const to = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    d.setDate(d.getDate() - 28);
    const from = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    return [from, to];
  }

  async getSettlement() {
    const dates = this.last28days();
    var data: any = await this.apiCalls.getSettlement(dates[0], dates[1]);
    console.log(data)
    data = data.data;
    this.settlement=data;
  }


}
