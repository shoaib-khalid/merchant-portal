import { Component, OnInit } from '@angular/core';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
import { ApiCallsService } from 'src/app/services/api-calls.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  productStatus: any = "status";
  title: string;
  description: string;
  price: any;
  compareAtPrice: string;
  costPerItem: any;
  chargeTax: boolean;
  inventoryMngdBy: any;
  sku: any;
  barcode: any;
  trackQuantity: any;
  continueSelling: any;
  quantity: any;
  physicalProduct: any;
  weight: any;
  weightType: any;
  country: any;
  hsCode: any;
  items: any = [];
  countries: any = [];
  variantChecked: boolean = false;
  options: any = []
  combos: any = [];
  requiredError: boolean = false;



  constructor(private helperTextService: HelperTextService, private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.countries = this.helperTextService.countriesList;

  }

  addAnotherOption() {
    this.options.push("")
  }

  variantChanged(event) {
    if (event.target.checked) {
      this.options.push("")
    } else {
      this.options = [];
    }
  }

  variantsChanged(i) {

    this.combos = [];
    this.getallCombinations(this.items)

  }

  variantNameChanged(event, i) {
    this.options[i] = event.target.value;
  }


  getallCombinations(combos, result = "", n = 0) {

    var out = "";

    if (n == combos.length) {
      this.combos.push(result.substring(1))
      return result.substring(1);
    }

    for (var i = 0; i < combos[n].length; i++) {
      if (result != "") {
        out = result + " / " + combos[n][i];
      }
      else {
        out = result + " " + combos[n][i];

      }
      this.getallCombinations(combos, out, n + 1)
    }

  }

  async saveProduct() {

    if (this.title && this.compareAtPrice && this.price && this.quantity && this.sku && this.productStatus != "status"
      && this.checkProductVariantNames) {

      const body = {
        "categoryId": 2,
        "name": this.title,
        "status": this.productStatus,
        "stock": 0,
        "storeId": localStorage.getItem("storeId")
      }
      if (this.options.length > 0) {
        const data: any = await this.apiCalls.addProduct(body);
        this.addVariantName(data.data.id);
      }
    } else {
      window.scroll(0, 0)
      this.requiredError = true;
    }



  }

  checkProductVariantNames() {
    try {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i] == "" || this.items[i].length < 1) {
          return false;
        }
      }
      return true;
    } catch (ex) {
      return false;
    }
  }

  addVariantName(productId) {
    for (var i = 0; i < this.options.length; i++) {
      this.apiCalls.addVariant(productId, { name: this.options[i] })
    }
  }

}
