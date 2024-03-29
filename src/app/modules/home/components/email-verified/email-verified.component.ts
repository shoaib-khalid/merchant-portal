import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.css']
})
export class EmailVerifiedComponent implements OnInit {
  code:any="";
  id:any="";
  showVerification:any=false;
  constructor(private apiCalls:ApiCallsService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params["code"]&&params['id']) {
        this.code = params["code"];
        this.id = params["id"];
        this.verifyEmail();
      }
    });
  }

  async verifyEmail(){
    const data:any = await this.apiCalls.verifyEmail(this.id,this.code)
    if(data.status==200){
      this.showVerification=true;
    }
    console.log(data)
  }
}
