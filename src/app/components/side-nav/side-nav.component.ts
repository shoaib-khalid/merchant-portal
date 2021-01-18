import { Component } from '@angular/core';
import { JsonCodec } from 'src/app/helpers/json-codec';
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
  title: any;
  triggerText: any;


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
    // JsonCodec.loadJson(Helper.v1);
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

  titleChange(text) {

    var strDigit;
    if (Helper.v1.div.firstChild.id) {
      strDigit = Helper.v1.div.firstChild.id;
    } else {
      strDigit = Helper.v1.div.firstChild.nextElementSibling.id;
    }

    const digit = Helper.digitFromString(strDigit);
    document.getElementById("header" + digit).textContent = text;
  }
  triggerTextChange(event, index) {
    // console.log(index)
    // console.log(event.target.value);
    // var arr = document.getElementsByClassName('btn btn-primary btn-block btn-lg')
    // arr[index].textContent = " " + event.target.value;
    Helper.v1.children[0].div.firstChild.outerText;
    // console.log(arr.length)
    // console.log(index)
  }

}