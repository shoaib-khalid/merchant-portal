import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Discount } from '../discounts/discount.model';

@Component({
  selector: 'app-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.css']
})
export class EditDiscountComponent implements OnInit {
  DISCOUNT: any = new Discount('', '', '', '', '', '', '', '')
  currentDate:any=new Date();

  constructor(private route: ActivatedRoute, private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.DISCOUNT.id = params.id;
        this.getSingleDiscount();
      }
    });
  }


  async getSingleDiscount() {
    var data: any = await this.apiCalls.getSingleDiscount(this.DISCOUNT.id);
    console.log(data)
    data = data.data;
    this.DISCOUNT = new Discount(
      data.id,
      data.discountName,
      data.isActive,
      new Date(data.startDate).toISOString().split('T')[0],
      new Date(data.endDate).toISOString().split('T')[0],
      data.discountType, data.startTime, data.endTime);
  }

  async updateDiscount() {
    this.apiCalls.loadingAnimation("Updating...")

    const { startDate, endDate } = this.fD();
    console.log(   {
      id: this.DISCOUNT.id,
      discountName: this.DISCOUNT.name,
      isActive: this.DISCOUNT.status,
      startDate: startDate,
      endDate: endDate,
      discountType: this.DISCOUNT.discountOn,
      startTime: this.DISCOUNT.startTime.substring(0,5),
      endTime: this.DISCOUNT.endTime.substring(0,5)
    })
    await this.apiCalls.updateSingleDiscount(
      {
        id: this.DISCOUNT.id,
        discountName: this.DISCOUNT.name,
        isActive: this.DISCOUNT.status,
        startDate: startDate,
        endDate: endDate,
        discountType: this.DISCOUNT.discountOn,
        startTime: this.DISCOUNT.startTime,
        endTime: this.DISCOUNT.endTime
      })
    this.apiCalls.loadingdialogRef.close();
  }

  fD() {
    const date = new Date(this.DISCOUNT.startDate).toISOString().split("T")[0];
    const startDate = date;
    const date_ = new Date(this.DISCOUNT.endDate).toISOString().split("T")[0];
    const endDate = date_;
    return { startDate: startDate, endDate: endDate }
  }
}