import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import $ from 'jquery';


import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import { ColumnMode } from 'projects/swimlane/ngx-datatable/src/public-api';


@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.css']
})
export class DailySalesComponent implements OnInit {


  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;

  topProducts: any = [];
  newTopCollection = [];
  detailsCollection = [];
  
  data: any = [];
  dataAvailableToView: any = [true, true, true];
  summary_sales:any=[]

    rows = [];
    rows2 = [];
    rows3 = [];
    ColumnMode = ColumnMode;

  constructor(
      private apiCalls: ApiCallsService
    ) {}

  ngOnInit(): void {

    this.setTopProducts();
    this.setDefaultDetailedSalesDates()

  }

  public initChartData(): void {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    var n = d.getTime();
    let ts2 = n;
    let dates = [];
    for (let i = 0; i < this.data.length; i++) {
      ts2 = ts2 + 86400000;
      dates.push([this.data[i].date, this.data[i].totalOrders]);
    }

    this.series = [
      {
        name: "Total Amount ",
        data: dates
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Daily Sales",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function (val) {
          return (val).toFixed(0);
        }
      },
      title: {
        text: "Total Amount"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function (val) {
          return (val).toFixed(0);
        }
      }
    };
  }


  setTopProducts = async () => {
    var data: any = await this.apiCalls.getTopProducts();
    console.log("getTopProducts: ", data)

    data = data.data;
    this.topProducts = data;
    if (this.topProducts.length > 0) {
      this.dataAvailableToView[2] = false;
    }

    // hard reset newTopCollection
    this.newTopCollection = [];

    // create new topProducts Collection 
    this.topProducts.forEach( obj => {
        const date = obj.date
        const subObj = obj.topProduct

        if(subObj.length > 0){
            subObj.forEach(el => {
                let custom_obj = {
                    date: ''+date+'',
                    productName: el.productName,
                    rank: el.rank,
                    totalTransaction: el.totalTransaction
                }

                this.newTopCollection.push(custom_obj)
            });
        }else{
            let custom_obj = {
                date: ''+date+'',
                productName: "N/A",
                rank: "N/A",
                totalTransaction: "N/A",
            }

            this.newTopCollection.push(custom_obj)
        }

    });

    console.log('newTopCollection: ', this.newTopCollection)
    console.log("topProducts: ", this.topProducts)

    this.rows3 = this.newTopCollection

  }

  /**
   * Selects top product from 
   * dailTopProduct array based on rank
   */
  selectTopProduct(dailyTopProducts) {
    for (var i = 0; i < dailyTopProducts.length; i++) {
      if (dailyTopProducts[i].rank == 1) {
        return dailyTopProducts[i]
      }
    }
  }

  async getDetailedDailySales(fromDate,toDate) {
    const data: any = await this.apiCalls.fetchDetailedDailySales(fromDate,toDate);

    this.data = data.data;

    console.log('detailsCollection: ', this.data)
    // hard reset newTopCollection
    this.detailsCollection = [];

    // create new topProducts Collection 
    this.data.forEach( obj => {
        const date = obj.date
        const subObj = obj.sales

        if(subObj.length > 0){
            subObj.forEach(el => {
                let custom_obj = {
                    date: ''+date+'',
                    storeName: el.storeName,
                    customerName: el.customerName,
                    subTotal: el.subTotal,
                    serviceCharge: el.serviceCharge,
                    deliveryCharge: el.deliveryCharge,
                    commission: el.commission,
                    total: el.total,
                    orderStatus: el.orderStatus,
                    deliveryStatus: el.deliveryStatus,
                }

                this.detailsCollection.push(custom_obj)
            });
        }else{
            let custom_obj = {
                date: ''+date+'',
                storeName: "N/A",
                customerName: "N/A",
                subTotal: "N/A",
                serviceCharge: "N/A",
                deliveryCharge: "N/A",
                commission: "N/A",
                total: "N/A",
                orderStatus: "N/A",
                deliveryStatus: "N/A"
            }

            this.detailsCollection.push(custom_obj)
        }

    });

    console.log('detailsCollection[] : ', this.detailsCollection)

    this.rows = this.detailsCollection;

    if (this.data.length > 0) {
      this.dataAvailableToView[0] = false;
      this.dataAvailableToView[1] = false;
    }
    const data1:any = await this.apiCalls.fetchDailySales();
    this.summary_sales=data1.data.content;

    this.rows2 = this.summary_sales
    console.log(data)
    console.log('summary_sales: ', this.summary_sales)

  }

  setDefaultDetailedSalesDates(){
    var d = new Date();
    const endDate = d.toISOString().slice(0, 10)
    d.setDate(d.getDate() - 6);
    const startDate = d.toISOString().slice(0, 10);
    const fromDate:any = document.getElementById('from-date-detailed');
    const toDate:any = document.getElementById('to-date-detailed');
    fromDate.value = startDate;
    toDate.value = endDate;
    // const endDate = "2021-07-22";
    // const startDate = "2021-07-01";
    this.getDetailedDailySales(startDate,endDate)
  }

  async searchDailyDetails(){
    const fromDate:any = $('#from-date-detailed').val();
    const toDate:any = $('#to-date-detailed').val();
    console.log(fromDate)
    console.log(toDate)
    const data: any = await this.apiCalls.fetchDetailedDailySales(fromDate,toDate);
    this.data = data.data;
    if (this.data.length > 0) {
      this.dataAvailableToView[0] = false;
      this.dataAvailableToView[1] = false;
    }

    // hard reset newTopCollection
    this.detailsCollection = [];

    // create new topProducts Collection 
    this.data.forEach( obj => {
        const date = obj.date
        const subObj = obj.sales

        if(subObj.length > 0){
            subObj.forEach(el => {
                let custom_obj = {
                    date: ''+date+'',
                    storeName: el.storeName,
                    customerName: el.customerName,
                    subTotal: el.subTotal,
                    serviceCharge: el.serviceCharge,
                    deliveryCharge: el.deliveryCharge,
                    commission: el.commission,
                    total: el.total,
                    orderStatus: el.orderStatus,
                    deliveryStatus: el.deliveryStatus,
                }

                this.detailsCollection.push(custom_obj)
            });
        }else{
            let custom_obj = {
                date: ''+date+'',
                storeName: "N/A",
                customerName: "N/A",
                subTotal: "N/A",
                serviceCharge: "N/A",
                deliveryCharge: "N/A",
                commission: "N/A",
                total: "N/A",
                orderStatus: "N/A",
                deliveryStatus: "N/A"
            }

            this.detailsCollection.push(custom_obj)
        }

    });

    console.log('detailsCollection[] : ', this.detailsCollection)

    this.rows = this.detailsCollection;


  }



  async searchSummary(){
    const fromDate:any = $('#from-date-detailed2').val();
    const toDate:any = $('#to-date-detailed2').val();
    console.log(fromDate)
    console.log(toDate)
    const data: any = await this.apiCalls.fetchDetailedDailySalesByDates(fromDate,toDate);

    this.summary_sales=data.data.content;
    this.rows2 = this.summary_sales

  }


  async searchTopProduct(){

    const fromDate:any = $('#from-date-detailed3').val();
    const toDate:any = $('#to-date-detailed3').val();
    console.log(fromDate)
    console.log(toDate)
    const data: any = await this.apiCalls.getTopProductsByDates(fromDate,toDate);

    console.log('data: ', data.data)
    this.topProducts = data.data;

    // hard reset newTopCollection
    this.newTopCollection = [];

    // create new topProducts Collection 
    this.topProducts.forEach( obj => {
        const date = obj.date
        const subObj = obj.topProduct

        if(subObj.length > 0){
            subObj.forEach(el => {
                let custom_obj = {
                    date: ''+date+'',
                    productName: el.productName,
                    rank: el.rank,
                    totalTransaction: el.totalTransaction
                }

                this.newTopCollection.push(custom_obj)
            });
        }else{
            let custom_obj = {
                date: ''+date+'',
                productName: "N/A",
                rank: "N/A",
                totalTransaction: "N/A"
            }

            this.newTopCollection.push(custom_obj)
        }

    });

    this.rows3 = this.newTopCollection

  }

}
