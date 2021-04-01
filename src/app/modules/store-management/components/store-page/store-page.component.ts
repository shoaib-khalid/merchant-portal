import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessAnimationComponent } from 'src/app/modules/home/components/success-animation/success-animation.component';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.scss']
})
export class StorePageComponent implements OnInit {
  storeName: any;
  city: any;
  address: any;
  constructor(private apiCalls: ApiCallsService,private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  registerStore() {
    if (this.storeName && this.city && this.address) {

      this.apiCalls.registerStore({
        name: this.storeName,
        city: this.city,
        address: this.address,
        clientId: localStorage.getItem("ownerId")

      })
      this.apiCalls.successPopUp("New Store Registered")
    } else {
      alert("Please enter all details");
    }
  }
}
