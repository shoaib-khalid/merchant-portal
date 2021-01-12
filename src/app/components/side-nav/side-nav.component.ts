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
  pinned: boolean = false;

  constructor() { }

  toggle() {
    if (this.opened) {
      if (Helper.isVertex) {
        this.buttonsArray = [];
        try {
          for (var i = 0; i < Helper.v1.children.length; i++) {
            this.buttonsArray.push("test")
          }
        } catch (ex) {
          // console.log(ex)
        }
      }

    } else {
      this.opened = true;
    }
  }

  insertButton() {
    this.buttonsArray.push("test");
    Helper.addTriggerUsingSidePanel();
  }

  pin() {
    if (this.pinned) {
      this.pinned = false;
      alert("Unpinned")
    } else {
      this.pinned = true;
      alert("Pinned")
    }
  }

  handleClick(event) {

    if (event.target.id.includes("card-header")) {
      this.toggle();
    } else if (event.target.localName === "svg") {
      if (this.pinned === false) {
        this.opened = false;
      }
    }
  }


}