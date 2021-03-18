import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {ApiCallsService} from 'src/app/services/api-calls.service';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.css']
})
export class SingleOrderComponent implements OnInit {

  orderItems:any=[];

  constructor(private route:ActivatedRoute,private apiCalls:ApiCallsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.id){
        const orderId = params.id
        this.getOrderItems(orderId);
      }else{

      }
   });
  }


  async getOrderItems(orderId){
    const data:any = await this.apiCalls.getOrderItems(orderId);
    this.orderItems = data.data.content;
    console.log(this.orderItems)
  }

}
