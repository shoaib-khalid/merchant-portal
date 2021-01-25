import { Component } from '@angular/core';
import { JsonCodec } from 'src/app/helpers/json-codec';
import { Helper } from '../../helpers/graph-helper';
import { ApiCallsService } from '../../services/api-calls.service'
import { HelperService } from '../../services/helper.service'

@Component({
    selector: 'side-nav-action',
    templateUrl: './side-nav-action.component.html',
    styleUrls: ['./side-nav-action.component.css']
})
export class SideNavAction {

    opened: boolean = false;
    requestsArray: any = [];
    pinned: boolean = false;
    title: any;
    triggerText: any;
    dataVariable: any = "";
    constructor(private apiCalls: ApiCallsService, private helperService: HelperService) { }

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

    handleClick(event) {

        if (this.helperService.vertexClicked() === "ACTION") {
            if (event.target.id.includes("header") || event.target.id.includes("card")) {

                if (this.opened) {
                    this.opened = false;
                } else {
                    this.opened = true;
                }
            }else{
                this.opened=false;
            }
        }else{
            this.opened=false;
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

    addRequest() {
        this.requestsArray.push("Add your request")
    }
}