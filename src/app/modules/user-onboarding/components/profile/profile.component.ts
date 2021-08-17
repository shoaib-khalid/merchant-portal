import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Profile } from './profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile = new Profile("", "", "", "", "", "");
  storeName: any = localStorage.getItem('store');
  constructor(private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.getClientDetails();
  }

  async update() {
    this.apiCalls.loadingAnimation("Updating...")
    this.updatePaymentDetails();
    await this.apiCalls.updateClient(localStorage.getItem('ownerId'), this.profile)
    localStorage.setItem('username', this.profile.username)
    this.apiCalls.loadingdialogRef.close();
  }

  async getClientDetails() {
    var data1: any = await this.apiCalls.getClient(localStorage.getItem('ownerId'));
    data1 = data1.data;
    var data2: any = await this.apiCalls.getPaymentDetails();
    console.log(data2)
    data2 = data2.data.content;
    if (data2.length == 0) {
      this.profile = new Profile(data1.username, data1.email, "", '', '', { new: true, paymentId: "" });
      return;
    }
    this.profile = new Profile(data1.username, data1.email, "", data2[0].bankName, data2[0].bankAccountNumber, { new: false, paymentId: data2[0].id });
  }

  async updatePaymentDetails() {
    const data = {
      bankName: this.profile.bankName,
      bankAccountNumber: this.profile.bankAccNo
    }
    if (this.profile.newProfile.new) {
      const data1=await this.apiCalls.savePaymentDetails(data);
      console.log(data1)
      return;
    }
    
    const data1 = await this.apiCalls.updatePaymentDetail(data, this.profile.newProfile.paymentId)
  }
}
