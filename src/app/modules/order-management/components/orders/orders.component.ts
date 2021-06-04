import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any = [];
  allOrders: any = [];
  orderId: any = [];
  customerId: any = "";
  constructor(private apiCalls: ApiCallsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params["customerId"]) {
        this.customerId = params["customerId"];
        this.getOrdersBasedOnCustomerId()
      } else {
        this.getOrders();
      }
    });
  }

  async getOrders() {
    this.orders = await this.apiCalls.getOrders();
    this.orders = this.orders.data.content;
    this.allOrders = this.orders;
    console.log(this.allOrders)
  }

  async getOrdersBasedOnCustomerId() {
    this.orders = await this.apiCalls.getOrders(this.customerId);
    this.orders = this.orders.data.content;
    this.allOrders = this.orders;
  }

  showOrderItems(order) {
    this.router.navigate(['orders/order-details'], { queryParams: { orderId: order.id } })

  }

  filterOrders(event) {
    // var filter = event.target.value+"";
    // filter=filter.toLowerCase();
    // console.log(filter)
    // this.orders = this.allOrders.filter(word => word.customerId.toLowerCase().includes(filter));
  }

}
