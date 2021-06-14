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
  page: any = 0;
  categoryId: any = "";
  categories: any = [];
  categoryWithProduct: any = {};
  hover: boolean = true;
  pages: any = [];
  totalPages: number = 0;
  constructor(private apiCalls: ApiCallsService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params["categoryId"]) {
        this.categoryId = params["categoryId"];
      }
    });
    this.getCategoriesByStoreId();
    window.scroll(0, 0)
    this.loadProducts();
  }


  async loadProducts() {
    const products: any = await this.apiCalls.getProducts(0, this.categoryId);
    console.log(products)
    this.totalPages=products.data.totalPages;
    this.showThumbnailImage(products.data.content);
    this.setPagination(products.data.totalPages, 1)
    window.scroll(0, 0)
    window.scroll(0, 0)

  }




  showThumbnailImage(products) {
    products.forEach((product, index) => {
      if (product.thumbnailUrl) {
        products[index].productThumbnailUrl = product.thumbnailUrl;
      } else {
        product.productAssets.forEach(image => {
          if (image.isThumbnail) {
            products[index].productThumbnailUrl = image.url;
            return;
          }
        });
      }
    });
    this.products = products;
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

  showDropdown(id) {
    var dropdowns: any = document.getElementsByClassName('dropdown-content');
    for (var i = 0; i < dropdowns.length; i++) {
      if (window.getComputedStyle(dropdowns[i], null).display == "block") {
        dropdowns[i].classList.toggle("show");
      }
    }
    document.getElementById("" + id).classList.toggle("show");
  }


  /**
   * This function fetches next 10 products to show
   * basically it helps pagination
   */
   async openPage(page) {
    const products:any = await this.apiCalls.getProducts(page - 1,null);
    this.markSelectedPage(page)
    this.showThumbnailImage(products.data.content)
    console.log(this.products)
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
    this.pages[page - 1].isActive = "active";
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
      if(this.totalPages<5){
      return [1, this.totalPages];
      }else{
        return [1,5]
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
