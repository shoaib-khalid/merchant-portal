import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import $ from 'jquery';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  epForm: FormGroup;
  productStatus: any = "";
  weight: any;
  weightType: any;
  packingSize: any = "";
  items: any = [];
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
  deletedVariants: any = [];
  imagesToBeDeleted: any = [];
  id: any;
  public Editor = ClassicEditor;


  constructor(
    private route: ActivatedRoute,
    private apiCalls: ApiCallsService,
    private helperService: HelperService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.loadProduct(params.id)
        this.setFormGroup();
      }
    });

  }

  async loadProduct(id) {
    this.apiCalls.loadingAnimation("Loading..")
    await this.getCategoriesByStoreId();
    const data: any = await this.apiCalls.getStoreProductById(id);
    this.product = data.data;
    this.setAllVariables()
    // this.findInventory();
  }

  setAllVariables() {
    console.log(this.product)
    this.epForm['controls'].productDetails['controls'].name.setValue(this.product.name)
    this.epForm['controls'].productDetails['controls'].description.setValue(this.product.description)
    this.epForm['controls'].productDetails['controls'].stock.setValue(0)
    this.epForm['controls'].defaultInventory['controls'].trackQuantity.setValue(this.product.trackQuantity)
    this.epForm['controls'].defaultInventory['controls'].continueSelling.setValue(this.product.allowOutOfStockPurchases)
    this.epForm['controls'].defaultInventory['controls'].minQtyAlarm.setValue(this.product.minQuantityForAlarm)
    this.packingSize = this.product.packingSize;
    this.productStatus = this.product.status;
    this.weight = this.product.weight;
    this.setCategory();
    this.setDeliveryDetails()
    this.setProductImages();
    this.setVariants();
    this.getallCombinations(this.items)
    this.showDefaultInventory();
    this.setProductAssets();
    this.setInventory();
    this.apiCalls.loadingdialogRef.close();
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

  /**
 * Sets images of products and adds border to thumbnail image
 */
  setProductImages() {
    var tI = -1;
    const prodAssets = this.product.productAssets;
    for (var i = 0; i < prodAssets.length; i++) {
      if (prodAssets[i].itemCode == null) {
        this.productImages.push({ id: prodAssets[i].id, preview: prodAssets[i].url })
        if (prodAssets[i].isThumbnail) {
          tI = i;
        }
      }
    }
    if (tI != -1) {
      // document.getElementById(`product-image-${tI}`).style.border = "thick solid #0000FF";
    }

  }





  setVariants() {
    if (this.product.productVariants.length > 0) {
      this.sortObjects(this.product.productVariants)
      this.variantChecked = true;
      this.toggleDefaultInventory(true)
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
      if (id) {
        this.apiCalls.deleteVariantValue(this.product.id, id)
      }
    }
    this.combos = [];
    this.getallCombinations(this.items)
  }

  variantNameChanged(event, i) {
    this.options[i].name = event.target.value;
  }


  /**
   * checks digits after productId of itemCode,
   * extracts them and then sets images using index
   * obtained using these digits
   */
  setProductAssets() {
    const pIdLen = this.product.id.length;
    this.product.productAssets.forEach(element => {
      if (element.itemCode) {
        this.images[parseInt(element.itemCode.substring(pIdLen))] = ({ preview: element.url, id: element.id })
      }
    });
  }

  getallCombinations(combos, result = "", n = 0) {

    var out = "";
    if (n == combos.length) {
      if (result.substring(1) != "") {
        this.combos.push({ variant: result.substring(1), price: this.epForm['controls'].defaultInventory['controls'].price.value, quantity: 0, sku: 0, status: "AVAILABLE" })
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
          this.combos[index].status = element.status;
        }
      }
    });
  }

  async onThumbnailChanged(event, i) {
    const files = event.target.files;
    for (var j = 0; j < files.length; j++) {
      const formdata = new FormData();
      if (this.imageSizeCheck(files[j].size)) {
        formdata.append("file", files[j]);
        this.productImages.push({ file: formdata, preview: await this.previewImage(files[j]), new: true, isThumbnail: false })
      }
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
    this.toggleDefaultInventory(event.target.checked)
  }

  deletethumbnailImage(imgId, i) {
    this.productImages.splice(i, 1)
    if (imgId) {
      this.imagesToBeDeleted.push(imgId);
    }
  }



  async updateProduct() {

    const combinedObject = {
      ...this.epForm['controls'].productDetails.value, ...{
        "categoryId": await this.getCategoryId(),
        "status": this.productStatus,
        "storeId": localStorage.getItem("storeId"),
        "thumbnailUrl": this.thumbnailUrl,
        "minQuantityForAlarm": this.epForm['controls'].defaultInventory['controls'].minQtyAlarm.value,
        "allowOutOfStockPurchases": this.epForm['controls'].defaultInventory['controls'].continueSelling.value,
        "trackQuantity": this.epForm['controls'].defaultInventory['controls'].trackQuantity.value,
        "packingSize": this.packingSize
      }
    }
    if (this.epForm.status == "VALID") {
      this.apiCalls.loadingAnimation('Updating..')
      await this.deleteEntireInventory();
      this.deleteVariants();
      const body = combinedObject
      this.deleteImages();
      await this.addInventory();
      await this.apiCalls.updateProduct(body, this.product.id)
      await this.uploadProductImages();
      const variantIds: any = await this.addVariantName();
      const productAvailableIds = await this.addVariantValues(variantIds);
      const allIds: any = await this.joinVariantAvailables(productAvailableIds)
      await this.addInventoryItem(allIds);
      await this.uploadVariantImages();
      this.apiCalls.loadingdialogRef.close();
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/products/${this.product.id}`]);
      });
    }

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
            price: this.helperService.removeCharacters(this.combos[i].price),
            compareAtPrice: 0,
            quantity: this.combos[i].quantity,
            sku: this.combos[i].sku,
            status: this.combos[i].status
          })
        }
      } else {
        const data: any = await this.apiCalls.addInventory(this.product.id, {
          itemCode: this.product.id + "aa",
          price: this.epForm['controls'].defaultInventory['controls'].price.value,
          compareAtPrice: 0,
          quantity: this.epForm['controls'].defaultInventory['controls'].quantity.value,
          sku: this.epForm['controls'].defaultInventory['controls'].sku.value
        })
      }
      resolve("")
    });
    return promise;
  }


  async addInventoryItem(productVariantAvailableIds) {
    var promise = new Promise(async (resolve, reject) => {
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
      resolve("")
    });
    return promise;
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
          this.options[i].new = false;
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
    if (variantId) {
      this.deletedVariants.push(variantId)
    }
    this.combos = [];
    this.getallCombinations(this.items)
    if (this.items.length == 0) {
      this.variantChecked = false;
      this.toggleDefaultInventory(this.variantChecked)
    }

  }

  async getCategoryId() {
    var name: any = $('#categories').val().toString();
    name = name.trim() ? name : "no-category";
    this.id = $('#categories-data-list option[value="' + name + '"]').attr('id');
    if (this.id) {
      return this.id;
    }
    this.id = await this.createNewCategory(name)
    return this.id;
  }

  createNewCategory(name) {
    var promise = new Promise(async (resolve, reject) => {
      const data: any = await this.apiCalls.createCategory(null, name);
      resolve(data.data.id);
    });
    return promise;
  }

  sortObjects(array) {
    array.sort(function (a, b) {
      return a.sequenceNumber - b.sequenceNumber;
    });
  }

  async uploadProductImages() {

    var promise = new Promise(async (resolve, reject) => {
      for (var i = 0; i < this.productImages.length; i++) {
        if (this.productImages[i].new) {
          await this.apiCalls.uploadImage(this.product.id, this.productImages[i].file, "", this.productImages[i].isThumbnail ? this.productImages[i].isThumbnail : false)
          this.productImages[i].new = false;
        }
      }
      resolve("done")
    });
    return promise;


  }

  priceChanged(event, i) {
    // const acceptedPrice = this.helperService.acceptCustomPrice(event.target.value)
    // const element: any = document.getElementsByClassName('variant-price')[i]
    // element.value = acceptedPrice;
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
      this.product.productInventories = [];
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
    if (this.images[i].id) {
      this.imagesToBeDeleted.push(this.images[i].id)
    }
    const files = event.target.files;
    const file = files[0];
    this.images[i] = { file: file, preview: await this.previewImage(file), new: true };
  }

  async uploadVariantImages() {
    var promise = new Promise(async (resolve, reject) => {
      for (var i = 0; i < this.images.length; i++) {
        if (this.images[i]) {
          if (this.images[i].new) {
            const formdata = new FormData();
            formdata.append("file", this.images[i].file);
            const data = await this.apiCalls.uploadImage(this.product.id, formdata, this.product.id + i, "")
          }
        }
      }
      resolve("")
    });
    return promise;
  }

  async setThumbnail(i) {
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
      const data = await this.apiCalls.updateProductImage(this.product.id, {
        "isThumbnail": true,
      }, this.productImages[i].id)

    }
  }


  async setDeliveryDetails() {
    const data: any = await this.apiCalls.getDeliveryDetails(this.product.id);
    if (data.data) {
      const elements = this.getDeliveryElements();
      elements.itemType.value = data.data.itemType;
      elements.type.value = data.data.type;
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



  showDefaultInventory() {
    const itemCode = this.product.id + "aa";
    const productInventories = this.product.productInventories;
    for (var i = 0; i < productInventories.length; i++) {
      if (productInventories[i].productInventoryItems.length == 0) {
        this.epForm['controls'].defaultInventory['controls'].price.setValue(productInventories[i].price);
        this.epForm['controls'].defaultInventory['controls'].sku.setValue(productInventories[i].sku);
        this.epForm['controls'].defaultInventory['controls'].quantity.setValue(productInventories[i].quantity);
        break;
      }
    }
  }




  titleChange(event) {
    const prodName = event.target.value;
    this.epForm['controls'].defaultInventory['controls'].sku.setValue(prodName.replace(/\s+/g, '-').toUpperCase());
  }


  /**
   * Deleted variants if any
   * when update product is clicked
   */
  async deleteVariants() {
    for (var i = 0; i < this.deletedVariants.length; i++) {
      await this.apiCalls.deleteVariant(this.product.id, this.deletedVariants[i])
    }
    this.deletedVariants = [];
  }

  /**
   * Deletes images that are deleted by user
   * on update button click
   */
  async deleteImages() {
    for (var i = 0; i < this.imagesToBeDeleted.length; i++) {
      await this.apiCalls.deleteProductAsset(this.product.id, this.imagesToBeDeleted[i]);
    }
    this.imagesToBeDeleted = [];
  }

  setFormGroup() {
    this.epForm = this.fb.group({

      productDetails: this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(80)]],
        stock: [0],
        description: [''],
        storeId: [localStorage.getItem('storeId')],
        packingSize: ['']
      }),
      defaultInventory: this.fb.group({
        price: ['', [Validators.required]],
        sku: ['', [Validators.required]],
        quantity: ['', [Validators.required]],
        continueSelling: [false],
        trackQuantity: [false],
        minQtyAlarm: [0]
      }),

    })
  }

  onSubmit() {

  }

  toggleDefaultInventory(flag) {
    if (flag) {
      this.epForm['controls'].defaultInventory['controls'].price.disable()
      this.epForm['controls'].defaultInventory['controls'].sku.disable()
      this.epForm['controls'].defaultInventory['controls'].quantity.disable()
    } else {
      this.epForm['controls'].defaultInventory['controls'].price.enable()
      this.epForm['controls'].defaultInventory['controls'].sku.enable()
      this.epForm['controls'].defaultInventory['controls'].quantity.enable()
    }
  }


  findInventory() {
    var inventory;
    var toFind = ["44b364d7-f638-471b-bc3b-a3b04a08d285", "RedmiNote10_Color_LakeGreen"]
    var inventories = this.product.productInventories;
    var flag = true;
    for (var i = 0; i < inventories.length; i++) {
      flag = true;
      inventory = inventories[i];
      for (var j = 0; j < inventories[i].inventoryItems; j++) {
        if (toFind.includes(inventories[j].productVariantAvailableId)) {
          continue;
        } else {
          flag = false;
          break;
        }
      }
      if (flag) {
        break;
      }
    }
  }

  inventoryUnAvailable(event, index) {
    if (event.target.checked) {
      this.combos[index].status = "NOTAVAILABLE";
      return;
    }
    this.combos[index].status = "AVAILABLE"
  }
  imageSizeCheck(size) {
    return (size / 2048) > 1024 ? false : true;
  }
}
