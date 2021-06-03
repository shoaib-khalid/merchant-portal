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
  allCustomers: any = [];
  page: any = 0;
  constructor(private apiCalls: ApiCallsService, private router: Router) { }

  ngOnInit(): void {
    this.loadCustomers()
  }

  async loadCustomers() {
    const data: any = await this.apiCalls.getCustomers()
    this.customers = data.data.content;
    this.allCustomers = data.data.content;
    console.log(data)
  }

  async nextPage() {
    const customers: any = await this.apiCalls.getCustomers(this.page + 1);
    if (customers.data.content.length > 0) {
      this.page++;
      this.customers = customers.data.content;
      window.scroll(0, 0)
    }
  }

  async previousPage() {
    this.page--;
    if (this.page < 0) {
      this.page = 0;
      return
    }
    this.customers = await this.apiCalls.getCustomers(this.page);
    this.customers = this.customers.data.content
    window.scroll(0, 0)
    window.scroll(0, 0)
  }

  filterCustomers(event) {
    const filter = event.target.value;
    this.customers = this.allCustomers.filter(word => word.name.toLowerCase().includes(filter.toLowerCase()));
    if (this.customers.length < 1) {
      this.customers = this.allCustomers.filter(word => word.email.toLowerCase().includes(filter.toLowerCase()));
    }
  }

  openOrdersPage(customerId) {
    this.router.navigate(['orders'], { queryParams: { customerId: customerId } })
  }

}
