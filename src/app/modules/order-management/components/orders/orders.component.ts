import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any = [];
  allOrders:any=[];
  orderId:any=[];
  constructor(private apiCalls: ApiCallsService, private router:Router) { }

  ngOnInit(): void {
    this.getOrders();
  }

  async getOrders() {
    this.orders = await this.apiCalls.getOrders();
    this.orders = this.orders.data.content;
    this.allOrders = this.orders;
  }

  showOrderItems(order){
    this.router.navigate(['orders/order-details'],{ queryParams: { orderId: order.id }})

  }

  filterOrders(event){
    // var filter = event.target.value+"";
    // filter=filter.toLowerCase();
    // console.log(filter)
    // this.orders = this.allOrders.filter(word => word.customerId.toLowerCase().includes(filter));
  }

}
