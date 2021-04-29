import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import $ from 'jquery';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
  product: any;
  productImages: any = [];
  newItems: any = [];
  thumbnailUrl: any = null;
  public Editor = ClassicEditor;


  constructor(private route: ActivatedRoute, private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.loadProduct(params.id)
      }
    });

  }

  async loadProduct(id) {
    await this.getCategoriesByStoreId();
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
    this.setVariants();
    this.getallCombinations(this.items)
    this.setProductAssets();
    this.setInventory();
  }

  async getCategoriesByStoreId() {
    var promise = new Promise(async (resolve, reject) => {
      var i = 0;
      while (true) {
        var data: any = await this.apiCalls.getStoreCategories(i);
        if (data.data.content.length < 1) {
          break;
        }
        this.categories = this.categories.concat(data.data.content)
        i = i + 1;
      }
      resolve("")
    });
    return promise;

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
        this.productImages.push({ id: element.id, preview: element.url })
      }
    });
  }



  setVariants() {
    if (this.product.productVariants.length > 0) {
      this.sortObjects(this.product.productVariants)
      this.variantChecked = true;
    }
    this.product.productVariants.forEach((element, index) => {
      this.sortObjects(element.productVariantsAvailable)
      this.options.push({ name: element.name, id: element.id })
      this.items.push({ values: [], ids: [] })
      element.productVariantsAvailable.forEach(pva => {
        this.items[index].values.push(pva.value)
        this.items[index].ids.push(pva.id)

      });
    });
    this.newItems = JSON.parse(JSON.stringify(this.items))
  }
  variantsChanged(i, data) {
    if (this.options[i].id) {
      this.apiCalls.addVariantValues(this.product.id, { productVariantId: this.options[i].id, value: data.value, sequenceNumber: this.items[i].values.length - 1 })
    }
    this.combos = [];
    this.getallCombinations(this.items)
  }

  variantAvailableRemoved(value, i) {

    var id = 0;
    if (this.newItems[i]) {
      for (var j = 0; j < this.newItems[i].values.length; j++) {
        if (this.newItems[i].values[j] == value) {
          id = this.items[i].ids[j];
          break;
        }
      }
      this.apiCalls.deleteVariantValue(this.product.id, id)
    }
    this.combos = [];
    this.getallCombinations(this.items)
  }

  variantNameChanged(event, i) {
    this.options[i].name = event.target.value;
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

    for (var i = 0; i < combos[n].values.length; i++) {
      if (result != "") {
        out = result + " / " + combos[n].values[i];
      }
      else {
        out = result + " " + combos[n].values[i];
      }
      this.getallCombinations(combos, out, n + 1)
    }
  }

  setInventory() {
    const productIdLength = this.product.id.length;
    this.product.productInventories.forEach((element) => {
      if (element.itemCode.slice(-1) != "a") {
        const index = parseInt(element.itemCode.substring(productIdLength));
        if (this.combos[index]) {
          this.combos[index].price = element.price;
          this.combos[index].sku = element.sku;
          this.combos[index].quantity = element.quantity;
        }

      }
    });
  }

  async onThumbnailChanged(event, i) {
    const files = event.target.files;
    for (var j = 0; j < files.length; j++) {
      const formdata = new FormData();
      formdata.append("file", files[j]);
      this.productImages.push({ file: formdata, preview: await this.previewImage(files[j]), new: true, isThumbnail: false })

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
  onInventoryImageChanged($event, i) {

  }

  variantChanged(event) {

  }

  deletethumbnailImage(prodId, i) {
    this.productImages.splice(i, 1)
    this.apiCalls.deleteProductAsset(this.product.id, prodId)
  }



  async updateProduct() {
    this.apiCalls.loadingAnimation('Updating..')
    await this.deleteEntireInventory();
    const body = {
      "categoryId": this.getCategoryId(),
      "name": this.title,
      "status": this.productStatus,
      "stock": 0,
      "description": this.description,
      "storeId": localStorage.getItem("storeId"),
      "thumbnailUrl": this.thumbnailUrl
    }
    console.log(body)
    await this.addInventory();
    this.apiCalls.updateProduct(body, this.product.id)
    this.uploadProductImages();
    const variantIds: any = await this.addVariantName();
    const productAvailableIds = await this.addVariantValues(variantIds);
    const allIds: any = await this.joinVariantAvailables(productAvailableIds)
    this.addInventoryItem(allIds);
    this.uploadVariantImages();
    this.apiCalls.loadingdialogRef.close();
  }

  addAnotherOption() {
    if (this.items.length == this.options.length) {
      this.options.push({ name: "", new: true })
      this.items.push({ values: [], ids: [] })
    }
  }
  async addVariantName() {

    var promise = new Promise(async (resolve, reject) => {

      var variantIds = [];
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].new) {
          var data: any = await this.apiCalls.addVariant(this.product.id, { name: this.options[i].name, sequenceNumber: i })
          variantIds.push(data.data.id)
        }
      }
      ;
      resolve(variantIds)
    });

    return promise;

  }


  async addInventory() {
    var promise = new Promise(async (resolve, reject) => {
      if (this.combos.length > 0) {
        for (var i = 0; i < this.combos.length; i++) {
          const itemCode = this.product.id + i

          const data: any = await this.apiCalls.addInventory(this.product.id, {
            itemCode: itemCode,
            price: this.combos[i].price,
            compareAtPrice: 0,
            quantity: this.combos[i].quantity,
            sku: this.combos[i].sku
          })

        }
      } else {
        const data: any = await this.apiCalls.addInventory(this.product.id, {
          itemCode: this.product.id + "aa",
          price: this.price,
          compareAtPrice: this.compareAtPrice,
          quantity: this.quantity,
          sku: this.sku
        })
      }
      resolve("")
    });
    return promise;

  }


  async addInventoryItem(productVariantAvailableIds) {
    var k = 0;
    for (var i = 0; i < this.combos.length; i++) {
      const combosSplitted = this.combos[i].variant.split("/");
      for (var j = 0; j < combosSplitted.length; j++) {
        const productAvailableId = await this.getVariantAvailableByValue(combosSplitted[j], productVariantAvailableIds)

        if (productAvailableId == null) {
          continue;
        }
        try {
          const test = await this.apiCalls.addInventoryItem(this.product.id, {

            itemCode: this.product.id + i,
            productVariantAvailableId: productAvailableId,
            productId: this.product.id,
            sequenceNumber: 0
          })
          if (test.status == 200) {
            k = k + 1;

          }
        } catch (Ex) {

        }

      }

    }
  }

  getVariantAvailableByValue(value, productAvailableIds) {
    var promise = new Promise(async (resolve, reject) => {
      for (var i = 0; i < productAvailableIds.length; i++) {
        if (productAvailableIds[i].value == value.trim()) {
          resolve(productAvailableIds[i].productVariantAvailableId);
          break;
        }
      }
      resolve(null);
    });
    return promise;
  }

  async addVariantValues(variantIds) {
    var promise = new Promise(async (resolve, reject) => {
      var k = 0;
      var productVariantAvailableIds = [];
      for (var i = 0; i < this.options.length; i++) {
        productVariantAvailableIds.push([]);
        if (this.options[i].new) {
          const values = (String(this.items[i].values)).split(",");
          for (var j = 0; j < values.length; j++) {
            var data: any = await this.apiCalls.addVariantValues(this.product.id, { productVariantId: variantIds[k], value: values[j], sequenceNumber: k })
            productVariantAvailableIds.push({ productVariantAvailableId: data.data.id, value: data.data.value })
          }
          k = k + 1;
        }

      }
      resolve(productVariantAvailableIds)
    });
    return promise;


  }


  deleteVariantImage(i, j, variantImgId) {
    this.apiCalls.deleteProductAsset(this.product.id, variantImgId)
    this.images[i].splice(j, 1);
  }

  async deleteVariant(i, variantId) {
    this.items.splice(i, 1)
    this.options.splice(i, 1);
    this.apiCalls.deleteVariant(this.product.id, variantId)
    // this.deleteEntireInventory();
    this.combos = [];
    this.getallCombinations(this.items)
  }

  getCategoryId() {
    const name = $('#categories').val();
    var id = $('#categories-data-list option[value="' + name + '"]').attr('id');
    return id;
  }

  sortObjects(array) {
    array.sort(function (a, b) {
      return a.sequenceNumber - b.sequenceNumber;
    });
  }

  async uploadProductImages() {
    for (var i = 0; i < this.productImages.length; i++) {
      if (this.productImages[i].new) {
        await this.apiCalls.uploadImage(this.product.id, this.productImages[i].file, "", this.productImages[i].isThumbnail ? this.productImages[i].isThumbnail : false)
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

  async deleteEntireInventory() {
    var promise = new Promise(async (resolve, reject) => {
      for (var j = 0; j < this.product.productInventories.length; j++) {
        await this.apiCalls.deleteInventory(this.product.id, this.product.productInventories[j].itemCode)
      }
      resolve("done")
    });
    return promise;

  }

  async joinVariantAvailables(variantAvailables) {

    var promise = new Promise(async (resolve, reject) => {
      const data: any = await this.apiCalls.getVariantAvailables(this.product.id);
      for (var i = 0; i < data.data.length; i++) {
        variantAvailables.push({ productVariantAvailableId: data.data[i].id, value: data.data[i].value })
      }
      resolve(variantAvailables)
    });
    return promise;

  }



  async onFileChanged(event, i) {
    if (this.images[i]) {

    } else {
      this.images[i] = [];
    }
    const files = event.target.files;
    for (var j = 0; j < files.length; j++) {
      const file = files[j];
      this.images[i].push({ file: file, preview: await this.previewImage(file), new: true });
    }
  }

  async uploadVariantImages() {
    for (var i = 0; i < this.images.length; i++) {
      if (this.images[i]) {
        for (var j = 0; j < this.images[i].length; j++) {
          if (this.images[i][j].new) {
            const formdata = new FormData();
            formdata.append("file", this.images[i][j].file);
            const data = await this.apiCalls.uploadImage(this.product.id, formdata, this.product.id + i, "")
          }
        }
      }
    }
  }

  setThumbnail(i) {
    document.getElementById(`product-image-${i}`).style.border = "thick solid #0000FF";

    for (var j = 0; j < this.productImages.length; j++) {
      if (i == j) {
        this.productImages[j].isThumbnail = true;

      } else {
        this.productImages[j].isThumbnail = false;
        document.getElementById(`product-image-${j}`).style.border = "none";

      }
    }
    if (this.productImages[i].new) {
      this.thumbnailUrl = null;

    } else {
      this.thumbnailUrl = this.productImages[i].preview;
    }


  }



}
