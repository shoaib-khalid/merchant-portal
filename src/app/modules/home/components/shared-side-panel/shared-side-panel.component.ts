import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
@Component({
  selector: 'app-shared-side-panel',
  templateUrl: './shared-side-panel.component.html',
  styleUrls: ['./shared-side-panel.component.css']
})
export class SharedSidePanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openSubMenu() {
    $('.submenu').toggle('visible');
  }

}
