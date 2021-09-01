import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { AppConfig } from 'src/app/services/app.config.ts.service';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-shared-side-panel',
  templateUrl: './shared-side-panel.component.html',
  styleUrls: ['./shared-side-panel.component.css']
})
export class SharedSidePanelComponent implements OnInit {
  protected storeNames = AppConfig.settings.storeNames;

  storeDomain: any = "";
  allowed: any = true;
  constructor(private apiCalls: ApiCallsService, private router: Router) {

  }

  ngOnInit(): void {
    this.hideStoreIfInProdJson();
    this.loadStores()
  }

  openSubMenu() {
    $('.submenu').toggle('slow');
  }
  openSubMenu2() {
    $('.submenu2').toggle('slow');
  }
  openSocialMediaSubMenu() {
    $('.social-media-submenu').toggle('slow');
  }
  openCsMenu(){
    $('.customer-support-submenu').toggle('slow')
  }

  hideStoreIfInProdJson() {
    if (this.storeNames.includes(localStorage.getItem('store'))) {
      this.allowed = false;
    }
  }

  async loadStores() {
    if (localStorage.getItem("storeId")) {
      const data: any = await this.apiCalls.getStoreDetails(localStorage.getItem('storeId'));
      this.storeDomain = data.data.domain
    }

  }

  storeSettings() {
    this.router.navigateByUrl(`/stores/${localStorage.getItem('storeId')}`)
  }

  openOrders() {
    var toDate: any = document.getElementsByClassName('filter')[3];
    var fromDate: any = document.getElementsByClassName('filter')[2];
    toDate = new Date().toISOString().replace(/T.*/, '').split('-').join('-');
    fromDate = new Date().toISOString().replace(/T.*/, '').split('-').join('-');
    this.router.navigate(['orders'], { queryParams: { 'receiverName': '', 'phoneNumber': '','from':'','to':'',completionStatus:'PAYMENT_CONFIRMED' } });
  }
}
