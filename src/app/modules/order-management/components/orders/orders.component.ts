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
  orderId: any = [];
  customerId: any = "";
  pages: any = [];
  totalPages: number = 0;
  filterObj: any = { pageSize: 10 };
  totalOrders: any = 0;
  constructor(private apiCalls: ApiCallsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.checkForParams(params);
    });
  }

  async getOrders() {
    this.orders = await this.apiCalls.getOrders();
    this.totalOrders = this.orders.data.totalElements;
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
    const obj: any = this.filterObj;
    obj.page = page - 1;
    this.orders = await this.apiCalls.getFilteredOrders(obj);
    this.totalOrders = this.orders.data.totalElements;
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
    if (this.pages.length > 0) {
      this.pages[page - 1].isActive = "active";

    }
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

  async filterOrders() {
    const params: any = this.composeFilterObject(this.getAllFilters())
    const data: any = await this.apiCalls.getFilteredOrders(params);
    this.totalPages = data.data.totalPages;
    this.setPagination(data.data.totalPages, 1)
    this.totalOrders = data.data.totalElements;
    this.orders = data.data.content;
  }

  getAllFilters() {
    const filter: any = document.getElementsByClassName('filter');
    var filterValues = new Array(11).fill('');
    for (var i = 0; i < filter.length; i++) {
      filterValues[i] = filter[i].value;
    }
    return filterValues;
  }


  composeFilterObject(filterValues) {
    const obj = {
      receiverName: filterValues[0],
      phoneNumber: filterValues[1],
      from: filterValues[2],
      to: filterValues[3],
      pageSize: 10
    }

    this.filterObj = obj;
    return obj;
  }

  setTodaysDate() {
    const toDate: any = document.getElementsByClassName('filter')[3];
    const fromDate: any = document.getElementsByClassName('filter')[2];

    toDate.value = new Date().toISOString().replace(/T.*/, '').split('-').join('-');
    fromDate.value = toDate.value;

  }

  showOrdersBasedOnCustomerId(params) {
    this.customerId = params["customerId"];
    this.getOrdersBasedOnCustomerId()
  }

  /**
   * Check whether the parameters contain customerId
   * If params contain customerId then orders will be
   * shown related to that customer. Otherwise general 
   * orders will be shown
   * @param params 
   */
  checkForParams(params) {
    if (params["customerId"]) {
      this.showOrdersBasedOnCustomerId(params);
    } else if (this.urlContainsSearchParams(params)) {
      this.populateSearchFields(params);
    }
    else {
      this.displayOrdersWithoutAnyFilter();
    }
  }

  displayOrdersWithoutAnyFilter() {
    this.getOrders();
    this.setTodaysDate();
  }



  /**
   * Check whether the url contains search params
   * If url contains any param then we put them in
   * object and them to backend for searching
   */
  urlContainsSearchParams(params) {
    if ('receiverName' in params && 'phoneNumber' in params && 'from' in params && 'to' in params) {
      return true;
    } else {
      return false;
    }
  }

  populateSearchFields(params) {
    const filter: any = document.getElementsByClassName('filter');
    filter[0].value=params['receiverName'];
    filter[1].value=params['phoneNumber'];
    filter[2].value=params['from'];
    filter[3].value=params['to'];
    
    this.filterOrders();
  }

  searchOrders(){
    const filter: any = document.getElementsByClassName('filter');
    this.router.navigate(['orders'], { queryParams: { receiverName: filter[0].value, phoneNumber: filter[1].value, from: filter[2].value, to: filter[3].value } })
    
  }
}