import { Component, OnInit } from '@angular/core';
import {ApiCallsService} from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  username:any='';
  password:any='';

  constructor(private apiCalls:ApiCallsService) { }

  ngOnInit(): void {
  }

  authenticateClient(){
    const data ={
      username:this.username,
      password:this.password
    }
    console.log(data)
    this.apiCalls.authenticateClient(data);
  }

}
