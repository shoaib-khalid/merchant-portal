import { Component, OnChanges, OnInit } from '@angular/core';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
import $ from "jquery";
import { SuccessAnimationComponent } from 'src/app/modules/home/components/success-animation/success-animation.component';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from 'src/app/services/helper.service'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';




@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})




export class AddProductComponent implements OnInit {

  productStatus: any = "ACTIVE";
  title: string;
  description: string;
  price: any = "";
  compareAtPrice: string;
  costPerItem: any;
  chargeTax: boolean;
  inventoryMngdBy: any;
  sku: any;
  barcode: any;
  trackQuantity: any;
  continueSelling: any;
  minQtyAlarm:any;
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
  productImages: any = [];
  id: any;
  namenew: any;
  myControl = new FormControl("Size");
  //vos purpose is to show suggestions for variant names
  vos: string[] = ['Size', 'Color', 'Material', 'Style', 'Title'];
  filteredOptions: Observable<string[]>;
  public Editor = ClassicEditor;

  constructor(private dialog: MatDialog,

    private helperTextService: HelperTextService,
    private apiCalls: ApiCallsService,
    private router: Router,
    private helperService: HelperService) { }

  ngOnInit(): void {
    this.countries = this.helperTextService.countriesList;
    this.getCategoriesByStoreId();
  }

  addAnotherOption() {
    if (this.items.length == this.options.length) {
      this.options.push({ name: this.myControl.value })
    }
  }

  variantChanged(event) {
    this.autoCompleteInitialization()
    if (event.target.checked) {
      this.options.push({ name: this.myControl.value })
    } else {
      this.options = [];
    }
  }

  variantsChanged(event) {
    if (event.key == "Enter" || event.key == "," || event.key == " ") {
      this.combos = [];
      this.getallCombinations(this.items)
    }


  }

  variantNameChanged(event, i) {
    this.options[i].name = event.target.value;
  }


  getallCombinations(combos, result = "", n = 0) {

    var out = "";

    if (n == combos.length) {
      if (result.substring(1) != "") {
        this.combos.push({ variant: result.substring(1), price: this.price, quantity: 0, sku: 0 })
        this.images.push({ file: "", preview: "" })
        console.log(this.combos)
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

    if (this.title && this.verifyDetails() && this.sku) {
      this.apiCalls.loadingAnimation("Adding Product")
      const categoryId = await this.getCategoryId()
      const body = {
        "categoryId": categoryId,
        "name": this.title,
        "status": this.productStatus,
        "description": this.description,
        "storeId": localStorage.getItem("storeId"),
        "allowOutOfStockPurchases": this.continueSelling,
        "trackQuantity": this.trackQuantity,
        "minQuantityForAlarm": this.minQtyAlarm

      }
      const data: any = await this.apiCalls.addProduct(body);
      // this.addDeliveryDetails(data.data.id)
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
      if (this.options[i].name) {
        var data: any = await this.apiCalls.addVariant(productId, { name: this.options[i].name, sequenceNumber: i })
        variantIds.push(data.data.id)
      }
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
    var promise = new Promise(async (resolve, reject) => {
      if (this.combos.length > 0) {
        for (var i = 0; i < this.combos.length; i++) {
          const itemCode = productId + i
          const data: any = await this.apiCalls.addInventory(productId, {
            itemCode: itemCode,
            price: this.helperService.removeCharacters(this.combos[i].price),
            compareAtPrice: 0,
            quantity: this.combos[i].quantity,
            sku: this.combos[i].sku
          })

        }
      } else {
        const data: any = await this.apiCalls.addInventory(productId, {
          itemCode: productId + "aa",
          price: this.helperService.removeCharacters(this.price),
          compareAtPrice: this.compareAtPrice,
          quantity: this.quantity,
          sku: this.sku
        })
      }

      //uploading product images
      for (var i = 0; i < this.productImages.length; i++) {
        await this.apiCalls.uploadImage(productId, this.productImages[i].file, "", this.productImages[i].isThumbnail)
      }
      resolve("")
    });
    return promise;

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

      if (this.images[i].file) {
        const formdata = new FormData();
        formdata.append("file", this.images[i].file);
        const data = await this.apiCalls.uploadImage(productId, formdata, productId + i, "")
      }
    }
  }

  priceChanged(event, i) {
    const acceptedPrice = this.helperService.acceptCustomPrice(event.target.value)
    const element: any = document.getElementsByClassName('variant-price')[i]
    element.value = acceptedPrice;
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
    this.id = $('#categories-data-list option[value="' + name + '"]').attr('id');
    if (this.id) {
      return this.id;
    }
    this.id = await this.createNewCategory(name)
    return this.id;

  }

  createNewCategory(name) {
    var promise = new Promise(async (resolve, reject) => {
      const data: any = await this.apiCalls.createCategory(new FormData(), name);
      resolve(data.data.id);
    });
    return promise;
  }


  highlightEmptyFields() {
    var arr: any = document.getElementsByClassName('necessary');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value == "") {
        $(arr[i]).val('').css("border-color", "red");
      } else {
        $(arr[i]).css("border-color", "");
      }
    }
  }

