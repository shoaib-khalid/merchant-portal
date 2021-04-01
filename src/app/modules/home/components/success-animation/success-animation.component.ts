import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-animation',
  templateUrl: './success-animation.component.html',
  styleUrls: ['./success-animation.component.scss']
})
export class SuccessAnimationComponent implements OnInit {
  message:any;
  constructor(public dialogRef: MatDialogRef<SuccessAnimationComponent>, @Inject(MAT_DIALOG_DATA) public data:
    {
      message: any;
    }) { this.message=data.message}

  ngOnInit(): void {
  }

}
