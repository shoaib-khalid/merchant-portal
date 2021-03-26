import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiCallsService } from 'src/app/services/api-calls.service';

@Component({
  selector: 'app-bot-selection-dialog',
  templateUrl: './bot-selection-dialog.component.html',
  styleUrls: ['./bot-selection-dialog.component.css']
})

export class BotSelectionDialogComponent implements OnInit {
  title: any = "Select Channel Types"
  bots: any = [];
  loading: boolean = true;
  checked: any = false;
  botIds: any = [];
  showPublished: boolean = false;
  flowId:any;

  constructor(public dialogRef: MatDialogRef<BotSelectionDialogComponent>, private apiCalls: ApiCallsService, @Inject(MAT_DIALOG_DATA) public data: {
    channels: any;
    flowId:any;

  }) {
    if (data.channels) {
      this.showPublished = true;
      this.title = "Published Channels"
      this.loadPublishButtons(data.channels);
      console.log(data.channels)
    } else {
      this.flowId = data.flowId;
      this.loadPublishButtons(null)
    }
  }

  ngOnInit(): void {
  }

  select(event) {

    document.getElementById("" + event.target.id).style.border = "3px solid black";
  }

  async loadPublishButtons(channels) {
    this.loading = true;
    this.bots = [];
    var data: any = await this.apiCalls.getUserChannels();
    const content = data.data.content;
    console.log("content bot selection")
    console.log(content)
    console.log("content bot selection")

    for (var i = 0; i < content.length; i++) {
      if (channels) {
        if (channels[i] == content[i].refId) {
          this.bots.push({ channelName: content[i].channelName, refId: content[i].refId })
        }
      } else {
        this.bots.push({ channelName: content[i].channelName, refId: content[i].refId })

      }
    }
    this.loading = false;
  }

  publish() {
    console.log(this.flowId)
    this.apiCalls.publishmxGraph(this.botIds,this.flowId)
    this.dialogRef.close();

  }

  setAll(event, i) {
    if (event.checked) {
      this.botIds[i] = event.source.id
    } else {
      this.botIds.splice(i, 1);
    }
  }

}
