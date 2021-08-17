import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service'

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
    }, private router: Router, private apiCalls: ApiCallsService) {
    this.error = data.data;
  }

  ngOnInit(): void {
    this.setErrorMsg();
  }

  setErrorMsg() {
    try {
      if (this.error.error.data) {
        const errors = this.error.error.data;
        for (var i = 0; i < errors.length; i++) {
          this.msgs.push(errors[i])
        }
      } else {
        if (this.error.message.includes("authenticate") && this.error.status == "401") {
          this.msgs.push("Wrong credentials, make sure you type correctly or hit Forgot password");
        } else if (this.error.status == "401") {
          this.msgs.push("Your session has expired. Please login again, Thank you.");
        } else if (this.error.status == "500") {
          this.msgs.push("Sorry your request cannot be completed, please try again later or contact help@symplified.biz if problem persist")
        }else{
          // console.log(this.error)
          this.msgs.push(this.error.message)

        }
      }
    } catch (ex) {
      this.msgs.push(this.error);

    }
  }

  close() {
    // HttpConfigInterceptor.error = null;
    this.dialogRef.close();
    if (this.apiCalls.loadingdialogRef) {
      this.apiCalls.loadingdialogRef.close();
    }
    if (this.error.status == 401) {
      localStorage.clear();
      this.router.navigateByUrl('/signin')
    }
  }
}