  async onFileChanged(event, i) {

    const files = event.target.files;
    const file = files[0];
    this.images[i].file = file;
    this.images[i].preview = await this.previewImage(file);

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
    const files = event.target.files;
    for (var j = 0; j < files.length; j++) {
      const formdata = new FormData();
      formdata.append("file", files[j]);
      this.productImages.push({ file: formdata, preview: await this.previewImage(files[j]), isThumbnail: false })
    }
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
    this.updateImageOrder();
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
    this.updateImageOrder();

  }

  deleteVariantImage(i, j) {
    this.images[i].splice(j, 1);
  }

  deleteProductImages(i) {
    this.productImages.splice(i, 1);
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


  verifyDetails() {
    this.namenew = $('#categories').val();

    if (this.variantChecked) {
      return true;
    } else if (this.price && this.quantity && this.namenew.trim()) {
        // else if (this.price && this.quantity && name.trim()) {
      return true;
    } else {
      return false;
    }
  }

  setThumbnail(i) {
    for (var j = 0; j < this.productImages.length; j++) {
      if (i == j) {
        this.productImages[j].isThumbnail = true;
      } else {
        this.productImages[j].isThumbnail = false;
        document.getElementById(`product-image-${j}`).style.border = "none";
      }
    }
    document.getElementById(`product-image-${i}`).style.border = "thick solid #0000FF";
  }



  verifyDeliveryDetails() {
    const data = this.getDeliveryElements();
    if (data.itemType.value && data.weight.value && data.type.value) {
      return true;
    } else {
      return false;
    }
  }

  getDeliveryElements() {
    const itemType: any = document.getElementById("delivery-type");
    const weight: any = document.getElementById("delivery-weight")
    const packaging: any = document.getElementById("delivery-package")
    return {
      itemType: itemType,
      weight: weight,
      type: packaging
    }
  }

  updateImageOrder() {
    const noOfeles = this.images.length - this.combos.length;
    if (noOfeles > 0) {
      this.images.splice(-noOfeles, this.images.length - 1)
    }
  }

  /**
   * 
   * @param event
   * Takes in input as user types.
   * Checks if entered value is correct.
   * Reflects the correct price on front-end
   */
  priceChange(event) {
    const acceptedPrice = this.helperService.acceptCustomPrice(event.target.value)
    const generalPrice: any = document.getElementById('general-price')
    generalPrice.value = `${acceptedPrice}`
    this.price = acceptedPrice;
  }

  titleChange(event) {
    const prodName = event.target.value;
    this.sku = prodName.replace(/\s+/g, '-').toUpperCase();
  }

  autoCompleteInitialization() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.vos.filter(option => option.toLowerCase().includes(filterValue));
  }

  optionSelectedAutoComplete(option, i) {
    this.options[i].name = option.value;
  }
}
