import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { MatDialog } from '@angular/material/dialog';
import {CreateNewComponent} from './create-new/create-new.component'
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any = [];
  openable=true;
  constructor(private apiCalls: ApiCallsService,private dialog: MatDialog,private router:Router) { }

  ngOnInit(): void {
    this.getCategoriesByStoreId();
  }
  async getCategoriesByStoreId() {
    this.categories=[];
    var i = 0;
    while (true) {
      var data: any = await this.apiCalls.getStoreCategories(i);
      if (data.data.content.length < 1) {
        break;
      }
      this.categories = this.categories.concat(data.data.content)
      i = i + 1;
    }
  }

  createNewCategory() {
    const dialogRef = this.dialog.open(CreateNewComponent, {
      width: '368px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCategoriesByStoreId();
    });
  }

  openCatgoryProducts(id){
    if(this.openable){
      this.router.navigate(['products'], { queryParams: { categoryId: id}})
    }
  }


  loadFacebookSDK(){
    
  }

  async deleteCategory(id){
    this.openable=false;
    this.apiCalls.successPopUp("Category Deleted Successfully")
    await this.apiCalls.deleteProductCategory(id)
    this.getCategoriesByStoreId();
    this.openable=true;
  }
}
