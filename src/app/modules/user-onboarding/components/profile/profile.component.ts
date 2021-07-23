import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Profile } from './profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile = new Profile("","","","","");
  storeName:any=localStorage.getItem('store');
  constructor(private apiCalls:ApiCallsService) { }

  ngOnInit(): void {
    this.getClientDetails();
  }

  update(){

  }

  async getClientDetails(){
    var data:any = await this.apiCalls.getClient(localStorage.getItem('ownerId'));
    data = data.data;
    this.profile = new Profile(data.username,data.email,"","","");
  }
}
