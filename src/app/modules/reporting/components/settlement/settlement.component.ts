import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { ColumnMode } from 'projects/swimlane/ngx-datatable/src/public-api';
import $ from 'jquery';
import { isObject } from 'ngx-chips/core/accessor';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.css']
})
export class SettlementComponent implements OnInit {

  settlement:any=[];
  newSettlementCollection = [];

  data: any = [];
  dataAvailableToView: any = [true, true, true];
  summary_sales:any=[]

  rows = [];

  ColumnMode = ColumnMode;

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

  async searchSettlement(){

    // alert('masok')
    const fromDate:any = $('#from-date-detailed').val();
    const toDate:any = $('#to-date-detailed').val();
    console.log(fromDate)
    console.log(toDate)
    const data: any = await this.apiCalls.fetchSettlementByDates(fromDate,toDate);

    this.settlement=data.data.content;

    console.log('search element: ', this.settlement)
    
    this.newSettlementCollection = [];

    // create new topProducts Collection 
    this.settlement.forEach( obj => {


        var new_date = new Date(obj.settlementDate)
        var day = new_date.getDate()
        var month = new_date.getMonth() + 1
        var year = new_date.getFullYear()

        // alert(month)

        var payout_date = day + "-" + month + "-" + year

        var new_date2 = new Date(obj.cycleStartDate)
        var day = new_date2.getDate()
        var month = new_date2.getMonth() + 1
        var year = new_date2.getFullYear()

        var start_date = day + "-" + month + "-" + year

        var new_date3 = new Date(obj.cycleEndDate)
        var day = new_date3.getDate()
        var month = new_date3.getMonth() + 1
        var year = new_date3.getFullYear()

        var cut_off_date = day + "-" + month + "-" + year

        // var gross = !obj.totalServiceFee ? '0.00' : obj.totalServiceFee;
        var service = !obj.totalServiceFee ? '0.00' : obj.totalServiceFee;
        var commision = !obj.totalCommissionFee ? '0.00' : obj.totalCommissionFee;
        var nett = !obj.totalServiceFee ? '0.00' : obj.totalServiceFee;

        // if(obj.totalTransactionValue == null){
          let custom_obj = {
            payoutDate: ''+payout_date+'',
            startDate: ''+start_date+'',
            cutOffDate: ''+cut_off_date+'',
            grossAmount: obj.totalTransactionValue?obj.totalTransactionValue:"",
            serviceCharges: ''+service+'',
            deliveryCharges: ''+obj.totalDeliveryFee?obj.totalDeliveryFee:""+'',
            commision: ''+obj.totalCommisionFee?obj.totalCommisionFee:"0",
            nettAmount: ''+obj.totalStoreShare?obj.totalStoreShare:""
        }
    
            this.newSettlementCollection.push(custom_obj)
        // }

    });

    this.rows = this.newSettlementCollection;

    console.log('newObj: ', this.rows)

  }

  async getSettlement() {
    const dates = this.last28days();
    var data: any = await this.apiCalls.getSettlement(dates[0], dates[1]);
    console.log(data)
    data = data.data;
    this.settlement=data.content;
    // hard reset newTopCollection
    this.newSettlementCollection = [];

    // create new topProducts Collection 
    this.settlement.forEach( obj => {


        var new_date = new Date(obj.settlementDate)
        var day = new_date.getDate()
        var month = new_date.getMonth() + 1
        var year = new_date.getFullYear()

        // alert(month)

        var payout_date = day + "-" + month + "-" + year

        var new_date2 = new Date(obj.cycleStartDate)
        var day = new_date2.getDate()
        var month = new_date2.getMonth() + 1
        var year = new_date2.getFullYear()

        var start_date = day + "-" + month + "-" + year

        var new_date3 = new Date(obj.cycleEndDate)
        var day = new_date3.getDate()
        var month = new_date3.getMonth() + 1
        var year = new_date3.getFullYear()

        var cut_off_date = day + "-" + month + "-" + year

        // [report field] - [ep field]
        // Payout date - settlementDate
        // Start date - cycleStartDate
        // Cut-off date - cycleEndDate
        // Gross amount - tbc
        // Service charges - totalServiceCharges
        // Delivery charges - to be added
        // Commission - totalCommissionFee
        // Nett amount - tbc

        // var gross = !obj.totalServiceFee ? '0.00' : obj.totalServiceFee;
        var service = !obj.totalServiceFee ? '0.00' : obj.totalServiceFee;
        var commision = !obj.totalCommissionFee ? '0.00' : obj.totalCommissionFee;
        var nett = !obj.totalServiceFee ? '0.00' : obj.totalServiceFee;

        // if(obj.totalTransactionValue == null){
            let custom_obj = {
                payoutDate: ''+payout_date+'',
                startDate: ''+start_date+'',
                cutOffDate: ''+cut_off_date+'',
                grossAmount: obj.totalTransactionValue?obj.totalTransactionValue:"",
                serviceCharges: ''+service+'',
                deliveryCharges: ''+obj.totalDeliveryFee?obj.totalDeliveryFee:""+'',
                commision: ''+obj.totalCommisionFee?obj.totalCommisionFee:"0",
                nettAmount: ''+obj.totalStoreShare?obj.totalStoreShare:""
            }
    
            this.newSettlementCollection.push(custom_obj)
        // }

    });

    this.rows = this.newSettlementCollection;

    console.log('newObj: ', this.rows)
  }


}
