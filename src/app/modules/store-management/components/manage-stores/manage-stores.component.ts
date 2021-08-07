import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
import { HelperTextService } from 'src/app/helpers/helper-text.service';


@Component({
  selector: 'app-manage-stores',
  templateUrl: './manage-stores.component.html',
  styleUrls: ['./manage-stores.component.css']
})
export class ManageStoresComponent implements OnInit {

  stores: any;
  loading: any = true;
  showEdit: any = false;
  constructor(private apiCalls: ApiCallsService, private router: Router,private helperTextSvc:HelperTextService) { }

  ngOnInit(): void {
    if (localStorage.getItem('storeId')) {
      this.showEdit = true;
    }
    this.loadStores();
  }

  async loadStores() {
    const data: any = await this.apiCalls.getStoresByOwnerId();
    this.stores = data.data.content;
  }

  selectStore(id, name, domain,phoneNumber) {
    localStorage.setItem("storeId", id)
    localStorage.setItem("store", name)
    this.helperTextSvc.setDefaultJson(phoneNumber,domain,name)
    this.router.navigateByUrl("/products")
  }
  nextPage() {

  }
  previousPage() { }

  editStore(id) {
    this.router.navigateByUrl("stores/" + id)

  }
}
