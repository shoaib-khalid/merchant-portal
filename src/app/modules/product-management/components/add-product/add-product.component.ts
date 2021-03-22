import { Component, OnInit } from '@angular/core';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
import $ from "jquery";


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
  categories: any = [];
  category: any;


  constructor(private helperTextService: HelperTextService, private apiCalls: ApiCallsService, private router: Router) { }

  ngOnInit(): void {
    this.countries = this.helperTextService.countriesList;
    this.getCategoriesByStoreId();
  }

  addAnotherOption() {
    this.options.push({ name: "" })
  }

  variantChanged(event) {
    if (event.target.checked) {
      this.options.push({ name: "" })
    } else {
      this.options = [];
    }
  }

  variantsChanged(i) {

    this.combos = [];
    this.getallCombinations(this.items)

  }

  variantNameChanged(event, i) {
    this.options[i].name = event.target.value;
  }


  getallCombinations(combos, result = "", n = 0) {

    var out = "";

    if (n == combos.length) {
      this.combos.push({ variant: result.substring(1), price: 0, quantity: 0, sku: 0 })
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

    if (this.title && this.compareAtPrice && this.price && this.quantity && this.sku && this.productStatus != "status" && this.category) {

      const categoryId = await this.getCategoryId()
      const body = {
        "categoryId": categoryId,
        "name": this.title,
        "status": this.productStatus,
        "stock": 0,
        "description": this.description,
        "storeId": localStorage.getItem("storeId")

      }

      const data: any = await this.apiCalls.addProduct(body);
      await this.addInventory(data.data.id)

      if (this.options.length > 0) {
        const variantIds: any = await this.addVariantName(data.data.id);
        const productAvailableIds = await this.addVariantValues(data.data.id, variantIds);
        this.addInventoryItem(data.data.id, productAvailableIds)
      }
      console.log("product Id:" + data.data.id)
      this.router.navigateByUrl("/products")

    } else {
      window.scroll(0, 0)
      this.requiredError = true;
    }
  }


  checkProductVariantNames() {
    try {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].name == "" || this.items[i].length < 1) {
          return false;
        }
      }
      return true;
    } catch (ex) {
      return false;
    }
  }

  async addVariantName(productId) {
    var variantIds = [];
    for (var i = 0; i < this.options.length; i++) {
      var data: any = await this.apiCalls.addVariant(productId, { name: this.options[i].name })
      variantIds.push(data.data.id)
    }
    return variantIds;
  }

  async addVariantValues(productId, variantIds) {
    var productVariantAvailableIds = [];
    for (var i = 0; i < this.options.length; i++) {
      const values = (String(this.items[i])).split(",");
      for (var j = 0; j < values.length; j++) {
        var data: any = await this.apiCalls.addVariantValues(productId, { productVariantId: variantIds[i], value: values[j] })
        productVariantAvailableIds.push({ productVariantAvailableId: data.data.id, value: data.data.value })
      }
    }
    return productVariantAvailableIds;
  }

  async addInventory(productId) {

    if (this.combos.length > 0) {


      for (var i = 0; i < this.combos.length; i++) {
        const combosSplitted = this.combos[i].variant.split("/");
        const itemCode = productId + i
        const data: any = await this.apiCalls.addInventory(productId, {
          itemCode: itemCode,
          price: this.combos[i].price,
          compareAtPrice: 0,
          quantity: this.combos[i].quantity,
          sku: this.combos[i].sku
        })

      }
    } else {
      const data: any = await this.apiCalls.addInventory(productId, {
        itemCode: productId + "aa",
        price: this.price,
        compareAtPrice: this.compareAtPrice,
        quantity: this.quantity,
        sku: this.sku
      })
    }
  }

  async addInventoryItem(productId, productVariantAvailableIds) {
    for (var i = 0; i < this.combos.length; i++) {
      const combosSplitted = this.combos[i].variant.split("/");
      for (var j = 0; j < combosSplitted.length; j++) {
        const test = this.apiCalls.addInventoryItem(productId, {
          itemCode: productId + i,
          productVariantAvailableId: productVariantAvailableIds[j].productVariantAvailableId,
          productId: productId
        })
      }
    }
  }

  priceChanged(event, i) {
    this.combos[i].price = event.target.value;
  }
  skuChanged(event, i) {
    this.combos[i].sku = event.target.value;

  }
  quantityChanged(event, i) {
    this.combos[i].quantity = event.target.value;

  }

  async getCategoriesByStoreId() {

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

  async getCategoryId() {
    const name = $('#categories').val();
    var id = $('#categories-data-list option[value="' + name + '"]').attr('id');
    if (id) {
      return id;
    }
    id = await this.createNewCategory(name)
    return id;

  }

  createNewCategory(name) {
    const body = {
      "name": name,
      "storeId": localStorage.getItem("storeId"),
    }
    var promise = new Promise(async (resolve, reject) => {
      const data: any = await this.apiCalls.createCategory(body);
      resolve(data.data.id);
    });
    return promise;
  }

}
