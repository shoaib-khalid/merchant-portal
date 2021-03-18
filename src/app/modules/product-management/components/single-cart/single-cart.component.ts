import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {ApiCallsService} from 'src/app/services/api-calls.service';
@Component({
  selector: 'app-single-cart',
  templateUrl: './single-cart.component.html',
  styleUrls: ['./single-cart.component.css']
})
export class SingleCartComponent implements OnInit {

  constructor(private route:ActivatedRoute,private apiCalls:ApiCallsService) { }

  cartItems:any=[];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.id){
        const cartId = params.id
        this.getCartItems(cartId);
      }else{

      }
   });
  }

  async getCartItems(cartId){
    const data:any = await this.apiCalls.getCartItems(cartId);
    this.cartItems = data.data.content;
    console.log(this.cartItems)
  }

}
