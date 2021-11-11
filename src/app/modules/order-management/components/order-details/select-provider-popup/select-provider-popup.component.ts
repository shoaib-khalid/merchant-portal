import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from 'src/app/modules/flow-builder/components/flow-dialog/flow-dialog.component';

@Component({
  selector: 'app-select-provider-popup',
  templateUrl: './select-provider-popup.component.html',
  styleUrls: ['./select-provider-popup.component.css']
})
export class SelectProviderPopupComponent implements OnInit {

  country:any="";
  image:any;
  showButton: boolean = false;
  date: string;
  mindate: string;
  time: string;
  mintime: string;

  constructor(
    public dialogRef: MatDialogRef<SelectProviderPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {

    let today = new Date();
    let yy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate()).padStart(2, '0');
    this.mindate = yy + '-' + mm + '-' + dd;

    this.image = {
      src: this.data["data"].providerImage,
      atl: this.data["data"].name
    };
  }

  setPickupDateTime() {
    this.dialogRef.close({date:this.date, time:this.time});
  }

  cancelPickupDateTime(){
    this.dialogRef.close("cancelled");
  }
  
  checkDate(){
    if (!this.date || !this.time) {

    } else {
      this.showButton = true;
    }
  }

  checkTime(){
    if (!this.date || !this.time) {
      
    } else {
      this.showButton = true;
    }
  }
}
