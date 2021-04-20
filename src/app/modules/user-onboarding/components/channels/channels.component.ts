import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service'
import { MatDialog } from '@angular/material/dialog';
import {CreateNewComponent} from './create-new/create-new.component'
@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  
  channels: any = [];
  page: any = 0;
  
  constructor(private apiCalls: ApiCallsService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUserChannels();
  }

  async loadUserChannels() {
    const data:any = await this.apiCalls.getUserChannels();
    this.channels = data.data.content;
  }

  nextPage() {

  }

  previousPage() {

  }

  addChannel(){
    const dialogRef = this.dialog.open(CreateNewComponent, {
      width: '368px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}