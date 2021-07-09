import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { MatDialog } from '@angular/material/dialog';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import $ from 'jquery';
import { HelperService } from 'src/app/services/helper.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.scss']
})
export class StorePageComponent implements OnInit {
  storeName: any;
  email: any = "";
  region: any = "";
  paymentType:any="";
  regions: any = [];
  city: any = "";
  address: any = "";
  storeInfo: any = "";
  postCode: any = "";
  requiredError: any = false;
  logo: any = { file: "", preview: "" };
  banner: any = { file: "", preview: "" };
  openTime: any = "";
  closeTime: any = "";
  minOrderQty: any = "";
  states: any = [];
  serviceCharge: any = "0";
  verticleCode: any = "";

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
    private dialog: MatDialog,
    private helperService: HelperService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initialStoreActions();
    this.extractVerticleCode();
    this.setRegionUsingClientIpAddress();
  }

  async registerStore() {
    if (this.storeName && (<HTMLInputElement>document.getElementById("phoneNumber")).value) {
      this.apiCalls.loadingAnimation("Registering new store", "280")
      await this.saveDetails();
      this.saveStoreTimmings();
      this.uploadAssets();
      this.saveStoreDeliveryDetails();
    } else {
      this.emptyFields();
    }
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
    var arr: any = document.getElementsByClassName('form-control');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value == "") {
        if ($(arr[i])[0].id == "storeName") {
          $(arr[i]).val('').css("border-color", "red");
        } else if ($(arr[i])[0].id == "phoneNumber") {
          $(arr[i]).val('').css("border-color", "red");
        }
        else if ($(arr[i])[0].id == "region") {
          $(arr[i]).val('').css("border-color", "red");
        }
      } else {
        $(arr[i]).css("border-color", "");
      }
    }
  }


  emptyFields() {
    this.highlightEmptyFields();
    this.requiredError = true;
    window.scroll(0, 0)
  }

  uploadAssets() {
    if (this.banner.file && this.logo.file) {
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
      name: this.storeName,
      city: this.city,
      address: this.address,
      postcode: this.postCode,
      storeDescription: this.storeInfo,
      email: this.email,
      clientId: localStorage.getItem("ownerId"),
      domain: this.storeName.replace(/\s+/g, '-').toLowerCase(),
      regionCountryId: this.region,
      regionCountryStateId: (<HTMLInputElement>document.getElementById("state-dropdown")).value,
      phoneNumber: (<HTMLInputElement>document.getElementById("phoneNumber")).value,
      serviceChargesPercentage: this.serviceCharge,
      verticalCode: this.verticleCode,
      paymentType:this.paymentType
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
    console.log(event.target.value)
  }
  changeCloseTime(event, i) {
    this.timmings[i].closeTime = event.target.value;

  }
  changeOn_Off(event, i) {
    this.timmings[i].isOff = event.checked;
    console.log(this.timmings)
  }

  revealTimeTable() {
    $("#store-timmings-table").show(1000);

  }

  minOrderQtyChange(event) {
    const minOrderQty = event.key;
    if (minOrderQty.toString() == "-") {
      this.minOrderQty = "";
    }
  }

  async saveStoreDeliveryDetails() {
    const dType: any = document.getElementById('delivery-type');
    const dPackage: any = document.getElementById('delivery-package');
    const bikeOrderQty: any = document.getElementById('bike');

    const data = await this.apiCalls.saveDeliveryDetailsStore({
      "type": dType.value,
      "itemType": dPackage.value,
      "maxOrderQuantityForBike": bikeOrderQty.value
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
      this.serviceCharge = 100;
    } else if (event.key == "-") {
      this.serviceCharge = 0;
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
    $("#store-timmings-table").hide();
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
    this.region = regionId;
    this.fetchStates(regionId)
  }

}
