import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any = [];
  allProducts: any = [];
  page: any = 0;
  categoryId:any;
  categories:any=[];
  constructor(private apiCalls: ApiCallsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params["categoryId"]) {
        this.categoryId = params["categoryId"];
      } 
    });
    this.getCategoriesByStoreId();
    window.scroll(0, 0)
    this.loadProducts();
    this.getAllProducts();
  }


  async loadProducts() {
    const products: any = await this.apiCalls.getProducts(0,this.categoryId);
    this.showThumbnailImage(products.data.content);
    window.scroll(0, 0)
    window.scroll(0, 0)

  }

  async nextPage() {
    const products: any = await this.apiCalls.getProducts(this.page + 1,this.categoryId);
    if (products.data.content.length > 0) {
      this.page++;
      this.products = products.data.content;
      window.scroll(0, 0)
    }

  }

  async previousPage() {
    this.page--;
    if (this.page < 0) {
      this.page = 0;
    }
    this.products = await this.apiCalls.getProducts(this.page,this.categoryId);
    this.products = this.products.data.content
    window.scroll(0, 0)
    window.scroll(0, 0)
  }


  filterProducts(event) {
    const filter = event.target.value;
    this.products = this.allProducts.filter(word => word.name.toLowerCase().includes(filter.toLowerCase()));
  }

  async getAllProducts() {
    var i = 0;
    while (true) {
      const products: any = await this.apiCalls.getProducts(i,this.categoryId);
      if (products.data.content.length < 1) {
        break;
      }
      this.allProducts = this.allProducts.concat(products.data.content)
      i = i + 1;
    }
  }

  showThumbnailImage(products) {
    products.forEach((product, index) => {
      if (product.productAssets.length > 0) {
        products[index].productThumbnailUrl = product.productAssets[0].url;
      }
      product.productAssets.forEach(image => {
        if (image.itemCode == null) {
          products[index].productThumbnailUrl = image.url;
        }
      });
    });
    this.products = products;
    console.log(this.products)
  }

  editProduct(id) {
    this.router.navigateByUrl("products/" + id)
  }

  async getCategoriesByStoreId() {
    this.categories=[];
    var i = 0;
    while (true) {
      var data: any = await this.apiCalls.getStoreCategories(i);
      if (data.data.content.length < 1) {
        break;
      }
      this.categories = this.categories.concat(data.data.content)
      i = i + 1;
    }
  }
  getProdsByCat(id){
    this.categoryId=id;
    this.router.navigate(['products'], { queryParams: { categoryId: id}})
    this.loadProducts();
  }
}
