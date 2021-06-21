import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { AppConfig } from 'src/app/services/app.config.ts.service';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-shared-side-panel',
  templateUrl: './shared-side-panel.component.html',
  styleUrls: ['./shared-side-panel.component.css']
})
export class SharedSidePanelComponent implements OnInit {
  protected storeNames = AppConfig.settings.storeNames;

  storeDomain:any="";
  allowed:any=true;
  constructor(private apiCalls:ApiCallsService) { 
    
  }

  ngOnInit(): void {
    this.hideStoreIfInProdJson();
    this.loadStores()
  }

  openSubMenu() {
    $('.submenu').toggle('visible');
  }
  openSubMenu2() {
    $('.submenu2').toggle('visible');
  }

  hideStoreIfInProdJson(){
    if(this.storeNames.includes(localStorage.getItem('store'))){
      this.allowed=false;
    }
  }

  async loadStores() {
    if (localStorage.getItem("storeId")) {
      const data: any = await this.apiCalls.getStoreDetails(localStorage.getItem('storeId'));
      this.storeDomain=data.data.domain
    }

  }

}
