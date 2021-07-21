import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Subject } from 'rxjs';
import $ from 'jquery';
// import 'rxjs/add/operator/map';

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
// import { HttpClient } from '@angular/common/http';  // dt test

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
  
  data: any = [];
  dataAvailableToView: any = [true, true, true];
  summary_sales:any=[]

//   test dt
  titledt = 'datatables';
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  posts;
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();
  // end dt test

  constructor(
      private apiCalls: ApiCallsService
    ) { }

  ngOnInit(): void {
    this.setTopProducts();
    this.setDefaultDetailedSalesDates()


    // test dt 

    // this.dtOptions = {
    //     pagingType: 'full_numbers',
    //     searching: false,
    //     pageLength: 10,
    //     processing: true
    //   };
    this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 7,
        order: [[ 0, "desc" ]],
        searching: false,
        // info: false,
        // paging: false,
        lengthChange: false,
        responsive: {
            details: true
        },
        columnDefs: [ {
            targets: 'no-sort',
            orderable: false,
        }]
    };

    this.dtOptions2 = {
        pagingType: 'full_numbers',
        pageLength: 7,
        order: [[ 0, "desc" ]],
        searching: false,
        // info: false,
        // paging: false,
        lengthChange: false,
        responsive: {
            details: true
        },
        columnDefs: [ {
            targets: 'no-sort',
            orderable: false,
        }]
    };

    this.dtOptions3 = {
        pagingType: 'full_numbers',
        pageLength: 7,
        order: [[ 0, "desc" ]],
        searching: false,
        // info: false,
        // paging: false,
        lengthChange: false,
        responsive: {
            details: true
        },
        columnDefs: [ {
            targets: 'no-sort',
            orderable: false,
        }]
    };

    // this.http.get('http://jsonplaceholder.typicode.com/posts')
    // .subscribe(posts => {
    //     // this.posts = this.data;
    //     this.posts = this.data;
    //     this.dtTrigger.next();
    // });

    // end test dt 

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
                productName: "",
                rank: "",
                totalTransaction: ""
            }

            this.newTopCollection.push(custom_obj)
        }

    });

    console.log('newTopCollection: ', this.newTopCollection)

    this.dtTrigger3.next();
    console.log("topProducts: ", this.topProducts)
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

    this.posts = this.data;
    this.dtTrigger.next();

    if (this.data.length > 0) {
      this.dataAvailableToView[0] = false;
      this.dataAvailableToView[1] = false;

    }
    const data1:any = await this.apiCalls.fetchDailySales();
    this.summary_sales=data1.data.content;
    this.dtTrigger2.next();
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
    toDate.value = endDate
    this.getDetailedDailySales(startDate,endDate)
  }

  async searchSummary(){
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
  }

}
