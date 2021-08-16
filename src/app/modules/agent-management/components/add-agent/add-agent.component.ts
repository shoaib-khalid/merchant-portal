import { Component, OnInit } from '@angular/core';
import { Agent } from '../agent.model';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {

  AGENT = new Agent('','','','',localStorage.getItem("store"),'','','','')
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.setStoreDomain();

  }



  createAccount(form) {
    const data = {
      name: this.AGENT.name,
      username: `${this.AGENT.username}-${this.AGENT.storeDomain}`,
      email: this.AGENT.email,
      password: this.AGENT.password,
      storeId: localStorage.getItem('storeId'),
      roleId: this.AGENT.roleId
    }
    console.log(form)
    if (form.valid) {
      if (this.validateEmail(this.AGENT.email)) {
        if (this.usernameIsValid()) {
          this.apiCalls.loadingAnimation("Adding Agent")
          this.apiCalls.registerClient(data)
        }
      } else {
        this.AGENT.errorText = "Wrong Email Format"
        this.AGENT.showError = true;

      }
    } else {
      this.AGENT.errorText = "Please enter all details"
      this.AGENT.showError = true;
    }
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  usernameIsValid() {
    if (/^[0-9a-zA-Z_.-]+$/.test(this.AGENT.username)) {
      return true;
    } else {
      this.AGENT.errorText = "Username Invalid"
    }
  }


  async setStoreDomain() {
    const data: any = await this.apiCalls.getStoreDetails(localStorage.getItem('storeId'));
    this.AGENT.storeDomain = data.data.domain
  }
}
