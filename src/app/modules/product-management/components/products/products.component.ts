import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router, ActivatedRoute } from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any = [];
  categoryId: any = "";
  categories: any = [];
  categoryWithProduct: any = {};
  hover: boolean = true;
  pages: any = [];
  totalPages: number = 0;
  filterObj: any = { pageSize: 10 };
  totalProducts: any = 0;
  page: any = 1;
  constructor(private apiCalls: ApiCallsService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.initial(params)
    });
  }

  async initial(params){
    await this.getCategoriesByStoreId();
    this.checkForParams(params);
  }

  async loadProducts() {
    const products: any = await this.apiCalls.getProducts(0, this.categoryId);
    console.log(products)
    this.totalPages = products.data.totalPages;
    this.setPagination(products.data.totalPages, 1)
    this.products = products.data.content;

    window.scroll(0, 0)
    window.scroll(0, 0)

  }






  editProduct(id) {
    this.router.navigateByUrl("products/" + id)
  }

  async getCategoriesByStoreId() {
    this.categories = [];
    var i = 0;
    while (true) {
      var data: any = await this.apiCalls.getStoreCategories(i);
      if (data.data.content.length < 1) {
        break;
      }
      this.categories = this.categories.concat(data.data.content)
      i = i + 1;
    }
    this.setCatogoriesForSingleProduct();
  }
  getProdsByCat(id) {
    this.setAllFieldsToEmpty();
    this.categoryId = id;
    if (id) {
      this.router.navigate(['products'], { queryParams: { categoryId: id } })
    } else {
      this.router.navigate(['products'])
    }
    this.loadProducts();
  }

  setCatogoriesForSingleProduct() {
    for (var i = 0; i < this.categories.length; i++) {
      this.categoryWithProduct[this.categories[i].id] = this.categories[i].name;
    }
  }

  copyProductUrl(url) {
    var textArea = document.createElement("textarea");
    textArea.value = url;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    this.hover = false;
    var successful = document.execCommand('copy');

  }

  mouseOverCopy() {
    this.hover = true;
  }

  shareProduct() {

  }

  externalLink(productDescLink) {
    window.open(`${productDescLink}`, "_blank");
  }

  async deleteProduct(id) {
    await this.apiCalls.deleteProduct(id)
    this.apiCalls.successPopUp("Product Deleted Successfully")
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/products']);
    });
  }



  /**
   * This function fetches next 10 products to show
   * basically it helps pagination
   */
  async openPage(page) {
    this.page = page;
    const obj: any = this.filterObj;
    obj.page = page - 1;
    this.products = await this.apiCalls.getFilteredProducts(obj);
    this.totalProducts = this.products.data.totalElements;
    this.markSelectedPage(page)
    this.products = this.products.data.content;
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
    if (this.pages[page - 1]) {
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
      this.displayProductsWithoutAnyFilter();
    }
  }

  displayProductsWithoutAnyFilter() {
    this.loadProducts();
  }


  urlContainsSearchParams(params) {
    if ('productName' in params && 'categoryId' in params) {
      return true;
    } else {
      return false;
    }
  }

  populateSearchFields(params) {
    const filter: any = document.getElementsByClassName('filter3');
    filter[0].value = params['productName'];
    filter[1].value = params['categoryId'];
    $('#cat-prod').val(params['categoryId']);
    this.filterProducts();
  }

  async filterProducts() {
    const params: any = this.composeFilterObject(this.getAllFilters())
    const data: any = await this.apiCalls.getFilteredProducts(params);
    console.log(data)
    this.totalPages = data.data.totalPages;
    this.setPagination(data.data.totalPages, 1)
    this.totalProducts = data.data.totalElements;
    this.products = data.data.content;
  }


  composeFilterObject(filterValues) {
    const obj = {
      name: filterValues[0],
      categoryId: filterValues[1],
      pageSize: 10
    }

    this.filterObj = obj;
    return obj;
  }
  getAllFilters() {
    const filter: any = document.getElementsByClassName('filter3');
    var filterValues = new Array(4).fill('');
    for (var i = 0; i < filter.length; i++) {
      filterValues[i] = filter[i].value;
    }
    return filterValues;
  }

  searchOrders() {
    const filter: any = document.getElementsByClassName('filter3');
    this.router.navigate(['products'], { queryParams: { productName: filter[0].value, categoryId: filter[1].value } })
  }


  setAllFieldsToEmpty() {
    const filters: any = document.getElementsByClassName('filter3');
    filters[0].value = "";
  }
}
