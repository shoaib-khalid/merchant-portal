import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiCallsService } from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  name: any = "";
  catImage: any = { file: "", preview: "assets/img/default.png" };
  catId: any;
  constructor(public dialogRef: MatDialogRef<EditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data:
      {
        id: any,
        name: any,
        img: any
      }, private apiCalls: ApiCallsService) {
    this.name = data.name;
    if (data.img != null) {
      this.catImage.preview = data.img;
    }
    this.catId = data.id;
  }

  ngOnInit(): void {
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    this.catImage.file = file;
    this.catImage.preview = await this.previewImage(file);
  }

  async update() {
    if (this.name.trim()) {
      this.apiCalls.loadingAnimation("Updating Category");
      const data: any = await this.apiCalls.updateStoreCategory(this.uploadCategoryImage(), this.name, this.catId);
      this.apiCalls.loadingdialogRef.close();
      this.apiCalls.successPopUp("Category Updated Successfully")
      this.dialogRef.close();
    }
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
