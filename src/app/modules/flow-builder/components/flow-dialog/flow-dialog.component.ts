import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiCallsService } from "src/app/services/api-calls.service";
export interface DialogData {
    title: string;
    description: string;
}

@Component({
    selector: 'flow-dialog',
    templateUrl: 'flow-dialog.component.html',
    styleUrls:["./flow-dialog.component.css"]
})

export class FlowDialog {
    title:any;
    description:any;
    constructor(private configService: ApiCallsService,
        public dialogRef: MatDialogRef<FlowDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
    createFlow(){
        // this.configService.getFlowId(this.title,this.description);
    }
}