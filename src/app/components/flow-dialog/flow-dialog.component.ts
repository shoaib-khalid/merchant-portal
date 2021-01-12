import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    
    constructor(
        public dialogRef: MatDialogRef<FlowDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
    createFlow(){
        alert("Sent")
    }
}