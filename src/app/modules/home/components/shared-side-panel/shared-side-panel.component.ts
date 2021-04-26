import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
@Component({
  selector: 'app-shared-side-panel',
  templateUrl: './shared-side-panel.component.html',
  styleUrls: ['./shared-side-panel.component.css']
})
export class SharedSidePanelComponent implements OnInit {

  onlineStore:any="";
  constructor() { }

  ngOnInit(): void {
    // this.onlineStore = localStorage.getItem('store').replace(/\s+/g, '-').toLowerCase();
    this.onlineStore=localStorage.getItem('storeId')
  }

  newPageStore(url){
    window.open(url+this.onlineStore, "_blank");
  }
  openSubMenu() {
    $('.submenu').toggle('visible');
  }

}
