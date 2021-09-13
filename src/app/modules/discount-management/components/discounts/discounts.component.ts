import { Component, OnInit } from '@angular/core';
import { Discount } from './discount.model';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css']
})
export class DiscountsComponent implements OnInit {

  DISCOUNT: any = new Discount('', '', '', '', '', '')
  discounts: any = [];
  constructor(private apiCalls: ApiCallsService, private router: Router) { }

  ngOnInit(): void {
    this.displayDiscounts();
  }

  async insertDiscount(form) {
    if (form.valid) {
      const { startDate, endDate } = this.fD();
      await this.apiCalls.setStoreDiscount(
        {
          discountName: this.DISCOUNT.name,
          isActive: this.DISCOUNT.status,
          startDate: startDate,
          endDate: endDate,
          discountType: this.DISCOUNT.discountOn
        })
      this.discounts.push(this.DISCOUNT);
      this.DISCOUNT = new Discount('', '', '', '', '')
    }
  }

  async displayDiscounts() {
    var data: any = await this.apiCalls.getStoresByDiscount();
    data = data.data;
    for (const discount of data) {
      this.discounts.push(
        new Discount(
          discount.id, discount.discountName, discount.isActive ? "ACTIVE" : "INACTIVE",
          discount.startDate, discount.endDate, discount.discountType))
    }
  }

  openDiscountTier(id) {
    this.router.navigateByUrl(`/discount-tiers/${id}`)
  }

  /**
   * 
   * @returns formatted dates because post request was producing 400
   */
  fD() {
    const date = new Date(this.DISCOUNT.startDate).toISOString().split("T");
    const startDate = date[0] + " " + date[1];
    const date_ = new Date(this.DISCOUNT.endDate).toISOString().split("T");
    const endDate = date_[0] + " " + date_[1];
    return { startDate: startDate, endDate: endDate }
  }

}
