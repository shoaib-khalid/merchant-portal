import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
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
  data: any = [];

  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.setDailySales();
    this.setTopProducts();
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

  async setDailySales() {
    const data: any = await this.apiCalls.fetchDailySales();
    this.data = data.data.content;
    console.log(this.data)
    this.initChartData();
  }


  setTopProducts = async () => {
    var data: any = await this.apiCalls.getTopProducts();
    data = data.data;
    console.log(data)
    this.topProducts=data.content;
    // for (var i = 0; i < data.length; i++) {
    //   if (data[i].topProduct.length > 0) {
    //     this.topProducts.push({
    //       product: this.selectTopProduct(data[0].topProduct), date: data[i].date
    //     })
    //   } else {
    //     this.topProducts.push({ product: { productName: "N/A", totalTransaction: "N/A" }, date: data[i].date })
    //   }
    // }

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

}
