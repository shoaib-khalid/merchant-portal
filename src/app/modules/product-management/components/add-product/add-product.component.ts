import { Component, OnInit } from '@angular/core';
import {HelperTextService} from 'src/app/helpers/helper-text.service';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  countries:any=[];
  constructor(private helperTextService: HelperTextService) { }

  ngOnInit(): void {
    this.countries=this.helperTextService.countriesList;
  }

}
