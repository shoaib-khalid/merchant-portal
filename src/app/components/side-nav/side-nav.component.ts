import { Component } from '@angular/core';
import {Helper} from '../../helpers/graph-helper';
@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNav {
  opened: boolean;
  buttonsArray: any = [];

  toggle() {
    if (this.opened) {
      this.opened = false;
      this.buttonsArray = [];
    } else {
      try {
        for (var i = 0; i < Helper.v1.children.length; i++) {
          this.buttonsArray.push("test")
        }
      } catch (ex) {

      }
      console.log(this.buttonsArray)
      this.opened = true;
    }
  }

  insertButton() {
    this.buttonsArray.push("New Button #" + (this.buttonsArray.length + 1));
    Helper.addTriggerUsingSidePanel();
  }
}