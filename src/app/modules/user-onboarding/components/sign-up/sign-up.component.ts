import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private apiCalls: ApiCallsService,private router:Router) { }
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
 
    if (data.name && data.username && data.email && data.password && data.storeName && data.roleId) {
      if(this.validateEmail(this.email)){
      this.router.navigateByUrl('/products/add');
      this.apiCalls.registerClient(data)
      }else{
        alert("Wrong email format")
      }
    } else {
      alert("please enter all details")
    }
  }

  validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

}
