import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any = [];

  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.loadProducts();
  }


  async loadProducts(){
    this.products = await this.apiCalls.getProducts();
    this.products = this.products.data.content
  }

}
