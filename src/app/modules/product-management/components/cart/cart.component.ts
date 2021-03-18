import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  carts:any=[];

  constructor(private apiCalls:ApiCallsService,private router:Router) { }

  ngOnInit(): void {
    this.getCart();
  }

  async getCart(){
    this.carts = await this.apiCalls.getCarts();
    this.carts = this.carts.data.content;
    console.log(this.carts)
  }

  showCartItems(cart){
    this.router.navigateByUrl('cart-items/'+cart.id)
  }

}
