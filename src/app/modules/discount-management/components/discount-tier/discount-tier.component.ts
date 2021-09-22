import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { DiscountTier } from './discount-tier.model';
ActivatedRoute
@Component({
  selector: 'app-discount-tier',
  templateUrl: './discount-tier.component.html',
  styleUrls: ['./discount-tier.component.css']
})
export class DiscountTierComponent implements OnInit {

  DISCOUNT_TIER = new DiscountTier('','', '0', '0', '', 'PERCENT')
  discountTiers: any = [];
  constructor(private route: ActivatedRoute, private apiCalls: ApiCallsService,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.discountId) {
        this.DISCOUNT_TIER.discountId = params.discountId;
        this.getDiscountTiers(params.discountId);
      }
    });
  }

  async insertDiscountTier(form) {
    if (form.valid && this.customValidation()) {
    this.apiCalls.loadingAnimation("Updating...")

      var data:any = await this.apiCalls.setDiscountTier(this.DISCOUNT_TIER.discountId,
        {
          "calculationType": this.DISCOUNT_TIER.calculationType,
          "discountAmount": this.DISCOUNT_TIER.discountAmount,
          "endTotalSalesAmount": this.DISCOUNT_TIER.maxSubTotal,
          "startTotalSalesAmount": this.DISCOUNT_TIER.minSubTotal,
          "storeDiscountId": this.DISCOUNT_TIER.discountId
        }
      )
      data.data;
      this.discountTiers.push(this.DISCOUNT_TIER);
      this.DISCOUNT_TIER = new DiscountTier(data.id,this.DISCOUNT_TIER.discountId, '', '', '', '')
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/discount-tiers/${this.DISCOUNT_TIER.discountId}`]);
      });
      this.apiCalls.loadingdialogRef.close();
    }
  }

  async getDiscountTiers(discountId) {
    var data: any = await this.apiCalls.getDiscountTiersByStore(discountId);
    data = data.data;
    console.log(data)
    for (const dt of data) {
      this.discountTiers.push(new DiscountTier(dt.id,dt.storeDiscountId, dt.startTotalSalesAmount, dt.endTotalSalesAmount, dt.discountAmount, dt.calculationType))
    }
  }

  minValue1(event) {
    if(event.key=="-"){
      this.DISCOUNT_TIER.minSubTotal='0'
    }
    try{
      if(Number(this.DISCOUNT_TIER.minSubTotal)<0) this.DISCOUNT_TIER.minSubTotal='0';
      if(Number(this.DISCOUNT_TIER.minSubTotal)>9999999) this.DISCOUNT_TIER.minSubTotal='9999999';
    }catch(ex){
      this.DISCOUNT_TIER.minSubTotal='0'
    }
      this.DISCOUNT_TIER.maxSubTotal=this.DISCOUNT_TIER.minSubTotal;
  }
  minValue2(event) {
    if(event.key=="-"){
      this.DISCOUNT_TIER.maxSubTotal='0'
    }
    try{
      if(Number(this.DISCOUNT_TIER.maxSubTotal)<0) this.DISCOUNT_TIER.maxSubTotal='0';
      if(Number(this.DISCOUNT_TIER.maxSubTotal)>9999999) this.DISCOUNT_TIER.maxSubTotal='9999999';
    }catch(ex){
      this.DISCOUNT_TIER.maxSubTotal='0'
    }
  }

  discountAmountRange(event) {
    if(this.DISCOUNT_TIER.calculationType=="PERCENT"){
      this.percentage(event);
    }else{
      if(event.key=="-"){
        this.DISCOUNT_TIER.discountAmount='0'
      }
      try{
        if(Number(this.DISCOUNT_TIER.discountAmount)<0) this.DISCOUNT_TIER.discountAmount='0';
        if(Number(this.DISCOUNT_TIER.discountAmount)>9999999) this.DISCOUNT_TIER.discountAmount='9999999';
      }catch(ex){
        this.DISCOUNT_TIER.discountAmount='0'
      }
    }
  }

  percentage(event){
    if(event.key=="-"){
      this.DISCOUNT_TIER.discountAmount='0'
    }
    try{
      if(Number(this.DISCOUNT_TIER.discountAmount)<0) this.DISCOUNT_TIER.discountAmount='0';
      if(Number(this.DISCOUNT_TIER.discountAmount)>100) this.DISCOUNT_TIER.discountAmount='100';
    }catch(ex){
      this.DISCOUNT_TIER.maxSubTotal='0'
    }
  }

  calChange(event){
    this.DISCOUNT_TIER.discountAmount='0';
  }
  customValidation(){
    if(this.DISCOUNT_TIER.minSubTotal<=this.DISCOUNT_TIER.maxSubTotal&&this.DISCOUNT_TIER.discountAmount<=this.DISCOUNT_TIER.maxSubTotal){
      return true;
    }
    return false;
  }

  edit(id){
    this.router.navigateByUrl(`/discounts/${this.DISCOUNT_TIER.discountId}/discount-tiers/${id}`)
  }
  async delete(id){
    await this.apiCalls.deleteDiscountTier(this.DISCOUNT_TIER.discountId,id);
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/discount-tiers/${this.DISCOUNT_TIER.discountId}`]);
    });
  }
}
