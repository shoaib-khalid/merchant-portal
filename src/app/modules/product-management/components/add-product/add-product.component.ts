import { Component, OnInit } from '@angular/core';
import { HelperTextService } from 'src/app/helpers/helper-text.service';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  countries: any = [];
  variantChecked: boolean = false;
  options: any = []
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
}
