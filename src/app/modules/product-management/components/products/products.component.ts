import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any = [];
  allProducts: any = [];
  page: any = 0;
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.getAllProducts();
  }


  async loadProducts() {
    this.products = await this.apiCalls.getProducts();
    this.products = this.products.data.content
    console.log(this.products)
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


  filterProducts(event) {
    const filter = event.target.value;
    this.products = this.allProducts.filter(word => word.name.toLowerCase().includes(filter.toLowerCase()));
  }

  async getAllProducts() {
    var i = 0;
    while (true) {
      const products: any = await this.apiCalls.getProducts(i);
      if (products.data.content.length < 1) {
        break;
      }
      this.allProducts = this.allProducts.concat(products.data.content)
      i = i + 1;
    }
  }

}
