import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.css']
})
export class StorePageComponent implements OnInit {
  storeName: any;
  city: any;
  address: any;
  constructor(private apiCalls: ApiCallsService) { }

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
    } else {
      alert("Please enter all details");
    }
  }
}
