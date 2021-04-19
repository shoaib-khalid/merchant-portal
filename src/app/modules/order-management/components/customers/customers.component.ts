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
  page: any = 0;
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.loadCustomers()
  }

  async loadCustomers(){
    const data:any = await this.apiCalls.getCustomers()
    this.customers = data.data.content;
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
}
