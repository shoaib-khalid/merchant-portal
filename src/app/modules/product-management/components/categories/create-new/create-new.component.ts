import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.css']
})
export class CreateNewComponent implements OnInit {
  category: any = [];
  constructor(public dialogRef: MatDialogRef<CreateNewComponent>, 
    private apiCalls: ApiCallsService,
    ) { }

  ngOnInit(): void {
  }

  async create() {
    const body = {
      "name": this.category,
      "storeId": localStorage.getItem("storeId"),
    }
    this.apiCalls.successPopUp("Category Added Successfully")
    const data: any = await this.apiCalls.createCategory(body);
    this.dialogRef.close();

  }
}
