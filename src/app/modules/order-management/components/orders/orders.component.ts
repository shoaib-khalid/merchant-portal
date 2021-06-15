import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router, ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any = [];
  orderId: any = [];
  customerId: any = "";
  pages: any = [];
  totalPages: number = 0;
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
    this.totalPages = this.orders.data.totalPages;
    this.setPagination(this.orders.data.totalPages, 1)
    this.orders = this.orders.data.content;
  }

  async getOrdersBasedOnCustomerId() {
    this.orders = await this.apiCalls.getOrders(this.customerId);
    this.orders = this.orders.data.content;
  }

  showOrderItems(order) {
    this.router.navigate(['orders/order-details'], { queryParams: { orderId: order.id } })
  }


  /**
   * This function fetches next 10 orders to show
   * basically it helps pagination
   */
  async openPage(page) {
    this.orders = await this.apiCalls.getOrders(null, page - 1);
    this.markSelectedPage(page)
    this.orders = this.orders.data.content;
    this.removeClassIfExist()
  }

  removeClassIfExist() {
    const eles = document.getElementsByClassName('pagination');
    for (var i = 0; i < eles.length; i++) {
      if (eles[i].classList.contains('active')) {
        eles[i].classList.remove("active")
      }
    }
  }

  setPagination(n, page) {
    this.pages = [];
    n = this.setPages(n);
    for (var i = 1; i <= n; i++) {
      this.pages.push({ no: i, isActive: "non-active" })
    }
    this.pages[page - 1].isActive = "active";
  }

  setPages(n) {
    const mod = 5 % n;
    if (n > 5) {
      return mod;
    } else {
      return n;
    }
  }


  markSelectedPage(page) {
    const arr = this.setNextPagination(page);
    const start = arr[0];
    const end = arr[1];
    this.pages = [];
    for (var i = start; i <= end; i++) {
      if (i == page) {
        this.pages.push({ no: i, isActive: "active" })
      } else {
        this.pages.push({ no: i, isActive: "non-active" })
      }
    }
  }

  setNextPagination(page) {
    if (page < 5) {
      if (this.totalPages < 5) {
        return [1, this.totalPages];
      } else {
        return [1, 5]
      }
    } else if (page == this.totalPages) {
      return [page - 4, page]
    }
    else {
      if (this.totalPages > page) {
        return [page - 4, page + 1]
      } else {
        [1, 5]
      }
    }
  }

  filterOrders() {
    var fromDate, toDate;
    var filter: any = document.getElementsByClassName('filter');
    filter = filter[0].value;
    console.log(filter);
    [fromDate, toDate] = this.getDates();

  }

  getDates() {
    const fromDate: any = document.getElementById('from-date');
    const toDate: any = document.getElementById('to-date');
    return [fromDate.value, toDate.value];
  }


}