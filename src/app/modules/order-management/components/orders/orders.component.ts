import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderFilter } from './order-filter.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any = [];
  pages: any = [];
  totalPages: number = 0;
  filterObj: any = { pageSize: 10 };
  totalOrders: any = 0;
  page: any = 1;
  storePickup: false;
  selectedIndex: any = "0";

  orderFilter = new OrderFilter('', '', '', '', 'PAID', '');

  constructor(private apiCalls: ApiCallsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.populateSearchFields(params);
    });
    this.toggleStorePickup();
  }

  showOrderItems(order) {
    this.router.navigate(['orders/order-details'], { queryParams: { orderId: order.id } })
  }

  /**
   * This function fetches next 10 orders to show
   * basically it helps pagination
   */
  async openPage(page) {
    this.page = page;
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
    const params: any = this.composeFilterObject()
    const data: any = await this.apiCalls.getFilteredOrders(params);
    this.totalPages = data.data.totalPages;
    this.setPagination(data.data.totalPages, 1)
    this.totalOrders = data.data.totalElements;
    this.orders = data.data.content;
    this.changeUTCToLocalTimeZone();
  }

  composeFilterObject() {
    const { receiverName, phoneNumber, from, to, completionStatus } = this.orderFilter;
    const obj = {
      receiverName: receiverName, phoneNumber: phoneNumber, from: from, to: to, completionStatus: completionStatus,
      pageSize: 10
    }
    this.filterObj = obj;
    return obj;
  }

  setTodaysDate() {
    const date = new Date().toISOString().split('T')[0];
    this.orderFilter.from = date;
    this.orderFilter.to = date;
  }

  populateSearchFields(params) {
    this.orderFilter.receiverName = params['receiverName'] || '';
    this.orderFilter.phoneNumber = params['phoneNumber'] || '';
    this.orderFilter.from = params['from'] || '';
    this.orderFilter.to = params['to'] || '';
    this.orderFilter.completionStatus = params['completionStatus'] || '';
    this.tabChangeUsingCompletionStatus();
  }

  searchOrders() {
    this.page = 1;
    this.router.navigate(['orders'],
      {
        queryParams:
        {
          receiverName: this.orderFilter.receiverName,
          phoneNumber: this.orderFilter.phoneNumber,
          from: this.orderFilter.from,
          to: this.orderFilter.to,
          completionStatus: this.orderFilter.completionStatus
        }
      })
  }

  previousPage() {
    if (this.page - 1 < this.totalPages && this.page - 1 > 0) {
      this.openPage(this.page - 1)
      this.markSelectedPage(this.page)
    }
  }
  nextPage() {
    if (this.page + 1 <= this.totalPages) {
      this.openPage(this.page + 1)
      this.markSelectedPage(this.page)
    }
  }

  /**
   * This function will show store pickup column
   * based on whether it is set in store page 
   */
  async toggleStorePickup() {
    var data: any = await this.apiCalls.getDeliveryDetailsStore(localStorage.getItem('storeId'));
    this.storePickup = data.data.allowsStorePickup;
  }

  /**
   * Database returns UTC time,
   * we convert it to time where store was created
   */
  async changeUTCToLocalTimeZone() {
    const store = await this.apiCalls.getStoreDetails(localStorage.getItem('storeId'));
    var timezone = "";
    var regions: any = await this.apiCalls.getStoreRegions();
    regions = regions.data.content;
    for (var j = 0; j < regions.length; j++) {
      if (regions[j].id == store.data.regionCountryId) {
        timezone = regions[j].timezone;
      }
    }
    const data = this.orders;
    for (var i = 0; i < data.length; i++) {
      data[i].created = new Date(data[i].created + " UTC").toLocaleString('en-US', { timeZone: timezone });
    }
  }

  tabChange(event) {
    this.setDateToEmpty(event.index);
    switch (event.index) {
      case 0:
        this.orderFilter.completionStatus = 'PAYMENT_CONFIRMED';
        break;
      case 1:
        this.orderFilter.completionStatus = 'BEING_PREPARED';
        break;
      case 2:
        this.orderFilter.completionStatus = 'AWAITING_PICKUP';
        break;
      case 3:
        this.orderFilter.completionStatus = 'BEING_DELIVERED';
        break;
      case 4:
        this.orderFilter.completionStatus = 'DELIVERED_TO_CUSTOMER';
        break;
      case 5:
        this.orderFilter.completionStatus = '';
        break;
      default:
        break;
    }
    this.searchOrders();
  }

  /**
   * This function will show tab based
   * on completion Status
   */
  tabChangeUsingCompletionStatus() {
    switch (this.orderFilter.completionStatus) {
      case 'PAYMENT_CONFIRMED':
        this.selectedIndex = 0;
        break;
      case 'BEING_PREPARED':
        this.selectedIndex = 1;
        break;
      case 'AWAITING_PICKUP':
        this.selectedIndex = 2;
        break;
      case 'BEING_DELIVERED':
        this.selectedIndex = 3;
        break;
      case 'DELIVERED_TO_CUSTOMER':
        this.selectedIndex = 4;
        break;
      case '':
        this.selectedIndex = 5;
        break;
      default:
        this.selectedIndex = 0;
        break;
    }
    this.filterOrders();
  }

  setDateToEmpty(index) {
    if (index == 5) {
      this.orderFilter.from = '';
      this.orderFilter.to = '';
      return;
    }
    this.setTodaysDate();
  }
}