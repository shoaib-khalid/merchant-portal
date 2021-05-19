import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.css']
})
export class SingleOrderComponent implements OnInit {

  orderItems: any = [];
  orderId: any;
  address: any = "";
  logo: any = "";
  invoiceNo: any = "";
  date: any = "";
  paymentStatus: any = "";
  subTotal: any = "";
  total: any = "";
  constructor(private route: ActivatedRoute, private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params["orderId"]) {
        this.orderId = params["orderId"];
        this.setallDetails();
      } else {

      }
    });
  }


  setallDetails() {
    this.getOrderItems();
    this.setShipmentDetails();
    this.setStoreLogo();
    this.setOrderDetails();
  }


  async getOrderItems() {
    const data: any = await this.apiCalls.getOrderItems(this.orderId);
    this.orderItems = data.data.content;
    // console.log(this.orderItems)
  }

  async setShipmentDetails() {
    const data = await this.apiCalls.getShipmentDetails(this.orderId)
    const shimpmentDetails = data.data.content[0];
    if (shimpmentDetails) {
      this.address = `${shimpmentDetails.address}, ${shimpmentDetails.city}, ${shimpmentDetails.country}`;
    }
  }

  async setStoreLogo() {
    const assets: any = await this.apiCalls.getStoreAssets(localStorage.getItem('storeId'));
    if (assets.data) {
      this.logo = assets.data.logoUrl;
    }
  }

  async setOrderDetails() {
    const data: any = await this.apiCalls.getOrderDetails(this.orderId)
    const orderDetails = data.data.content[0];
    // console.log(orderDetails)
    this.paymentStatus = orderDetails.paymentStatus;
    this.invoiceNo = this.orderId;
    this.date = orderDetails.created;
    this.date = this.date.substring(0, 10);
    this.subTotal = orderDetails.subTotal;
    this.total = orderDetails.total;
  }

  printInvoice() {
    var divToPrint = document.getElementsByClassName('card-body')[0];
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 10);
  }

}
