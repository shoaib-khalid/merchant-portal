import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: any = [];
  page: any = 1;
  pages: any = [];
  totalPages: number = 0;
  filterObj: any = { pageSize: 10 };
  totalCustomers: any = 0;

  constructor(private apiCalls: ApiCallsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.checkForParams(params);
    });
  }

  async loadCustomers() {
    const data: any = await this.apiCalls.getCustomers()
    this.totalCustomers = data.data.totalElements;
    this.totalPages = data.data.totalPages;
    this.setPagination(data.data.totalPages, 1)
    this.customers = data.data.content;
    console.log(data)
  }

  openOrdersPage(customerName) {
    this.router.navigate(['orders'],{ queryParams: { receiverName: customerName, phoneNumber: "", from: "", to: "" } })
  }

  searchOrders() {
    const filter: any = document.getElementsByClassName('filter1');
    this.router.navigate(['customers'], { queryParams: { username: filter[0].value}})
    
  }

  /**
 * This function fetches next 10 orders to show
 * basically it helps pagination
 */
  async openPage(page) {
    this.page = page;
    const obj: any = this.filterObj;
    obj.page = page - 1;
    this.customers = await this.apiCalls.getFilteredCustomers(obj);
    this.totalCustomers = this.customers.data.totalElements;
    this.markSelectedPage(page)
    this.customers = this.customers.data.content;
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

  checkForParams(params) {
    if (this.urlContainsSearchParams(params)) {
      this.populateSearchFields(params);
    }
    else {
      this.loadCustomers()

    }
  }


  populateSearchFields(params) {
    const filter: any = document.getElementsByClassName('filter1');
    filter[0].value = params['username'];
    this.filterCustomers();
  }

  urlContainsSearchParams(params) {
    if ('username' in params) {
      return true;
    } else {
      return false;
    }
  }


  async filterCustomers() {
    const params: any = this.composeFilterObject(this.getAllFilters())
    const data: any = await this.apiCalls.getFilteredCustomers(params);
    this.totalPages = data.data.totalPages;
    this.setPagination(data.data.totalPages, 1)
    this.totalCustomers = data.data.totalElements;
    this.customers = data.data.content;
  }

  composeFilterObject(filterValues) {
    const obj = {
      username: filterValues[0],
      pageSize: 10
    }

    this.filterObj = obj;
    return obj;
  }
  getAllFilters() {
    const filter: any = document.getElementsByClassName('filter1');
    var filterValues = new Array(11).fill('');
    for (var i = 0; i < filter.length; i++) {
      filterValues[i] = filter[i].value;
    }
    return filterValues;
  }

  previousPage(){
    if(this.page-1<this.totalPages && this.page-1>0){
      this.openPage(this.page-1)
      this.markSelectedPage(this.page)
    }
  }
  nextPage(){
    if(this.page+1<=this.totalPages){
      this.openPage(this.page+1)
      this.markSelectedPage(this.page)
    }
  }
}
