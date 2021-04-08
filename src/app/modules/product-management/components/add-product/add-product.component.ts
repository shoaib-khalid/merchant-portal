import { Component, OnChanges, OnInit } from '@angular/core';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
import $ from "jquery";
import { SuccessAnimationComponent } from 'src/app/modules/home/components/success-animation/success-animation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

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
  thumbnailImage: any;
  thumbnailPreview: any;
  productImages:any=[];


  constructor(private dialog: MatDialog, private helperTextService: HelperTextService, private apiCalls: ApiCallsService, private router: Router) { }

  ngOnInit(): void {
    this.countries = this.helperTextService.countriesList;
    this.getCategoriesByStoreId();
  }

  addAnotherOption() {
    if (this.items.length == this.options.length) {
      this.options.push({ name: "" })
    }
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
      if (result.substring(1) != "") {
        this.combos.push({ variant: result.substring(1), price: this.price, quantity: 0, sku: 0 })
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

  async saveProduct() {

    if (this.title && this.price && this.quantity && this.sku && this.productStatus && this.category) {
      this.apiCalls.loadingAnimation("Adding Product")
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
        await this.addInventoryItem(data.data.id, productAvailableIds)
      }
      console.log("product Id: " + data.data.id)
      console.log("store Id: " + localStorage.getItem("storeId"))

      this.apiCalls.loadingdialogRef.close();
      await this.showVerifyIcon();
      this.router.navigateByUrl("/products")

    } else {

      this.highlightEmptyFields();
      this.requiredError = true;
      window.scroll(0, 0)
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
      var data: any = await this.apiCalls.addVariant(productId, { name: this.options[i].name, sequenceNumber: i })
      variantIds.push(data.data.id)
    }
    return variantIds;
  }

  async addVariantValues(productId, variantIds) {
    var productVariantAvailableIds = [];
    for (var i = 0; i < this.options.length; i++) {
      productVariantAvailableIds.push([]);
      const values = (String(this.items[i])).split(",");
      for (var j = 0; j < values.length; j++) {
        var data: any = await this.apiCalls.addVariantValues(productId, { productVariantId: variantIds[i], value: values[j], sequenceNumber: j })
        productVariantAvailableIds.push({ productVariantAvailableId: data.data.id, value: data.data.value })
      }
    }
    return productVariantAvailableIds;
  }

  async addInventory(productId) {
    if (this.combos.length > 0) {
      for (var i = 0; i < this.combos.length; i++) {
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



    if (this.thumbnailImage) {
      const data1 = await this.apiCalls.uploadImage(productId, this.thumbnailImage, "")
    }
  }

  async addInventoryItem(productId, productVariantAvailableIds) {

    for (var i = 0; i < this.combos.length; i++) {
      const combosSplitted = this.combos[i].variant.split("/");
      for (var j = 0; j < combosSplitted.length; j++) {
        const productAvailableId = await this.getVariantAvailableByValue(combosSplitted[j], productVariantAvailableIds)
        const test = await this.apiCalls.addInventoryItem(productId, {
          itemCode: productId + i,
          productVariantAvailableId: productAvailableId,
          productId: productId
        })
      }

      if (this.images[i]) {
        for (var j = 0; j < this.images[i].length; j++) {
          if (this.images[i][j]) {
            const formdata = new FormData();
            formdata.append("file", this.images[i][j].file);
            const data = await this.apiCalls.uploadImage(productId, formdata, productId + i)
          }
        }
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


  highlightEmptyFields() {
    var arr: any = document.getElementsByClassName('form-control');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value == "") {
        $(arr[i]).val('').css("border-color", "red");
      } else {
        $(arr[i]).css("border-color", "");
      }
    }
  }

  async onFileChanged(event, i) {
    if (this.images[i]) {

    } else {
      this.images[i] = [];
    }
    const files = event.target.files;
    for (var j = 0; j < files.length; j++) {
      const file = files[j];
      this.images[i].push({ file: file, preview: await this.previewImage(file) });
    }
  }

  previewImage(file) {
    var promise = new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        resolve(reader.result)
      }
    });
    return promise;
  }

  async onThumbnailChanged(event, i) {
    const file = event.target.files[0];
    const formdata = new FormData();
    formdata.append("file", file);
    this.thumbnailImage = formdata;
    this.thumbnailPreview = await this.previewImage(file);
    this.productImages.push({file:file,preview:await this.previewImage(file)})
  }


  showVerifyIcon() {
    var promise = new Promise(async (resolve, reject) => {
      const dialogRef = this.dialog.open(SuccessAnimationComponent, {
        width: '350px',
        height: '220px',
        data: { message: "Product Added successfully" }
      });
      setTimeout(() => {
        dialogRef.close();
        resolve(1)
      }, 1600)
    });
    return promise;
  }



  deleteVariant(i) {
    this.items.splice(i, 1)
    this.options.splice(i, 1);
    this.variantsChanged(0)
  }

  onRemove(item, i) {
    const index = this.items[i].indexOf(item)
    if (index != -1) {
      this.items[i].splice(index, 1);
    }
    if (this.items[i].length == 0) {
      this.items.splice(i, 1)
    }
    this.variantsChanged(0)
  }

  deleteVariantImage(i, j) {
    this.images[i].splice(j, 1);
  }

  deletethumbnailImage() {
    this.thumbnailImage = "";
    this.thumbnailPreview = "";
  }



  getVariantAvailableByValue(value, productAvailableIds) {
    var promise = new Promise(async (resolve, reject) => {
      for (var i = 0; i < productAvailableIds.length; i++) {
        if (productAvailableIds[i].value == value.trim()) {
          resolve(productAvailableIds[i].productVariantAvailableId);
          break;
        }
      }
    });
    return promise;
  }

}
