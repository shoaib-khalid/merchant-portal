import { Component, OnInit } from '@angular/core';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  title:string;
  description:string;
  price:any;
  compareAtPrice:string;
  costPerItem:any;
  chargeTax:boolean;
  inventoryMngdBy:any;
  SKU:any;
  barcode:any;
  trackQuantity:any;
  continueSelling:any;
  quantity:any;
  physicalProduct:any;
  weight:any;
  weightType:any;
  country:any;
  hsCode:any;
  tags:any;
  items:any=[];
  countries: any = [];
  variantChecked: boolean = false;
  options: any = []
  constructor(private helperTextService: HelperTextService) { }

  ngOnInit(): void {
    this.countries = this.helperTextService.countriesList;
  }

  addAnotherOption() {
    this.options.push({ field1: "", field2: "" })
    console.log(this.options)
  }

  variantChanged(event) {
    if (event.target.checked) {
      this.options.push({ field1: "", field2: "" })
    } else {
      this.options = [];
    }
  }

  onTagsChanged($event){

  }
}
