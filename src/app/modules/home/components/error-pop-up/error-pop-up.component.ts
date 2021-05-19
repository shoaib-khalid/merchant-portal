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
  error: any;
  msgs: any = [];
  constructor(public dialogRef: MatDialogRef<ErrorPopUpComponent>, @Inject(MAT_DIALOG_DATA) public data:
    {
      data: any;
    }, private router: Router) {
    this.error = data.data;
  }

  ngOnInit(): void {
    this.setErrorMsg();
  }

  setErrorMsg() {
    if (this.error.error.data) {
      const errors = this.error.error.data;
      for (var i = 0; i < errors.length; i++) {
        this.msgs.push(errors[i])
      }
    } else {
      this.msgs.push(this.error.message);
    }
  }

  close() {
    HttpConfigInterceptor.error = null;
    this.dialogRef.close();
    if (this.error.status == 401) {
      localStorage.clear();
      this.router.navigateByUrl('/signin')
    }
  }
}
