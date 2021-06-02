import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {

  storeName: any;
  storeInfo: any;
  region: any = "";
  regions: any = [];
  address: any;
  city: any;
  postCode: any;
  logo: any = { file: "", preview: "" }
  banner: any = { file: "", preview: "" };
  store: any;
  closeTime: any = "";
  openTime: any = "";
  timmings: any = [];
  public Editor = ClassicEditor;

  constructor(private apiCalls: ApiCallsService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    $("#warning-address").hide();
    $("#warning-postcode").hide();
    $("#store-timmings-table").hide();

    this.route.params.subscribe(params => {
      if (params.id) {
        this.loadStore(params.id)
      }
    });
  }

  async loadStore(id) {
    this.store = await this.apiCalls.getStoreDetails(id);
    this.store = this.store.data;
    this.setAssets();
    this.setTextualDetails();
    this.fetchRegions();
    this.setStoreTimmings(id);
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

  async update() {
    this.apiCalls.loadingAnimation("Updating..")
    await this.updateTextualDetails();
    await this.updateAssets();
    await this.updateStoreTimmings(this.store.id)
    this.apiCalls.loadingdialogRef.close();
  }

  setTextualDetails() {
    this.storeName = this.store.name;
    this.storeInfo = this.store.storeDescription;
    this.address = this.store.address;
    this.city = this.store.city;
    this.postCode = this.store.postcode;
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
      "address": this.address,
      "city": this.city,
      "clientId": localStorage.getItem('ownerId'),
      "name": this.storeName,
      "postcode": this.postCode,
      "storeDescription": this.storeInfo,
      "region": this.region
    }
    return this.apiCalls.updateStore(store, this.store.id)
  }

  async updateAssets() {
    const formData = new FormData();
    if (this.banner.file && this.logo.file) {
      formData.append("banner", this.banner.file);
      formData.append("logo", this.logo.file);
      return this.apiCalls.uploadStoreAssets(formData, this.store.id)
    }
    else {
      this.deleteAssets();
    }
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
    if (this.banner.delete || this.logo.delete) {
      await this.apiCalls.deleteStoreAssets(this.store.id);
      this.apiCalls.loadingdialogRef.close();
    }
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
    this.region = this.store.regionCountryId;
    if (this.region == null) {
      this.region = "";
    }
  }

  async setStoreTimmings(storeId) {
    var data: any = await this.apiCalls.getStoreTimmings(storeId);
    data = data.data;
    for (var j = 0; j < data.length; j++) {
      this.timmings.push({ day: data[j].day, isOff: data[j].isOff, openTime: data[j].openTime, closeTime: data[j].closeTime })
    }
    console.log(data)
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

  async updateStoreTimmings(storeId) {
    var promise = new Promise(async (resolve, reject) => {
      for (var j = 0; j < this.timmings.length; j++) {
        const data = await this.apiCalls.updateStoreTimmings({
          "closeTime": this.timmings[j].closeTime,
          "openTime": this.timmings[j].openTime,
          "isOff": this.timmings[j].isOff
        }, this.timmings[j].day, storeId)
        console.log(data)
      }
      resolve("");
    });
    return promise;

  }

}