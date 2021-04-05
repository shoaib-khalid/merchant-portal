import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
import { FlowDialog } from 'src/app/modules/flow-builder/components/flow-dialog/flow-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BotSelectionDialogComponent } from 'src/app/modules/flow-builder/components/bot-selection-dialog/bot-selection-dialog.component';


@Component({
  selector: 'app-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.css']
})
export class FlowsComponent implements OnInit {
  loading: boolean = true;
  flows: any = [];
  openAble: any = true;
  publishedChannels: any = [];

  constructor(private apiCallsService: ApiCallsService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllFlows();
  }

  async getAllFlows() {
    this.loading = true;
    this.flows = await this.apiCallsService.getAllflows();
    this.flows = this.flows.data;
    if (this.flows) {
      this.getPublishedChannels
    } this.loading = false;

  }

  getPublishedChannels() {
    this.flows.forEach(element => {
      if (element.botIds) {
        this.publishedChannels.push({ flowid: element.id, channels: element.botIds })
      }
    });
  }



  openFlow(id) {
    if (this.openAble) {
      this.router.navigateByUrl('/flows/' + id);
    } else {
      this.openAble = true;
    }
  }

  createNewFlow() {
    const dialogRef = this.dialog.open(FlowDialog, {
      width: '368px',
      data: { title: "", description: "", dialogTitle: "Create new Flow" }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        if (result[0] && result[1]) {
          this.apiCallsService.successPopUp("New Flow Created")
          await this.apiCallsService.getFlowId(result[1], result[0]);
          this.router.navigateByUrl('/flows/' + this.apiCallsService.flowId)
        }
      }
    });

  }

  delete(event) {
    this.apiCallsService.deleteFlow(event.target.id)
    this.apiCallsService.successPopUp("Flow Deleted")
    for (var i = 0; i < this.flows.length; i++) {
      if (this.flows[i].id == event.target.id) {
        this.flows.splice(i, 1)
      }
    }
  }

  async publishFlow(event) {
    this.openAble = false;
    this.flows = await this.apiCallsService.getAllflows();
    this.flows = this.flows.data;
    this.getPublishedChannels();
    var channelIds: any = [];
    this.publishedChannels.forEach(element => {
      if (element.flowid == event.target.id) {
        channelIds = element.channels;
      }
    });
    const dialogRef = this.dialog.open(BotSelectionDialogComponent, {
      width: '550px',
      data: { flowId: event.target.id, channelsPublish:channelIds }
    });
  }

  async showPublishedChannels(event) {
    this.openAble = false;
    this.flows = await this.apiCallsService.getAllflows();
    this.flows = this.flows.data;
    this.getPublishedChannels();
    var channelIds: any = [];
    this.publishedChannels.forEach(element => {
      if (element.flowid == event.target.id) {
        channelIds = element.channels;
      }
    });
    const dialogRef = this.dialog.open(BotSelectionDialogComponent, {
      width: '300px',
      data: { channels: channelIds }
    });
  }
  showDropdown(id) {
    this.openAble=false;
    document.getElementById(""+id).classList.toggle("show");
  }
}
