import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpConfigInterceptor } from 'src/app/services/httpconfig.interceptor';
@Component({
  selector: 'app-error-pop-up',
  templateUrl: './error-pop-up.component.html',
  styleUrls: ['./error-pop-up.component.css']
})
export class ErrorPopUpComponent implements OnInit {
  status: any;
  msg: any;
  constructor(public dialogRef: MatDialogRef<ErrorPopUpComponent>, @Inject(MAT_DIALOG_DATA) public data:
    {
      status: any;
    }, private router: Router) {
    this.status = data.status;
  }

  ngOnInit(): void {
    this.setErrorMsg();
  }

  setErrorMsg() {
    switch (this.status) {
      case 500:
        this.msg = `An internal Server Error Occured`
        break;
      case 401:
        this.msg = `You are not authorized to access the account`
        break;
      default:
        this.msg = 'Error Status code: ' + this.status
    }
  }
  close() {
    HttpConfigInterceptor.error = null;
    this.dialogRef.close();
    if (this.status == 401) {
      localStorage.clear();
      this.router.navigateByUrl('/signin')
    }
  }
}
