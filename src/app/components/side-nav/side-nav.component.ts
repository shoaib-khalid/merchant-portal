import { Component } from '@angular/core';
import { Helper } from '../../helpers/graph-helper';
@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNav {
  opened: boolean;
  buttonsArray: any = [];

  constructor() {

  }

  toggle() {
    if (this.opened) {
      if (!Helper.isVertex) {
        this.opened = false;

      } else {
        this.buttonsArray = [];
        try {
          for (var i = 0; i < Helper.v1.children.length; i++) {
            this.buttonsArray.push("test")
          }
        } catch (ex) {
          console.log(ex)
        }
      }

    } else {
      try {
        for (var i = 0; i < Helper.v1.children.length; i++) {
          this.buttonsArray.push("test")
        }
      } catch (ex) {
        console.log(ex)
      }

      this.opened = true;
    }
  }

  insertButton() {
    this.buttonsArray.push("New Button #" + (this.buttonsArray.length + 1));
    Helper.addTriggerUsingSidePanel();
  }


}