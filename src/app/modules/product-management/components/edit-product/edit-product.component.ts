import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import $ from 'jquery';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productStatus: any = "";
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
  images: any = [];
  addProductLoading: boolean = false;
  thumbnailImage: any;
  defaultInventoryImage: any = "";
  thumbnail: any;
  defaultInventoryPreview: any;
  product: any;


  constructor(private route: ActivatedRoute, private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.getCategoriesByStoreId();
    this.route.params.subscribe(params => {
      if (params.id) {
        this.loadProduct(params.id)
      }
    });
  }

  async loadProduct(id) {
    const data: any = await this.apiCalls.getStoreProductById(id);
    this.product = data.data;
    this.setAllVariables()
  }

  setAllVariables() {
    console.log(this.product)
    this.title = this.product.name;
    this.description = this.product.description;
    this.productStatus = this.product.status;
    this.setCategory();
    this.setThumbnailPreview();
    this.setDefaultInventoryPreview();
    this.setVariants();
    this.getallCombinations(this.items)
    this.setProductAssets();
    this.setInventory();
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

  setCategory() {
    this.categories.forEach(element => {
      if (element.id == this.product.categoryId) {
        this.category = element.name;
      }
    });
  }

  setThumbnailPreview() {
    this.product.productAssets.forEach(element => {
      if (element.itemCode == null) {
        this.thumbnail = { id: element.id, preview: element.url };
      }
    });
  }

  setDefaultInventoryPreview() {
    this.product.productAssets.forEach(element => {
      if (element.itemCode == null) {
        this.defaultInventoryPreview = { id: element.id, preview: element.url }
      }
    });
  }

  setVariants() {

    if (this.product.productVariants.length > 0) {
      this.variantChecked = true;
    }
    this.product.productVariants.forEach((element, index) => {
      this.options.push({ name: element.name, id: element.id })
      this.items.push([])
      element.productVariantsAvailable.forEach(pva => {
        this.items[index].push(pva.value)
      });
    });

  }


  setProductAssets() {
    this.product.productAssets.forEach(element => {
      if (element.itemCode) {
        this.images[parseInt(element.itemCode.slice(-1))].push({ preview: element.url, id: element.id })
      }
    });
  }

  getallCombinations(combos, result = "", n = 0) {
    var out = "";
    if (n == combos.length) {
      if (result.substring(1) != "") {
        this.combos.push({ variant: result.substring(1), price: this.price, quantity: 0, sku: 0 })
        this.images.push([])
      }
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

  setInventory() {
    this.product.productInventories.forEach((element) => {
      if (element.itemCode.slice(-1) != "a") {
        const index = parseInt(element.itemCode.slice(-1));
        this.combos[index].price = element.price;
        this.combos[index].sku = element.sku;
        this.combos[index].quantity = element.quantity;
      }
    });
  }

  onThumbnailChanged($event, i) {

  }
  onInventoryImageChanged($event, i) {

  }

  variantChanged(event) {

  }

  deletethumbnailImage(thumbnailId) {
    this.thumbnailImage = "";
    this.thumbnail = "";
    this.apiCalls.deleteProductAsset(this.product.id, thumbnailId)
  }

  deleteDefaultInventoryImage(inventoryImgId) {
    this.defaultInventoryPreview = "";
    this.apiCalls.deleteProductAsset(this.product.id, inventoryImgId)
  }

  updateProduct() {
    console.log(this.getCategoryId())
    const body = {
      "categoryId": this.getCategoryId(),
      "name": this.title,
      "status": this.productStatus,
      "stock": 0,
      "description": this.description,
      "storeId": localStorage.getItem("storeId")
    }
    this.apiCalls.updateProduct(body, this.product.id)
  }

  addAnotherOption() {
    if (this.items.length == this.options.length) {
      this.options.push({ name: "" })
    }
  }

  deleteVariantImage(i, j, variantImgId) {
    this.apiCalls.deleteProductAsset(this.product.id, variantImgId)
    this.images[i].splice(j, 1);
  }

  deleteVariant(i, variantId) {
    this.items.splice(i, 1)
    this.options.splice(i, 1);
    this.apiCalls.deleteVariant(this.product.id, variantId)
  }

  getCategoryId() {
    const name = $('#categories').val();
    var id = $('#categories-data-list option[value="' + name + '"]').attr('id');
    return id;

  }

}
