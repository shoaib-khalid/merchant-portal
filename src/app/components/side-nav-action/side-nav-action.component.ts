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
    externalRequests: any = [];


    constructor(private apiCalls: ApiCallsService,private helper:Helper, private helperService: HelperService, public dialog: MatDialog) {
    }

    titleChange(text) {
        var strDigit = this.getStrDigit();
        const digit = this.helper.digitFromString(strDigit);
        document.getElementById("header" + digit).textContent = text;
    }


    handleClick(event) {

        if (this.helperService.vertexClicked() === "ACTION") {
            if (event.target.id.includes("header") || event.target.id.includes("card")) {
                var id = event.target.id;
                var text = (<HTMLInputElement>document.getElementById("header" + id.match(/\d/g)[0])).innerHTML;
                (<HTMLInputElement>document.getElementById("vertex-action-title")).value = text;
                this.opened = true;
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
        this.insertIntoExternalRequests()
    }
    getStrDigit() {
        if (this.helper.v1.div.firstChild.id) {
            return this.helper.v1.div.firstChild.id;
        } else {
            return this.helper.v1.div.firstChild.nextElementSibling.id;
        }
    }

    openActionDialog(event, i) {
        var data;
        if (this.externalRequests[i]) {
            data = this.requestParameters(true, i);
        } else {
            data = this.requestParameters(false, i);
        }
        const dialogRef = this.dialog.open(ActionDialog, {
            data: data

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this.requestsArray[i] = result[1];

                this.externalRequests[i] = {
                    type: "EXTERNAL_REQUEST",
                    externalRequest: {
                        url: result[1],
                        headers: result[2]
                        ,
                        httpMethod: result[0],
                        body: {
                            format: result[3],
                            payload: result[4]
                        },
                        response: {
                            format: result[6],
                            mapping: result[5]
                        },
                        errorStep: {
                            actionType: "vertex",
                            targetId: {
                                "$oid": "5fec54f9964cb3407cb3b918"
                            }
                        }
                    }
                }

            }

        });

    }

    requestParameters(flag, i) {
        var data;
        if (flag) {
            data = {
                reqType: this.externalRequests[i].externalRequest.httpMethod,
                url: this.externalRequests[i].externalRequest.url,
                reqheaders: this.externalRequests[i].externalRequest.headers,
                bodyFormat: this.externalRequests[i].externalRequest.body.format,
                bodyText: this.externalRequests[i].externalRequest.body.payload,
                reqMapping: this.externalRequests[i].externalRequest.response.mapping,
                responseMappingFormat: this.externalRequests[i].externalRequest.response.format
            }
        } else {
            data = {
                reqType: "",
                url: "",
                reqheaders: [{ key: "", value: "" }],
                bodyFormat: "",
                bodyText: "",
                reqMapping: [{ jsonPath: "", customField: "", optional: "" }],
                responseMappingFormat: ""
            }
        }
        return data;
    }

    insertIntoExternalRequests() {

        this.externalRequests.push({
            type: "EXTERNAL_REQUEST",
            externalRequest: {
                url: "",
                headers: [{ key: "", value: "" }]
                ,
                httpMethod: "",
                body: {
                    format: "",
                    payload: ""
                },
                response: {
                    format: "",
                    mapping: [{ jsonPath: "", customField: "", optional: "" }]
                },
                errorStep: {
                    actionType: "vertex",
                    targetId: {
                        "$oid": "5fec54f9964cb3407cb3b918"
                    }
                }
            }
        })
    }

    updateSidePanelWithButtons() {
        
    }
}