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
  constructor(private apiCalls: ApiCallsService, private router:Router) { }

  ngOnInit(): void {
    this.getOrders();
  }

  async getOrders() {
    this.orders = await this.apiCalls.getOrders();
    this.orders = this.orders.data.content;
  }

  showOrderItems(order){
    this.router.navigate(['orders/order-details'],{ queryParams: { orderId: order.id }})

  }

}
