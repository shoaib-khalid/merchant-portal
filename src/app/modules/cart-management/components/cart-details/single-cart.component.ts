import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {ApiCallsService} from 'src/app/services/api-calls.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-single-cart',
  templateUrl: './single-cart.component.html',
  styleUrls: ['./single-cart.component.css']
})
export class SingleCartComponent implements OnInit {
  heroes$: Observable<any>;
  constructor(private route:ActivatedRoute,private apiCalls:ApiCallsService) { }

  cartItems:any=[];

  ngOnInit(): void {


    this.route.queryParams.subscribe(params => {
      if(params["cartId"]){
        const cartId = params["cartId"];
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
