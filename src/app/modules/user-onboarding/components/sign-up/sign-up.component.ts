import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private apiCalls: ApiCallsService) { }
  name: string = '';
  username: string = '';
  email: string = '';
  password: any = '';
  storeName: any = '';


  ngOnInit(): void {
  }


  createAccount(event) {
    const data = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      storeName: this.storeName,
      roleId: "STORE_OWNER"
    }
    console.log(
      data
    )
    if (data.name && data.username && data.email && data.password && data.storeName && data.roleId) {
      this.apiCalls.registerClient(data)
    } else {
      alert("please enter all details")
    }
  }

}
