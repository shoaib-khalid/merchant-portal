import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { MatDialog } from '@angular/material/dialog';
import $ from 'jquery';
@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.scss']
})
export class StorePageComponent implements OnInit {
  storeName: any;
  city: any = "";
  address: any = "";
  storeInfo: any = "";
  postCode: any = "";
  requiredError: any = false;
  logo: any = { file: "", preview: "" };
  banner: any = { file: "", preview: "" };

  constructor(private apiCalls: ApiCallsService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  async registerStore() {
    if (this.storeName) {
      this.apiCalls.loadingAnimation("Registering new store", "280")
      await this.saveDetails();
      this.uploadAssets();
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
        $(arr[i]).val('').css("border-color", "red");
        break;
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
      console.log(localStorage.getItem('storeId'))
      this.apiCalls.uploadStoreAssets(formData,localStorage.getItem('storeId'))
    }

  }

  saveDetails() {
    return this.apiCalls.registerStore({
      name: this.storeName.replace(/\s+/g, '-'),
      city: this.city,
      address: this.address,
      postCode: this.postCode,
      storeDescription: this.storeInfo,
      clientId: localStorage.getItem("ownerId")
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
    this.banner.file="";
    this.banner.preview = "";
  }
  deleteLogo() {
    this.logo.file="";
    this.logo.preview = "";
  }
}