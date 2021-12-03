import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectProviderPopupComponent } from './select-provider-popup/select-provider-popup.component';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.css']
})
export class SingleOrderComponent implements OnInit {

  orderItems: any = [];
  orderId: any;
  address: any = "";
  deliveryProviderId: any = "";
  logo: any = "";
  invoiceNo: any = "";
  date: any = "";
  paymentStatus: any = "";
  subTotal: any = "";
  total: any = "";
  order: any = "";
  dt: any = "";
  showFiller = false;
  completionStatus = {
      currentCompletionStatus: "",
      nextCompletionStatus: "",
      nextActionText: "",
  }

  deliveryRiderDetails = {
    orderNumber: null,
    provider: null,
    airwayBill: null,
    trackingUrl: null
  }

  constructor(private route: ActivatedRoute, private apiCalls: ApiCallsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initializeStoreDetails();
    this.checkDeliveryType();
    this.getOrderCompletionStatuses();
  }

  async getOrderCompletionStatuses(){
    const response: any = await this.apiCalls.getOrderCompletionStatuses(this.orderId);
    this.completionStatus.currentCompletionStatus = response.data.currentCompletionStatus;
    this.completionStatus.nextCompletionStatus = response.data.nextCompletionStatus;
    this.completionStatus.nextActionText = response.data.nextActionText;

    if (response.data.currentCompletionStatus === "BEING_DELIVERED"){
      this.getDeliveryRiderDetails();
    }
    console.log("getOrderCompletionStatuses: ", response)
  }

  async getDeliveryRiderDetails(){
    const response: any = await this.apiCalls.getDeliveryRiderDetails(this.orderId);
    this.deliveryRiderDetails.orderNumber = response.data.orderNumber;
    this.deliveryRiderDetails.airwayBill = response.data.airwayBill;
    this.deliveryRiderDetails.trackingUrl = response.data.trackingUrl;

    this.deliveryRiderDetails.provider = response.data.provider;
    console.log("getDeliveryRiderDetails: ", response)
  }

  async checkDeliveryType() {
    const data: any = await this.apiCalls.getDeliveryDetailsStore(localStorage.getItem('storeId'));
    if (data.data.type == "SELF") {
      this.dt = 'SELF';
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
    this.order = orderDetails;
    this.address = orderDetails.orderShipmentDetail;
    this.deliveryProviderId = orderDetails.orderShipmentDetail.deliveryProviderId;
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
    }, 100);
  }

  async readyForPickup(completionStatus) {

    if (completionStatus === "AWAITING_PICKUP") { 
      const assets: any = await this.apiCalls.getDeliveryProviderDetails(this.deliveryProviderId);
      console.log("assets: ", assets)
      const dialogRef = this.dialog.open(SelectProviderPopupComponent, { disableClose: true, data: assets });
      dialogRef.afterClosed().subscribe(async result => {
        console.log(result);
        if (result === "cancelled" || !result.date || !result.time){
          alert("Date and time required !!");
        } else {
            console.log("disini: ")
            this.apiCalls.loadingAnimation("Loading...");
            // const data = await this.apiCalls.orderUpdationCompletionStatus(this.order.id);
            const data = await this.apiCalls.updateCompletionStatus(this.order.id, completionStatus,result.date,result.time)
            this.apiCalls.loadingdialogRef.close();
            this.initializeStoreDetails();
            this.getDeliveryRiderDetails();

            // re call this.getOrderCompletionStatuses() to get new status
            this.getOrderCompletionStatuses();
        }
      });
    } else {
      this.apiCalls.loadingAnimation("Loading...");
      // const data = await this.apiCalls.orderUpdationCompletionStatus(this.order.id);
      const data = await this.apiCalls.updateCompletionStatus(this.order.id, completionStatus)
      this.apiCalls.loadingdialogRef.close();
      this.initializeStoreDetails()
    }

    // re query to change the text and label
    this.getOrderCompletionStatuses();
    
  }


  initializeStoreDetails() {
    this.route.queryParams.subscribe(params => {
      if (params["orderId"]) {
        this.orderId = params["orderId"];
        this.setallDetails();
      } else {
      }
    });
  }

}
