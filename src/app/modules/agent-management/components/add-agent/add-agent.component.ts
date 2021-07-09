import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {
  name: string = '';
  username: string = '';
  email: string = '';
  password: any = '';
  storeName: any = '';
  showError: any = '';
  errorText = "";
  roleId: any = "";
  storeDomain: any = "";
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.setStoreDomain();
  }



  createAccount(event) {
    debugger
    const data = {
      name: this.name,
      username: `${this.username}-${this.storeDomain}`,
      email: this.email,
      password: this.password,
      storeId: localStorage.getItem('storeId'),
      roleId: this.roleId
    }
    console.log(data)
    if (data.name && data.username && data.email && data.password && data.roleId) {
      if (this.validateEmail(this.email)) {
        if (this.usernameIsValid()) {
          this.apiCalls.loadingAnimation("Adding Agent")
          this.apiCalls.registerClient(data)
        }
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
  usernameIsValid() {
    if (/^[0-9a-zA-Z_.-]+$/.test(this.username)) {
      return true;
    } else {
      this.errorText = "Username Invalid"
    }
  }


  async setStoreDomain() {
    const data: any = await this.apiCalls.getStoreDetails(localStorage.getItem('storeId'));
    this.storeDomain = data.data.domain
  }
}
