import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private apiCalls: ApiCallsService, private router: Router) { }
  name: string = '';
  username: string = '';
  email: string = '';
  password: any = '';
  storeName: any = '';
  showError: any = '';
  errorText = "";
  ngOnInit(): void {
  }


  createAccount(event) {
    const data = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      roleId: "STORE_OWNER"
    }

    if (data.name && data.username && data.email && data.password && data.roleId) {
      if (this.validateEmail(this.email)) {
        this.apiCalls.registerClient(data)
        this.apiCalls.successPopUp("Signed Up Successfuflly",1900)
      } else {
        this.errorText = "Wrong Email Format"
        this.showError = true;

      }
    } else {
      this.errorText = "Please enter all details"
      this.showError = true;
    }
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

}
