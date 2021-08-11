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
  order: any = "";
  dt:any="";

  constructor(private route: ActivatedRoute, private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.initializeStoreDetails();
    this.checkDeliveryType();
  }

  async checkDeliveryType(){
    const data:any = await this.apiCalls.getDeliveryDetailsStore(localStorage.getItem('storeId'));
    if(data.data.type=="SELF"){
      this.dt='SELF';
    }
  }


  setallDetails() {
    this.getOrderItems();
    // this.setShipmentDetails();
    this.setStoreLogo();
    this.setOrderDetails();
  }


  async getOrderItems() {
    const data: any = await this.apiCalls.getOrderItems(this.orderId);
    console.log(data)
    this.orderItems = data.data.content;
  }

  async setShipmentDetails() {
    const data = await this.apiCalls.getShipmentDetails(this.orderId)
    const shimpmentDetails = data.data;
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
    const orderDetails = data.data;
    this.order=orderDetails;
    this.address = orderDetails.orderShipmentDetail;
    console.log(orderDetails)
    this.paymentStatus = orderDetails.paymentStatus;
    this.invoiceNo = orderDetails.invoiceId;
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

  async readyForPickup(){
    this.apiCalls.loadingAnimation("Loading...");
    const data = await this.apiCalls.orderUpdationCompletionStatus(this.order.id);
    this.apiCalls.loadingdialogRef.close();
    this.initializeStoreDetails()
  }


  initializeStoreDetails(){
    this.route.queryParams.subscribe(params => {
      if (params["orderId"]) {
        this.orderId = params["orderId"];
        this.setallDetails();
      } else {
      }
    });
  }

}
