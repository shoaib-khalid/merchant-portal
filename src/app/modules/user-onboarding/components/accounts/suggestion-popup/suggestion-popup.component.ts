import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-suggestion-popup',
  templateUrl: './suggestion-popup.component.html',
  styleUrls: ['./suggestion-popup.component.css']
})
export class SuggestionPopupComponent implements OnInit {
  title: any = "";
  message: any = "";
  constructor(public dialogRef: MatDialogRef<SuggestionPopupComponent>, @Inject(MAT_DIALOG_DATA) public data:
    {
      title: any;
      message: any;
    }) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}
