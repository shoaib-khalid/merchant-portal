import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { HelperService } from 'src/app/services/helper.service';
import $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Store } from '../store.model'


@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {


  regions: any = [];
  logo: any = { file: null, preview: "", valid: true }
  banner: any = { file: null, preview: "", valid: true };
  store: any;
  timmings: any = [];
  states: any = [];
  public Editor = ClassicEditor;
  storeModel = new Store("", "", "", "", "", "", "", "", "", 5, 0, "", "", "", { stateCharges: [], stateIds: [], deletedStateIds: [] }, false,
    false, { dsp: [], loopLength: [], values: [], ids: [] }, "");


  constructor(private apiCalls: ApiCallsService, private route: ActivatedRoute, private helperService: HelperService) { }

  ngOnInit(): void {
    this.initialHidingOfElements();
    this.route.params.subscribe(params => {
      if (params.id) {
        this.loadStore(params.id)
      }
    });
  }

  initialHidingOfElements() {
    $("#warning-address").hide();
    $("#warning-postcode").hide();
    $("#phone-pattern").hide()
  }

  hideOptionsWhenFnB() {
    $("#delivery-type option[value=" + "SCHEDULED" + "]").hide();
    $("#payment-type option[value=" + "COD" + "]").hide();
  }

  async loadStore(id) {
    this.store = await this.apiCalls.getStoreDetails(id);
    this.store = this.store.data;
    try {
      if (this.store.verticalCode.includes("FnB")) {
        this.hideOptionsWhenFnB()
      }
    } catch (ex) {

    }

    this.setAssets();
    this.setTextualDetails();
    this.fetchRegions();
    this.setStoreTimmings(id);
    this.setDeliveryDetails();
    this.setStateCharges();
    if (this.store.regionCountry) {
      this.fetchStates(this.store.regionCountry.id);
    }
  }

  async onLogoChanged(event) {
    const file = event.target.files[0];
    if (this.imageSizeCheck(file.size)) {
      this.logo.valid = true;
      this.logo.file = file;
      this.logo.preview = await this.previewImage(file);
      this.banner.delete=false;
    } else {
      this.logo.preview = "";
      this.logo.file = null;
      this.logo.valid = false;
    }
  }

  async onBannerChanged(event) {
    const file = event.target.files[0];
    if (this.imageSizeCheck(file.size)) {
      this.banner.file = file;
      this.banner.valid = true;
      this.banner.preview = await this.previewImage(file);
      this.banner.delete=false;
    } else {
      this.banner.preview = "";
      this.banner.file = null;
      this.banner.valid = false;
    }

  }

  async update(form) {
    if (form.valid) {
      this.apiCalls.loadingAnimation("Updating..")
      await this.updateTextualDetails();
      await this.updateAssets();
      await this.updateStoreTimmings(this.store.id)
      await this.updateDeliveryDetails();
      this.deleteStateCharges();
      this.updateStateCharges();
      this.updateStoreDeliveryProvider();
      this.apiCalls.loadingdialogRef.close();
    } else {
      this.highlightEmptyFields();
    }

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

  setTextualDetails() {
    this.storeModel.storeName = this.store.name;
    this.storeModel.storeInfo = this.store.storeDescription;
    this.storeModel.email = this.store.email;
    this.storeModel.paymentType = this.store.paymentType;
    this.storeModel.address = this.store.address;
    this.storeModel.city = this.store.city;
    this.storeModel.postCode = this.store.postcode;
    (<HTMLInputElement>document.getElementById("phoneNumber")).value = this.store.phoneNumber;
    this.storeModel.serviceCharge = this.store.serviceChargesPercentage;
    this.storeModel.verticleCode = this.store.verticalCode
  }

  setState() {
    this.storeModel.state = this.store.regionCountryStateId;
  }

  async setAssets() {
    const assets: any = await this.apiCalls.getStoreAssets(this.store.id);
    if (assets.data) {
      this.logo.preview = assets.data.logoUrl;
      this.banner.preview = assets.data.bannerUrl;
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

  updateTextualDetails() {
    const store = {
      "address": this.storeModel.address,
      "city": this.storeModel.city,
      "clientId": localStorage.getItem('ownerId'),
      "name": this.storeModel.storeName,
      "email": this.storeModel.email,
      "paymentType": this.storeModel.paymentType,
      "postcode": this.storeModel.postCode,
      "storeDescription": this.storeModel.storeInfo,
      "regionCountryId": this.storeModel.region,
      "regionCountryStateId": this.storeModel.state,
      "phoneNumber": (<HTMLInputElement>document.getElementById("phoneNumber")).value,
      serviceChargesPercentage: this.storeModel.serviceCharge
    }
    return this.apiCalls.updateStore(store, this.store.id)
  }

  async updateAssets() {
    const formData = new FormData();
    if (this.banner.file) {
      formData.append("banner", this.banner.file);
    }
    if (this.logo.file) {
      formData.append("logo", this.logo.file);
    }
    this.deleteAssets();
    return this.apiCalls.uploadStoreAssets(formData, this.store.id)
  }

  deleteBanner() {
    this.banner.file = "";
    this.banner.preview = "";
    this.banner["delete"] = true;
  }

  deleteLogo() {
    this.logo.file = "";
    this.logo.preview = "";
    this.logo["delete"] = true;
  }

  async deleteAssets() {
    if (this.banner.delete) {
      await this.apiCalls.deleteStoreAssets("banner");
    }

    if (this.logo.delete) {
      await this.apiCalls.deleteStoreAssets("logo");
    }
    this.apiCalls.loadingdialogRef.close();
  }

  showAddressWarning() {
    $("#warning-address").show(500);
  }

  showPostWarning() {
    $("#warning-postcode").show(500);
  }

  async fetchRegions() {
    var regions: any = await this.apiCalls.getStoreRegions();
    this.regions = regions.data.content;
    this.storeModel.region = this.store.regionCountryId;
    if (this.storeModel.region == null) {
      this.storeModel.region = "";
    }
  }

  async setStoreTimmings(storeId) {
    var data: any = await this.apiCalls.getStoreTimmings(storeId);
    data = data.data;
    for (var j = 0; j < data.length; j++) {
      this.timmings.push({ day: data[j].day, isOff: data[j].isOff, openTime: data[j].openTime, closeTime: data[j].closeTime })
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

  revealTimeTable() {
    $("#store-timmings-table").show(1000);
  }

  async updateStoreTimmings(storeId) {
    var promise = new Promise(async (resolve, reject) => {
      for (var j = 0; j < this.timmings.length; j++) {
        const data = await this.apiCalls.updateStoreTimmings({
          "closeTime": this.timmings[j].closeTime,
          "openTime": this.timmings[j].openTime,
          "isOff": this.timmings[j].isOff
        }, this.timmings[j].day, storeId)
      }
      resolve("");
    });
    return promise;

  }

  minOrderQtyChange(event) {
    const minOrderQty = event.key;
    if (minOrderQty.toString() == "-") {
      this.storeModel.minOrderQty = 0;
    }
  }

  async setDeliveryDetails() {
    console.log(this.store)
    var data: any = await this.apiCalls.getDeliveryDetailsStore(this.store.id);
    data = data.data;
    const dPackage: any = document.getElementById('delivery-package');
    const bikeOrderQty: any = document.getElementById('bike');
    this.storeModel.deliveryType = data.type;
    dPackage.value = data.itemType;
    bikeOrderQty.value = data.maxOrderQuantityForBike;
    (<HTMLInputElement>document.getElementById("car")).value = bikeOrderQty.value;
    this.storeModel.storePickUp = data.allowsStorePickup;
    this.setStoreDeliveryProvider();
  }

  async updateDeliveryDetails() {
    const dType: any = document.getElementById('delivery-type');
    const dPackage: any = document.getElementById('delivery-package');
    const bikeOrderQty: any = document.getElementById('bike');
    return await this.apiCalls.updateDeliveryDetailsStore(this.store.id, {
      "type": dType.value,
      "itemType": dPackage.value,
      "maxOrderQuantityForBike": bikeOrderQty.value,
      "allowsStorePickup": this.storeModel.storePickUp
    })

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
    this.storeModel.state = "";
    if (event.target.value) {
      this.fetchStates(event.target.value)
      this.storeModel.deliveryTypeChange = true;
      this.storeModel.sdSp = { dsp: [], loopLength: [], values: [], ids: [] };
      this.deliveryTypeChange("");
    } else {
      this.states = [];
    }
  }

  async fetchStates(regionId) {
    const data: any = await this.apiCalls.getStates(regionId);
    this.states = data.data.content;
    this.setState();
  }
  serviceChargesChange(event) {
    if (event.target.value > 100) {
      this.storeModel.serviceCharge = 100;
    } else if (event.key == "-") {
      this.storeModel.serviceCharge = 0;
    }
  }
  addStateCharges() {
    if (this.storeModel.stateCharges.length == 0) {
      this.storeModel.stateCharges = { stateCharges: [{ stateId: '', price: '' }], stateIds: [], deletedStateIds: [] }
      // this.storeModel.stateCharges.push({ stateId: '', price: '', stateIds: [] });
    } else if (this.storeModel.stateCharges.stateCharges.length < this.states.length) {
      this.storeModel.stateCharges.stateCharges.push({ stateId: '', price: '' });
    }
  }

  removeStateCharge(i) {
    // this.storeModel.stateCharges[0].stateIds[i] = "";
    const dbId = this.storeModel.stateCharges.stateCharges[i].dbId;
    if (dbId) {
      this.storeModel.stateCharges.deletedStateIds.push(dbId)
    }
    this.storeModel.stateCharges.stateIds[i] = "";
    this.storeModel.stateCharges.stateCharges.splice(i, 1)
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

  async updateStateDeliveryCharges() {
    for (var i = 0; i < this.storeModel.stateCharges.length; i++) {
      await this.apiCalls.updateStoreStateCharges({
        "delivery_charges": this.storeModel.stateCharges.stateCharges[i].price,
        "region_country_state_id": this.storeModel.stateCharges.stateCharges[i].stateId
      }, "")
    }
  }

  async setStateCharges() {
    var data: any = await this.apiCalls.getStoreStateCharges();
    data = data.data;
    const stateIds = [];
    for (var i = 0; i < data.length; i++) {
      this.storeModel.stateCharges.stateCharges.push({ dbId: data[i].id, stateId: data[i].region_country_state_id, price: data[i].delivery_charges });
      stateIds.push(data[i].region_country_state_id);
    }
    this.storeModel.stateCharges.stateIds = stateIds;
    this.storeModel.stateCharges.deletedStateIds = [];
  }

  async deleteStateCharges() {
    const deleteIds = this.storeModel.stateCharges.deletedStateIds;
    for (var i = 0; i < deleteIds.length; i++) {
      await this.apiCalls.deleteStateCharge(deleteIds[i]);
    }
  }

  async updateStateCharges() {
    const stateCharges = this.storeModel.stateCharges.stateCharges;
    for (var i = 0; i < stateCharges.length; i++) {
      if (this.storeModel.stateCharges.deletedStateIds.includes(stateCharges[i].dbId)) {
        continue;
      }
      if (stateCharges[i].dbId == undefined) {
        const data: any = await this.apiCalls.saveStoreStateCharges({
          "delivery_charges": this.storeModel.stateCharges.stateCharges[i].price,
          "region_country_state_id": this.storeModel.stateCharges.stateCharges[i].stateId
        })
        this.storeModel.stateCharges.stateCharges[i].dbId = data.data.id;
        continue;
      }
      await this.apiCalls.updateStoreStateCharges({
        "delivery_charges": stateCharges[i].price,
        "region_country_state_id": stateCharges[i].stateId
      }, stateCharges[i].dbId)
    }
  }

  async setStoreDeliveryProvider() {
    this.storeModel.region = this.store.regionCountryId;
    var data1: any = await this.apiCalls.getDeliveryServiceProviderByType(this.storeModel.deliveryType, this.storeModel.region);
    data1 = data1.data;
    for (var i = 0; i < data1.length; i++) {
      this.storeModel.sdSp.dsp.push(data1[i].provider);
    }
    var data2: any = await this.apiCalls.getStoreDeliveryServiceProvider();
    data2 = data2.data.content;
    for (var j = 0; j < data2.length; j++) {
      this.storeModel.sdSp.values.push(data2[j].deliverySpId);
      this.storeModel.sdSp.loopLength.push("0");
      this.storeModel.sdSp.ids.push(data2[j].id)
    }
  }

  async updateStoreDeliveryProvider() {
    if (this.storeModel.deliveryTypeChange) {
      await this.apiCalls.deleteStoreDeliveryProvidersAttachedtoStore()
    }
    for (var i = 0; i < this.storeModel.sdSp.loopLength.length; i++) {
      const data = await this.apiCalls.updateStoreDeliveryServiceProvider(this.storeModel.sdSp.values[i], this.storeModel.sdSp.ids[i])
    }
  }


  async deliveryTypeChange(event) {
    this.storeModel.deliveryTypeChange = true;
    this.storeModel.sdSp = { dsp: [], loopLength: [], values: [], ids: [] };
    if (this.storeModel.deliveryType == "SELF") {
      return;
    }
    else if (this.storeModel.deliveryType == "ADHOC") {
      this.storeModel.sdSp.loopLength.push("0");
    }
    this.fetchChangedDeliveryProviders();
  }

  async fetchChangedDeliveryProviders() {
    var data: any = await this.apiCalls.getDeliveryServiceProviderByType(this.storeModel.deliveryType, this.storeModel.region);
    data = data.data;
    if (data.length == 0) {
      this.storeModel.sdSp = { dsp: [], loopLength: [], values: [], ids: [] };
    }
    for (var i = 0; i < data.length; i++) {
      this.storeModel.sdSp.dsp.push(data[i].provider);
    }
  }

  addDeliveryServiceProvider() {
    if (this.storeModel.sdSp.loopLength.length < this.storeModel.sdSp.dsp.length) {
      this.storeModel.sdSp.loopLength.push("0");
      this.storeModel.sdSp.values.push("0");
    }
  }
  dpChange(event, j) {
    this.storeModel.sdSp.values[j] = event.target.value;
    this.storeModel.deliveryTypeChange = true;
  }

  imageSizeCheck(size) {
    return (size / 2048) > 1024 ? false : true;
  }

}