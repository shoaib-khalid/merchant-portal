import { Component, OnInit } from '@angular/core';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  title: string;
  description: string;
  price: any;
  compareAtPrice: string;
  costPerItem: any;
  chargeTax: boolean;
  inventoryMngdBy: any;
  SKU: any;
  barcode: any;
  trackQuantity: any;
  continueSelling: any;
  quantity: any;
  physicalProduct: any;
  weight: any;
  weightType: any;
  country: any;
  hsCode: any;
  tags: any;
  items: any = [];
  countries: any = [];
  variantChecked: boolean = false;
  options: any = []
  combinationsNo: number = 1;
  combos: any = {};


  constructor(private helperTextService: HelperTextService) { }

  ngOnInit(): void {
    this.countries = this.helperTextService.countriesList;
  }

  addAnotherOption() {
    this.options.push({ field1: "", field2: "" })
  }

  variantChanged(event) {
    if (event.target.checked) {
      this.options.push({ field1: "", field2: "" })
    } else {
      this.options = [];
    }
  }

  variantsChanged(i) {

   var data = this.getallCombinations(this.items)
  
  }


  getallCombinations(combos, result = "", n = 0) {

    var out = "";

    if (n == combos.length) {
      console.log(result.substring(1))
      return result.substring(1);
    }

    for (var i = 0; i < combos[n].length; i++) {
      if (result != "") {
        out = result + " / " + combos[n][i];
      }
      else {
        out = result + " " + combos[n][i];

      }
      this.getallCombinations(combos, out, n + 1)
    }

  }

}
