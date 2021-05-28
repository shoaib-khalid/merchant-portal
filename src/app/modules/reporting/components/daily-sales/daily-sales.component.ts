import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { dataSeries } from './data-series';
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
  data: any = [];

  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.setDailySales();
  }
  public initChartData(): void {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    var n = d.getTime();
    let ts2 = n;
    let dates = [];
    for (let i = 0; i < 7; i++) {
      ts2 = ts2 + 86400000;
      dates.push([ts2, this.data[i].totalAmount]);
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
      text: "",
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
    this.data = data.data;
    this.initChartData();

    console.log(this.data)
  }

}
