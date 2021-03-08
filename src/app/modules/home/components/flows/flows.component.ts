import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
import { FlowDialog } from 'src/app/modules/flow-builder/components/flow-dialog/flow-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.css']
})
export class FlowsComponent implements OnInit {
  loading:boolean=true;
  flows: any = [];
  constructor(private apiCallsService: ApiCallsService,private router:Router,private dialog:MatDialog) { }

  ngOnInit(): void {
    this.getAllFlows();
  }

  async getAllFlows() {
    this.loading=true;
    this.flows = await this.apiCallsService.getAllflows();
    this.flows = this.flows.data;
    this.loading=false;
  }

  openFlow(event) {
    this.router.navigateByUrl('/flows/'+event.target.id);
  }

  createNewFlow(){
    const dialogRef = this.dialog.open(FlowDialog, {
      width: '368px',
      data: { title: "", description: "" , dialogTitle:"Create new Flow"}
   });

   dialogRef.afterClosed().subscribe(async result => {
    if (result) {
       if (result[0] && result[1]) {
          await this.apiCallsService.getFlowId(result[1],result[0]);
          this.router.navigateByUrl('/flows/'+this.apiCallsService.flowId)
       }
    }
 });

  }

  delete(event){
    this.apiCallsService.deleteFlow(event.target.id)
    console.log(this.flows)
    for(var i=0;i<this.flows.length;i++){
      if(this.flows[i].id==event.target.id){
        this.flows.splice(i,1)
      }
    }
  }

}
