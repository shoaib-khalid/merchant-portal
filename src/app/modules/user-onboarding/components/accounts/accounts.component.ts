import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import {Router} from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts:any=[];
  page:any=0;
  constructor(private apiCalls:ApiCallsService,private router:Router) { }

  ngOnInit(): void {
    this.loadAccounts();
    // $( function() {
    //   $( "#sortable1, #sortable2" ).sortable({
    //     connectWith: ".connectedSortable"
    //   }).disableSelection();
    // } );
  }

  async loadAccounts(){
    const data1 = await this.apiCalls.getClients("STORE_CSR_COMPLAINT");
    const data2 = await this.apiCalls.getClients("STORE_CSR_ORDER");
    this.accounts = (data1.data.content).concat(data2.data.content);
    console.log(this.accounts)
  }
  createAccount(){

  }
  previousPage(){

  }
  nextPage(){

  }
  edit(id){
    console.log(id)
    this.router.navigateByUrl('agent-accounts/'+id)
  }
}
