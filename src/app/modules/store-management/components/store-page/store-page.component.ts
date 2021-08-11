import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { Store } from '../store.model'

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.scss']
})
export class StorePageComponent implements OnInit {
  regions: any = [];
  requiredError: any = false;
  logo: any = { file: "", preview: "" };
  banner: any = { file: "", preview: "" };
  openTime: any = "";
  closeTime: any = "";
  minOrderQty: any = "5";  // nazrul : albert wants default value to start with 5
  states: any = [];
  verticleCode: any = "";
  storeModel = new Store("", "", "", "", "", "", "", "", 5, 0, "", "", "",  {stateCharges:[],stateIds:[]},false);

  timmings: any = [
    { day: "MONDAY", isOff: false, openTime: "09:00", closeTime: "17:00" },
    { day: "TUESDAY", isOff: false, openTime: "09:00", closeTime: "17:00" },
    { day: "WEDNESDAY", isOff: false, openTime: "09:00", closeTime: "17:00" },
    { day: "THURSDAY", isOff: false, openTime: "09:00", closeTime: "17:00" },
    { day: "FRIDAY", isOff: false, openTime: "09:00", closeTime: "17:00" },
    { day: "SATURDAY", isOff: false, openTime: "09:00", closeTime: "17:00" },
    { day: "SUNDAY", isOff: false, openTime: "09:00", closeTime: "17:00" }
  ]

  public Editor = ClassicEditor;
  constructor(
    private apiCalls: ApiCallsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initialStoreActions();
    this.extractVerticleCode();
    this.setRegionUsingClientIpAddress();

    if (this.verticleCode.includes("FnB")) {
      this.storeModel.packType = "Food"
      this.hideOptionsWhenFnB();
    }
  }

  async registerStore(form) {
    if (form.valid) {
      this.apiCalls.loadingAnimation("Registering new store", "280")
      await this.saveDetails();
      this.saveStoreTimmings();
      this.uploadAssets();
      this.saveStoreDeliveryDetails();
      this.addStateDeliveryCharges();
    }
    else {
      this.emptyFields();
    }
  }

  hideOptionsWhenFnB(){
    $("#delivery-type option[value=" + "SCHEDULED" + "]").hide();
    $("#payment-type option[value=" + "CoD" + "]").hide();
  }

  async onLogoChanged(event) {
    const file = event.target.files[0];
    this.logo.file = file;
    this.logo.preview = await this.previewImage(file)
  }

  async onBannerChanged(event) {
    const file = event.target.files[0];
    this.banner.file = file;
    this.banner.preview = await this.previewImage(file)
  }


