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

  DISCOUNT: any = new Discount('', '', '', '', '', '', '', '')
  discounts: any = [];
  currentDate:any=new Date().toISOString().split('T')[0];
  constructor(private apiCalls: ApiCallsService, private router: Router) { }

  ngOnInit(): void {
    this.displayDiscounts();
  }

  async insertDiscount(form) {
    if (form.valid && this.customValidation()) {
      const { startDate, endDate } = this.fD();
      const data: any = await this.apiCalls.setStoreDiscount(
        {
          discountName: this.DISCOUNT.name,
          isActive: this.DISCOUNT.status,
          startDate: startDate,
          endDate: endDate,
          discountType: this.DISCOUNT.discountOn,
          startTime: this.DISCOUNT.startTime,
          endTime: this.DISCOUNT.endTime
        })

      this.DISCOUNT.id = data.data.id;
      this.discounts.push(this.DISCOUNT);
      this.DISCOUNT = new Discount(data.data.id, '', '', '', '', '', '', '')
    }
  }

  async displayDiscounts() {
    var data: any = await this.apiCalls.getStoresByDiscount();
    data = data.data;
    console.log(data)
    for (const discount of data) {
      this.discounts.push(
        new Discount(
          discount.id, discount.discountName, discount.isActive ? "ACTIVE" : "INACTIVE",
          discount.startDate, discount.endDate, discount.discountType, '', ''))
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
    const date = new Date(this.DISCOUNT.startDate).toISOString().split("T")[0];
    const startDate = date;
    const date_ = new Date(this.DISCOUNT.endDate).toISOString().split("T")[0];
    const endDate = date_;
    return { startDate: startDate, endDate: endDate }
  }

  actionClick() {

  }

  async deleteDiscount(id) {
    await this.apiCalls.deleteDiscount(id);
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/discounts']);
    });
  }

  editDiscount(id) {
    this.router.navigateByUrl(`/discounts/${id}`);
  }

  customValidation() {
    if (new Date(this.DISCOUNT.startDate) > new Date(this.DISCOUNT.endDate) || (new Date(this.DISCOUNT.startDate)<new Date(this.currentDate))) {
      return false;
    }
    return true;
  }

}
