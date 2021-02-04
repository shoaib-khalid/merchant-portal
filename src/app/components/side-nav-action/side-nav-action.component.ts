import { Component } from '@angular/core';
import { JsonCodec } from 'src/app/helpers/json-codec';
import { MatDialog } from '@angular/material/dialog';
import { Helper } from '../../helpers/graph-helper';
import { ApiCallsService } from '../../services/api-calls.service'
import { HelperService } from '../../services/helper.service'
import { ActionDialog } from '../action-dialog/action-dialog.component';

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
    constructor(private apiCalls: ApiCallsService, private helperService: HelperService, public dialog: MatDialog) {
    }

    titleChange(text) {
        var strDigit = this.getStrDigit();
        const digit = Helper.digitFromString(strDigit);
        document.getElementById("header" + digit).textContent = text;
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
                this.opened = true;
                console.log(event.target.id)
            } else if (event.target.localName === "svg") {
                if (this.pinned === false) {
                    this.opened = false;
                }
            }
        } else {
            this.opened = false;
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
    getStrDigit() {
        if (Helper.v1.div.firstChild.id) {
            return Helper.v1.div.firstChild.id;
        } else {
            return Helper.v1.div.firstChild.nextElementSibling.id;
        }
    }

    openActionDialog(event, i) {
        const dialogRef = this.dialog.open(ActionDialog, {
            data: { title: "", description: "" }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }
}