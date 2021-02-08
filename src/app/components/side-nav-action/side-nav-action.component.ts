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


    constructor(private apiCalls: ApiCallsService, private helper: Helper, private helperService: HelperService, public dialog: MatDialog) {
    }

    titleChange(text) {
        var strDigit = this.getStrDigit();
        const digit = this.helper.digitFromString(strDigit);
        document.getElementById("header" + digit).textContent = text;
    }

    removeRequest(i) {
        this.helperService.fetchExternalRequests().splice(i, 1);
        this.requestsArray.splice(i, 1);
        this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(this.helper.v1))

    }

    handleClick(event) {

        if (this.helperService.vertexClicked() === "ACTION") {
            if (event.target.id.includes("header") || event.target.id.includes("card")) {
                var id = event.target.id;
                var text = (<HTMLInputElement>document.getElementById("header" + id.match(/\d/g)[0])).innerHTML;
                (<HTMLInputElement>document.getElementById("vertex-action-title")).value = text;
                this.opened = true;
                this.updateSidePanelWithButtons();
            } else if (event.target.localName === "svg") {
                if (this.pinned === false) {
                    this.opened = false;
                }
            }
        } else {
            this.opened = false;
        }
    }


    toggle() {

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
    titleFocusOut($event) {
        this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(this.helper.v1))
    }

    addRequest() {
        this.requestsArray.push("Add your request");
        this.insertIntoExternalRequests();
        this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(this.helper.v1))

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
        if (this.helperService.fetchExternalRequests()[i]) {
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
                this.helperService.setExternalRequest({
                
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
                }, i)
                this.apiCalls.autoSaveUpdate(JsonCodec.getIndividualJson(this.helper.v1))


            }

        });

    }

    requestParameters(flag, i) {
        var data;
        const externalRequests = this.helperService.fetchExternalRequests();

        if (flag) {
            data = {
                reqType: externalRequests[i].externalRequest.httpMethod,
                url: externalRequests[i].externalRequest.url,
                reqheaders: externalRequests[i].externalRequest.headers,
                bodyFormat: externalRequests[i].externalRequest.body.format,
                bodyText: externalRequests[i].externalRequest.body.payload,
                reqMapping: externalRequests[i].externalRequest.response.mapping,
                responseMappingFormat: externalRequests[i].externalRequest.response.format
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

        this.helperService.insertExternalRequest({
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
        const externalRequests = this.helperService.fetchExternalRequests();
        this.requestsArray = [];

        for (var i = 0; i < externalRequests.length; i++) {
            if (this.requestsArray[i]) {
                this.requestsArray[i] = externalRequests[i].externalRequest.url;
            } else {
                this.requestsArray.push(externalRequests[i].externalRequest.url)
            }
        }
    }
}