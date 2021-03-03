import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { $ } from 'protractor';
import { ApiCallsService } from 'src/app/services/api-calls.service';

@Component({
  selector: 'app-bot-selection-dialog',
  templateUrl: './bot-selection-dialog.component.html',
  styleUrls: ['./bot-selection-dialog.component.css']
})

export class BotSelectionDialogComponent implements OnInit {

  bots: any = [];
  loading: boolean = true;
  checked: any = false;
  botIds: any = [];

  constructor(public dialogRef: MatDialogRef<BotSelectionDialogComponent>, private apiCalls: ApiCallsService) {
    this.loadPublishButtons();
  }

  ngOnInit(): void {
  }

  select(event) {
   
    document.getElementById("" + event.target.id).style.border = "3px solid black";
  }

  async loadPublishButtons() {
    this.loading = true;
    this.bots = [];
    var data: any = await this.apiCalls.getUserChannels();
    const content = data.data.content;
    for (var i = 0; i < content.length; i++) {
      this.bots.push({ channelName: content[i].channelName, refId: content[i].refId })
    }
    this.loading = false;
  }

  publish() {
        this.apiCalls.publishmxGraph(this.botIds)
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
