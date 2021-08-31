import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service.ts.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  username: any = '';
  password: any = '';
  error: any = "";
  rememberMe: any = true;
  showError: Boolean = false;
  constructor(private apiCalls: ApiCallsService, private authGuardService: AuthGuardService) { }

  ngOnInit(): void {
  }

  async authenticateClient() {
    const data = {
      username: this.username,
      password: this.password
    }
    var redirectUrl = this.authGuardService.redirectUrl;
    this.authGuardService.redirectUrl = null;
    if (this.username && this.password) {
      this.apiCalls.loadingAnimation("Logging in")
      this.apiCalls.authenticateClient(
        data,
        this.rememberMe,
        redirectUrl);
    } else {
      this.showError_('Please enter all details')
    }
  }

  showError_(error) {
    this.error = error;
    this.showError = true;
  }

}
