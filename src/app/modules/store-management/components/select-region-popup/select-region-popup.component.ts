import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from 'src/app/modules/flow-builder/components/flow-dialog/flow-dialog.component';

@Component({
  selector: 'app-select-region-popup',
  templateUrl: './select-region-popup.component.html',
  styleUrls: ['./select-region-popup.component.css']
})
export class SelectRegionPopupComponent implements OnInit {
  country:any="";
  constructor(public dialogRef: MatDialogRef<SelectRegionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }
  selectCountry() {
    this.dialogRef.close();
  }
}
