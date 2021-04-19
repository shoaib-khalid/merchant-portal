import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service'
@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  
  channels: any = [];
  page: any = 0;
  
  constructor(private apiCalls: ApiCallsService) { }

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
}