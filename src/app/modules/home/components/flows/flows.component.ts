import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.css']
})
export class FlowsComponent implements OnInit {

  flows: any = [];
  constructor(private apiCallsService: ApiCallsService,private router:Router) { }

  ngOnInit(): void {
    this.getAllFlows();
  }

  async getAllFlows() {
    this.flows = await this.apiCallsService.getAllflows();
    this.flows = this.flows.data;
  }

  openFlow(event) {
    console.log(event.target.id)
    this.router.navigateByUrl('/flows/'+event.target.id);

  }

}
