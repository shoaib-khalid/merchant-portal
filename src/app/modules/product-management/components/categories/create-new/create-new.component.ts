import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.css']
})
export class CreateNewComponent implements OnInit {
  category: any = []="";
  catImage: any = { file: "", preview: "assets/img/default.png" };
  constructor(public dialogRef: MatDialogRef<CreateNewComponent>,
    private apiCalls: ApiCallsService,
  ) { }

  ngOnInit(): void {
  }

  async create() {
    if (this.category.trim()) {
      this.apiCalls.successPopUp("Category Added Successfully")
      const data: any = await this.apiCalls.createCategory(this.uploadCategoryImage(), this.category);
      this.dialogRef.close();
    }
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    this.catImage.file = file;
    this.catImage.preview = await this.previewImage(file);
  }

  previewImage(file) {
    var promise = new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        resolve(reader.result)
      }
    });
    return promise;
  }

  uploadCategoryImage() {
    const formData = new FormData();
    formData.append("file", this.catImage.file);
    return formData;
  }
}
