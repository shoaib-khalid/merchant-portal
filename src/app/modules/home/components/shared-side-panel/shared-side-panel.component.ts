import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { AppConfig } from 'src/app/services/app.config.ts.service';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-shared-side-panel',
  templateUrl: './shared-side-panel.component.html',
  styleUrls: ['./shared-side-panel.component.css']
})
export class SharedSidePanelComponent implements OnInit {
  protected storeNames = AppConfig.settings.storeNames;

  storeDomain: any = "";
  allowed: any = true;
  constructor(private apiCalls: ApiCallsService,private router:Router) {

  }

  ngOnInit(): void {
    this.hideStoreIfInProdJson();
    this.loadStores()
  }

  openSubMenu() {
    // $('.submenu').toggle('visible');
    $('.submenu').toggle('slow');
  }
  openSubMenu2() {
    // $('.submenu2').toggle('visible');
    $('.submenu2').toggle('slow');
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
}
