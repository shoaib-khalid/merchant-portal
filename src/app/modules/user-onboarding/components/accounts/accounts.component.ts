import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts:any=[];
  page:any=0;
  constructor() { }

  ngOnInit(): void {
  }

  createAccount(){

  }
  previousPage(){

  }
  nextPage(){

  }
}
