import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any = [];
  page: any = 0;
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.loadProducts();
  }


  async loadProducts() {
    this.products = await this.apiCalls.getProducts();
    this.products = this.products.data.content
  }

  async nextPage() {
    this.page++;
    this.products = await this.apiCalls.getProducts(this.page);
    this.products = this.products.data.content
    window.scroll(0, 0)
  }

  async previousPage() {
    this.page--;
    if (this.page < 0) {
      this.page = 0;
    }
    this.products = await this.apiCalls.getProducts(this.page);
    this.products = this.products.data.content
    window.scroll(0, 0)

  }

}