  highlightEmptyFields() {
    var arr: any = document.getElementsByClassName('necessary');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value == "") {
        $(arr[i]).val('').css("border-color", "red");
      } else {
        $(arr[i]).css("border-color", "#EAEDF2");
      }
    }
  }


  emptyFields() {
    this.highlightEmptyFields();
    this.requiredError = true;
    window.scroll(0, 0)
  }

  uploadAssets() {
    if (this.banner.file || this.logo.file) {
      const formData = new FormData();
      formData.append("banner", this.banner.file);
      formData.append("logo", this.logo.file);
      this.apiCalls.uploadStoreAssets(formData, localStorage.getItem('storeId'))
    } else {
      this.apiCalls.loadingdialogRef.close();
    }

  }

  saveDetails() {
    return this.apiCalls.registerStore({
      name: this.storeModel.storeName,
      city: this.storeModel.city,
      address: this.storeModel.address,
      postcode: this.storeModel.postCode,
      storeDescription: this.storeModel.storeInfo,
      email: this.storeModel.email,
      clientId: localStorage.getItem("ownerId"),
      domain: this.storeModel.storeName.replace(/\s+/g, '-').toLowerCase(),
      regionCountryId: this.storeModel.region,
      regionCountryStateId: (<HTMLInputElement>document.getElementById("state-dropdown")).value,
      phoneNumber: (<HTMLInputElement>document.getElementById("phoneNumber")).value,
      serviceChargesPercentage: this.storeModel.serviceCharge,
      verticalCode: this.verticleCode,
      paymentType: this.storeModel.paymentType
    })
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

  deleteBanner() {
    this.banner.file = "";
    this.banner.preview = "";
  }

  deleteLogo() {
    this.logo.file = "";
    this.logo.preview = "";
  }

  async fetchRegions() {
    var regions: any = await this.apiCalls.getStoreRegions();
    this.regions = regions.data.content;
    console.log(this.regions)
  }

  async storeExists(event) {
    const data: any = await this.apiCalls.getStoreByName(event.target.value)
    if (data.data.content.length > 0) {
      $("#store-exists").show(200);
    } else {
      $("#store-exists").hide();
    }
  }

  async saveStoreTimmings() {
    for (var i = 0; i < this.timmings.length; i++) {
      await this.apiCalls.saveStoreTimmings({
        "closeTime": this.timmings[i].closeTime,
        "day": this.timmings[i].day,
        "openTime": this.timmings[i].openTime,
        "isOff": this.timmings[i].isOff
      })
    }
  }

  changeOpenTime(event, i) {
    this.timmings[i].openTime = event.target.value;
  }
  changeCloseTime(event, i) {
    this.timmings[i].closeTime = event.target.value;

  }
  changeOn_Off(event, i) {
    this.timmings[i].isOff = event.checked;
  }

  minOrderQtyChange(event) {
    const minOrderQty = event.key;
    if (minOrderQty.toString() == "-") {
      this.minOrderQty = "";
    }
  }

  async saveStoreDeliveryDetails() {
    const dPackage: any = document.getElementById('delivery-package');
    const bikeOrderQty: any = document.getElementById('bike');
    const data = await this.apiCalls.saveDeliveryDetailsStore({
      "type": this.storeModel.deliveryType,
      "itemType": dPackage.value,
      "maxOrderQuantityForBike": bikeOrderQty.value,
      "allowsStorePickup" : this.storeModel.storePickUp
    })
    console.log(data)
    this.apiCalls.loadingdialogRef.close();

  }

  phoneNumberChange(event) {
    const phNum = event.target.value;
    if (!/^([0-9]{0,})$/.test(phNum)) {
      var phoneNumber = (<HTMLInputElement>document.getElementById("phoneNumber")).value.replace(phNum[phNum.length - 1], "");
      phoneNumber = phoneNumber.replace(/\D/g, '');
      (<HTMLInputElement>document.getElementById("phoneNumber")).value = phoneNumber;
      $("#phone-pattern").show(70)
    } else {
      $("#phone-pattern").hide()
    }
  }

  regionChange(event) {
    if (event.target.value) {
      this.fetchStates(event.target.value)
      this.storeModel.stateCharges = [];
    } else {
      this.states = [];
    }
  }

  async fetchStates(regionId) {
    const data: any = await this.apiCalls.getStates(regionId);
    this.states = data.data.content;
  }
  serviceChargesChange(event) {
    if (event.target.value > 100) {
      this.storeModel.serviceCharge = 100;
    } else if (event.key == "-") {
      this.storeModel.serviceCharge = 0;
    }
  }

  extractVerticleCode() {
    this.route.params.subscribe(params => {
      if (params.verticleCode) {
        this.verticleCode = params.verticleCode
      }
    });
  }

  initialStoreActions() {
    this.fetchRegions();
    $("#store-exists").hide();
    $("#store-timmings-table").show();  // nazrul: albert said he want by default opened
    $("#phone-pattern").hide()
  }

  async setRegionUsingClientIpAddress() {
    const data: any = await this.apiCalls.checkCountry();
    const country = data.country;
    var regionId = "";
    if (country == "Pakistan") {
      regionId = "PAK"
    } else if (country == "Malaysia") {
      regionId = "MYS";
    }
    this.storeModel.region = regionId;
    this.fetchStates(regionId)
  }


  onlyAlphaNum(event) {
    const input = String.fromCharCode(event.keyCode);

    // nazrul : only enable alphanumeric and special char of underscore_ and dash-
    if (/[a-zA-Z0-9_-]/.test(input)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  addStateCharges() {
      this.storeModel.stateCharges.stateCharges.push({ stateId: '', price: ''});
  }

  removeStateCharge(i) {
    this.storeModel.stateCharges.stateCharges.splice(i, 1)
    this.storeModel.stateCharges.stateIds[i] = "";
  }

  stateChargeChange(event, i) {
    this.storeModel.stateCharges.stateCharges[i].stateId = event.target.value;
    if (this.storeModel.stateCharges.stateIds[i]) {
      this.storeModel.stateCharges.stateIds[i] = (event.target.value);
    } else {
      this.storeModel.stateCharges.stateIds.push(event.target.value);
    }
  }

  stateChargePriceChange(event, i) {
    this.storeModel.stateCharges.stateCharges[i].price = event.target.value;
  }

  async addStateDeliveryCharges() {
    for (var i = 0; i < this.storeModel.stateCharges.stateCharges.length; i++) {
      await this.apiCalls.saveStoreStateCharges({
        "delivery_charges": this.storeModel.stateCharges.stateCharges[i].price,
        "region_country_state_id": this.storeModel.stateCharges.stateCharges[i].stateId
      })
    }
  }
}
