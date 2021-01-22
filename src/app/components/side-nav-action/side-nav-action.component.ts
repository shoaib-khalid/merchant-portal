import { Component } from '@angular/core';
import { JsonCodec } from 'src/app/helpers/json-codec';
import { Helper } from '../../helpers/graph-helper';
import { ApiCallsService } from '../../services/api-calls.service'
@Component({
    selector: 'side-nav-action',
    templateUrl: './side-nav-action.component.html',
    styleUrls: ['./side-nav-action.component.css']
})
export class SideNavAction {

    opened: boolean=false;
    requestsArray: any = [];
    pinned: boolean = false;
    title: any;
    triggerText: any;
    dataVariable: any = "";
    constructor(private apiCalls: ApiCallsService) { }

    titleChange($event) {

    }
    descriptionFocusOut($event) {

    }
    descriptionChange($event) {

    }
    triggerTextChange($event, i) {

    }

    triggerFocusOut($event, i) {

    }

    insertButton() {

    }

    handleClick($event) {
        if (this.opened) {
            this.opened = false;
        } else {
            this.opened = true;
        }
    }

    dataVariableFocusOut($event) {

    }

    toggle() {

    }

    pin() {

    }
    titleFocusOut($event) {

    }

    addRequest(){
        this.requestsArray.push("Add your request")
    }
}