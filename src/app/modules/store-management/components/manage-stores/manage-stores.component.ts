import { Component, OnInit } from '@angular/core';
import {ApiCallsService} from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-manage-stores',
  templateUrl: './manage-stores.component.html',
  styleUrls: ['./manage-stores.component.css']
})
export class ManageStoresComponent implements OnInit {

  stores:any;
  loading:any=true;
  constructor(private apiCalls:ApiCallsService,private router:Router) { }

  ngOnInit(): void {
    this.loadStores();
  }

  async loadStores(){
    const data:any = await this.apiCalls.getStoresByOwnerId();
    this.stores = data.data.content;
  }

  selectStore(event){
    this.apiCalls.successPopUp("New Store Selected")
    localStorage.setItem("storeId",event.target.id)
    this.router.navigateByUrl("/products")
  }
}
