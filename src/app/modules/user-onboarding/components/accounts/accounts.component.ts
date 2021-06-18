import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts: any = [];
  page: any = 1;
  pages: any = [];
  totalPages: number = 0;
  filterObj: any = { pageSize: 10 };
  totalAccounts: any = 0;
  constructor(private apiCalls: ApiCallsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.checkForParams(params);
    });

  }

  async loadAccounts() {
    const data1 :any= await this.apiCalls.getClients();
    this.totalAccounts = data1.data.totalElements;
    this.totalPages = data1.data.totalPages;
    this.setPagination(data1.data.totalPages, 1)
    this.accounts = data1.data.content;
    console.log(this.accounts)
  }
  createAccount() {

  }
  previousPage() {

  }
  nextPage() {

  }
  edit(id) {
    console.log(id)
    this.router.navigateByUrl('agent-accounts/' + id)
  }

  checkForParams(params) {
    if (this.urlContainsSearchParams(params)) {
      this.populateSearchFields(params);
    }
    else {
    this.loadAccounts();

    }
  }
  populateSearchFields(params) {
    const filter: any = document.getElementsByClassName('filter2');
    filter[0].value=params['username'];
    this.filterAccounts();
  }
  urlContainsSearchParams(params) {
    if ('username' in params) {
      return true;
    } else {
      return false;
    }
  }

  async filterAccounts() {
    const params: any = this.composeFilterObject(this.getAllFilters())
    const data: any = await this.apiCalls.getFilteredAccounts(params);
    this.totalPages = data.data.totalPages;
    this.setPagination(data.data.totalPages, 1)
    this.totalAccounts = data.data.totalElements;
    this.accounts = data.data.content;
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
    const filter: any = document.getElementsByClassName('filter2');
    var filterValues = new Array(11).fill('');
    for (var i = 0; i < filter.length; i++) {
      filterValues[i] = filter[i].value;
    }
    return filterValues;
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

  searchOrders(){
    const filter: any = document.getElementsByClassName('filter2');
    this.router.navigate(['agent-accounts'], { queryParams: { username: filter[0].value} })
  }

  
  setPages(n) {
    const mod = 5 % n;
    if (n > 5) {
      return mod;
    } else {
      return n;
    }
  }
  async openPage(page) {
    this.page=page;
    const obj: any = this.filterObj;
    obj.page = page - 1;
    this.accounts = await this.apiCalls.getFilteredAccounts(obj);
    this.totalAccounts = this.accounts.data.totalElements;
    this.markSelectedPage(page)
    this.accounts = this.accounts.data.content;
    this.removeClassIfExist()
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
  removeClassIfExist() {
    const eles = document.getElementsByClassName('pagination');
    for (var i = 0; i < eles.length; i++) {
      if (eles[i].classList.contains('active')) {
        eles[i].classList.remove("active")
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
}
