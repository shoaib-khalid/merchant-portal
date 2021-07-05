import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import $ from 'jquery';

declare const login: any;



@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.css']
})
export class CreateNewComponent implements OnInit {
  channel: any = "";
  refId: any;
  fbButton: any = false;
  channels: any = [];

  constructor(public dialogRef: MatDialogRef<CreateNewComponent>,
    private apiCalls: ApiCallsService, private router: Router, private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document) { }

  ngOnInit(): void {
    this.setChannels();
    $("#wa-contact").hide();
    $("#refId").hide();
  }

  async create() {
    this.dialogRef.close();
    if (this.channel) {
      await this.apiCalls.createChannel({
        channelName: this.channel,
        refId: this.refId,
        userId: localStorage.getItem('ownerId')
      })
      this.apiCalls.successPopUp("Channel Added Successfully")
      location.reload()
    } else {

    }

  }

  channelSelected() {
    if (this.channel == "Facebook") {
      this.fbButton = true;
      $("#wa-contact").hide();
      $("#refId").hide();

    } else if (this.channel == "Whatsapp") {
      this.fbButton = false;
      $("#wa-contact").show();
      $("#refId").show();

    }
    else if (this.channel == "Telegram") {
      console.log(this.channel)
      this.fbButton = false;
      $("#wa-contact").hide();
      $("#refId").hide();
      const s = window.open(`https://tgo.symplified.biz/?userid=${localStorage.getItem("ownerId")}`,'popup','width=600,height=600')
      var timer = setInterval(()=> { 
        if(s.closed) {
            clearInterval(timer);
            location.reload()
        }
    }, 500);
    }
  }

  fbLogin() {
    this.loadScriptTags(`https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v10.0&appId=${environment.client_id}&autoLogAppEvents=1`, '')
    login();
    this.dialogRef.close();
  }

  loadScriptTags(url, text) {

    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.src = url;
    s.nonce = 'tGi78tnz';
    s.crossorigin = 'anonymous'
    s.text = text;
    this.renderer2.appendChild(this._document.body, s);
  }


  /**
   * Fetches channels from service and displays in dropdown
   */
  async setChannels() {
    const data: any = await this.apiCalls.fetchChannels();
    this.channels = data.data.content;
  }


  toggleFBbutton() {

  }


}
