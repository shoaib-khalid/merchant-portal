import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private apiCalls:ApiCallsService) { 
  }

  ngOnInit(): void {
  }

  async sendEmail(){
    const data = await this.apiCalls.sendEmail();
    console.log(data);
  }

}
