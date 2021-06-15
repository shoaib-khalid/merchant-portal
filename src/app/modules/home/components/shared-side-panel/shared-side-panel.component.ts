import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { AppConfig } from 'src/app/services/app.config.ts.service';

@Component({
  selector: 'app-shared-side-panel',
  templateUrl: './shared-side-panel.component.html',
  styleUrls: ['./shared-side-panel.component.css']
})
export class SharedSidePanelComponent implements OnInit {
  protected storeNames = AppConfig.settings.storeNames;

  onlineStore:any="";
  allowed:any=true;
  constructor() { 
    
  }

  ngOnInit(): void {
    this.onlineStore=localStorage.getItem('storeId')
    this.hideStoreIfInProdJson();
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

}
