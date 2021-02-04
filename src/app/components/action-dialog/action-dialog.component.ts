import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiCallsService } from "../../services/api-calls.service";
export interface DialogData {
    title: string;
    description: string;
}

@Component({
    selector: 'action-dialog',
    templateUrl: 'action-dialog.component.html',
    styleUrls: ["./action-dialog.component.css"]
})

export class ActionDialog {
    title: any;
    url: any;
    vheader: boolean = true;
    vbody: boolean = false;
    vresponse: boolean = false;
    vrespMapping: boolean = false;
    reqheaders: any = [{ key: "", value: "" }];
    bodyText: any = ""
    reqMapping: any = [{ jsonPath: "", customField: "", option: "" }]

    constructor(private configService: ApiCallsService,
        public dialogRef: MatDialogRef<ActionDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
    openExternalRequestForm() {

    }

    headers() {
        this.setTopTextColorToBlack();
        this.setAlltoFalse();
        this.vheader = true;
        document.getElementById("headerText").style.color = "blue";

    }

    body() {
        this.setTopTextColorToBlack();
        this.setAlltoFalse();
        this.vbody = true;
        document.getElementById("bodyText").style.color = "blue";
    }

    response() {
        this.setAlltoFalse();
        this.vresponse = true;
    }

    respMapping() {
        this.setTopTextColorToBlack();
        this.setAlltoFalse();
        this.vrespMapping = true;
        document.getElementById("responseMappingText").style.color = "blue";

    }
    setAlltoFalse() {
        this.vheader = false;
        this.vbody = false;
        this.vresponse = false;
        this.vrespMapping = false;
    }
    addReqHeader() {
        this.reqheaders.push([{ key: "", value: "" }])
    }
    keyChange(event, i) {
        this.reqheaders[i].key = event.target.value;
    }
    valueChange(event, i) {
        this.reqheaders[i].value = event.target.value;

    }
    addRequestMapping() {
        this.reqMapping.push({ jsonPath: "", customField: "", option: "" })
    }
    jsonPathChange(event, i) {
        this.reqMapping[i].jsonPath = event.target.value;

    }
    customFieldChange(event, i) {
        this.reqMapping[i].customField = event.target.value;

    }

    setTopTextColorToBlack() {
        var text: any = document.getElementsByClassName("elements");
        for (var i = 0; i < text.length; i++) {
            text[i].style.color = "black";
        }
    }
}