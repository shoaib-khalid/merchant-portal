import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { DiscountTier } from '../discount-tier/discount-tier.model';
@Component({
  selector: 'app-edit-discount-tier',
  templateUrl: './edit-discount-tier.component.html',
  styleUrls: ['./edit-discount-tier.component.css']
})
export class EditDiscountTierComponent implements OnInit {

  DISCOUNT_TIER = new DiscountTier('', '', '0', '0', '', 'PERCENT')

  constructor(
    private apiCalls: ApiCallsService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      if (params.discountId && params.id) {
        this.DISCOUNT_TIER.id = params.id;
        this.DISCOUNT_TIER.discountId = params.discountId;

        this.getSingleDiscountTier();
      }
    });
  }

  ngOnInit(): void {
  }

  async updateDiscountTier() {
    this.apiCalls.loadingAnimation("Updating...")
    var data: any = await this.apiCalls.updateSingleDiscountTier(this.DISCOUNT_TIER.discountId, this.DISCOUNT_TIER.id,
      {
        calculationType: this.DISCOUNT_TIER.calculationType,
        discountAmount: this.DISCOUNT_TIER.discountAmount,
        startTotalSalesAmount: this.DISCOUNT_TIER.minSubTotal,
        endTotalSalesAmount: this.DISCOUNT_TIER.maxSubTotal
      })
    this.apiCalls.loadingdialogRef.close();
  }
  minValue1(event) {
    if (event.key == "-") {
      this.DISCOUNT_TIER.minSubTotal = '0'
    }
    try {
      if (Number(this.DISCOUNT_TIER.minSubTotal) < 0) this.DISCOUNT_TIER.minSubTotal = '0';
      if (Number(this.DISCOUNT_TIER.minSubTotal) > 9999999) this.DISCOUNT_TIER.minSubTotal = '9999999';
    } catch (ex) {
      this.DISCOUNT_TIER.minSubTotal = '0'
    }
    this.DISCOUNT_TIER.maxSubTotal = this.DISCOUNT_TIER.minSubTotal;
  }
  minValue2(event) {
    if (event.key == "-") {
      this.DISCOUNT_TIER.maxSubTotal = '0'
    }
    try {
      if (Number(this.DISCOUNT_TIER.maxSubTotal) < 0) this.DISCOUNT_TIER.maxSubTotal = '0';
      if (Number(this.DISCOUNT_TIER.maxSubTotal) > 9999999) this.DISCOUNT_TIER.maxSubTotal = '9999999';
    } catch (ex) {
      this.DISCOUNT_TIER.maxSubTotal = '0'
    }
  }

  discountAmountRange(event) {
    if (this.DISCOUNT_TIER.calculationType == "PERCENT") {
      this.percentage(event);
    } else {
      if (event.key == "-") {
        this.DISCOUNT_TIER.discountAmount = '0'
      }
      try {
        if (Number(this.DISCOUNT_TIER.discountAmount) < 0) this.DISCOUNT_TIER.discountAmount = '0';
        if (Number(this.DISCOUNT_TIER.discountAmount) > 9999999) this.DISCOUNT_TIER.discountAmount = '9999999';
      } catch (ex) {
        this.DISCOUNT_TIER.discountAmount = '0'
      }
    }
  }

  percentage(event) {
    if (event.key == "-") {
      this.DISCOUNT_TIER.discountAmount = '0'
    }
    try {
      if (Number(this.DISCOUNT_TIER.discountAmount) < 0) this.DISCOUNT_TIER.discountAmount = '0';
      if (Number(this.DISCOUNT_TIER.discountAmount) > 100) this.DISCOUNT_TIER.discountAmount = '100';
    } catch (ex) {
      this.DISCOUNT_TIER.maxSubTotal = '0'
    }
  }

  calChange(event) {
    this.DISCOUNT_TIER.discountAmount = '0';
  }
  customValidation() {
    if (this.DISCOUNT_TIER.minSubTotal <= this.DISCOUNT_TIER.maxSubTotal && this.DISCOUNT_TIER.discountAmount <= this.DISCOUNT_TIER.maxSubTotal) {
      return true;
    }
    return false;
  }

  async getSingleDiscountTier() {
    var data: any = await this.apiCalls.getSingleDiscountTier(this.DISCOUNT_TIER.discountId, this.DISCOUNT_TIER.id);
    data = data.data;
    this.DISCOUNT_TIER.calculationType = data.calculationType;
    this.DISCOUNT_TIER.maxSubTotal = data.endTotalSalesAmount;
    this.DISCOUNT_TIER.minSubTotal = data.startTotalSalesAmount;
    this.DISCOUNT_TIER.discountAmount = data.discountAmount;
    console.log(data)
  }
}
