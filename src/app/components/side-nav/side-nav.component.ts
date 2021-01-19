import { Component } from '@angular/core';
import { JsonCodec } from 'src/app/helpers/json-codec';
import { Helper } from '../../helpers/graph-helper';
import { ApiCallsService } from '../../services/api-calls.service'
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


  constructor(private apiCalls: ApiCallsService) { }

  toggle() {
    if (this.opened) {
      if (Helper.isVertex) {
        this.buttonsArray = [];
        try {
          for (var i = 0; i < Helper.v1.children.length; i++) {
            this.buttonsArray.push("New Button")
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
    this.buttonsArray.push("New Button");
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

    var strDigit = this.getStrDigit();
    const digit = Helper.digitFromString(strDigit);
    document.getElementById("header" + digit).textContent = text;

  }
  triggerTextChange(event, index) {
    var strDigit = this.getStrDigit();
    const digit = Helper.digitFromString(strDigit);
    var arr = document.getElementsByClassName('customTrigger' + digit);
    arr[index].textContent = " " + event.target.value;

  }


  getStrDigit() {
    if (Helper.v1.div.firstChild.id) {
      return Helper.v1.div.firstChild.id;
    } else {
      return Helper.v1.div.firstChild.nextElementSibling.id;
    }


  }

  triggerFocusOut(event, i) {
    this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1.children[i]))


  }

  titleFocusOut(event) {
    this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1))

  }

  descriptionFocusOut(event) {

    this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(Helper.v1))
 

  }

  descriptionChange(event) {
    var strDigit = this.getStrDigit();
    const digit = Helper.digitFromString(strDigit);
    document.getElementById("initial-message" + digit).textContent = event.target.value;
  }

}