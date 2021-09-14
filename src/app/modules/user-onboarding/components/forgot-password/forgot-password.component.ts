import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  fgForm: FormGroup;
  fp: boolean = true;
  id: any = "";
  code: any = "";
  password: any = "";
  constructor(private fb: FormBuilder, private apiCalls: ApiCallsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkForParams();
  }


  async onSubmit() {
    if (this.fgForm.status == "VALID") {
      this.resetPassword();
    }
  }

  async resetPassword() {
    this.apiCalls.loadingAnimation("Verifying Email...")
    const data: any = await this.apiCalls.resetPassword(this.fgForm.get('email').value);
    if (data.status == 200) {
      this.apiCalls.loadingdialogRef.close();
      this.apiCalls.successPopUp('Check your email to reset your password', 2000);
      setTimeout(() => {
        location.href = "https://symplified.biz/merchant/signin"
      }, 2000)
    }
  }

  checkForParams() {
    this.route.queryParams.subscribe(params => {
      if (params['id'] && params['code']) {
        this.fp = false;
        this.id = params['id'];
        this.code = params['code'];
      } else {
        this.setFormGroup();
      }
    });
  }

  async updatePassword() {
    const data: any = await this.apiCalls.newPassword(this.id, this.code, { password: this.password })
    if (data.status = 202) {
      this.passwordHasBeenReset();
    }
  }

  setFormGroup() {
    this.fgForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  resetNewPassword() {
    this.updatePassword();
  }

  passwordHasBeenReset() {
    this.apiCalls.successPopUp('Password reset successfully.')
    setTimeout(() => {
      location.href = "https://symplified.biz/merchant/signin"
    }, 1200)
  }
}

