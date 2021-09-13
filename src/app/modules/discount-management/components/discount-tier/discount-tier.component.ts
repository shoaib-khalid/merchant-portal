import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { DiscountTier } from './discount-tier.model';

ActivatedRoute
@Component({
  selector: 'app-discount-tier',
  templateUrl: './discount-tier.component.html',
  styleUrls: ['./discount-tier.component.css']
})
export class DiscountTierComponent implements OnInit {

  DISCOUNT_TIER = new DiscountTier('', '', '', '')
  discountTiers: any = [];
  constructor(private route:ActivatedRoute,private apiCalls:ApiCallsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.discountId) {
        this.getDiscountTiers(params.discountId);
      }
    });
  }

  insertDiscountTier(form) {
    if (form.valid) {
      this.discountTiers.push(this.DISCOUNT_TIER);
      this.DISCOUNT_TIER = new DiscountTier('', '', '', '')
    }
  }

  async getDiscountTiers(discountId){
   var data:any = await this.apiCalls.getDiscountTiersByStore(discountId);
   data=data.data;
   for (const dt of data) {
    this.discountTiers.push(new DiscountTier(dt.startTotalSalesAmount,dt.endTotalSalesAmount,dt.discountAmount,dt.calculationType))
  }
  }
}
