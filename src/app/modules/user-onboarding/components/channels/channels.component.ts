import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service'
import { HelperTextService } from 'src/app/helpers/helper-text.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewComponent } from './create-new/create-new.component'
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { JSDocTagName } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';

declare const login: any;

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  channels: any = [];
  myChannels: any = [];
  page: any = 0;

  constructor(private apiCalls: ApiCallsService, private dialog: MatDialog, private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document
    , private helperText: HelperTextService) { }

  ngOnInit(): void {
    this.loadUserChannels();
    this.facebookBtnToggle();
  }

  async loadUserChannels() {
    const data: any = await this.apiCalls.getUserChannels();
    this.myChannels = data.data.content;
    console.log(this.channels)
  }

  nextPage() {

  }

  previousPage() {

  }

  addChannel() {
    const dialogRef = this.dialog.open(CreateNewComponent, {
      width: '368px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
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

  loadScriptTag() {

    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.text = this.helperText.fbsdkCode;
    this.renderer2.appendChild(this._document.body, s);
    // this.loadUserChannels();
  }


  async loadPages() {
    if (localStorage.getItem("fb-user-accessToken")) {
      this.apiCalls.loadingAnimation("Loading..")
      this.apiCalls.loadFbPages().subscribe(data1 => {
        const pageList = data1.data;
        for (var i = 0; i < pageList.length; i++) {
          this.channels.push(pageList[i])
          this.checkForConnectedPages(pageList[i])
        }
      });
    }
  }

  async connectToFbPage(accessToken, pageId, botNo) {
    this.apiCalls.connectFbPageToSymplified(accessToken, pageId).subscribe(data => {
      if (data.success) {
        this.getLongLivedAppAccessToken(accessToken)
        var x: any = document.getElementsByClassName('connect-button');
        for (var i = 0; i < x.length; i++) {
          if (botNo == i) {
            x[i].style.display = "none"
            this.apiCalls.successPopUp("Bot connected successfully")
            break;
          }
        }
      }
    })
  }

  checkForConnectedPages(page) {
    this.apiCalls.checkFbPageConnection(page.id, page.access_token).subscribe(data => {
      var flag = true;
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].id == environment.client_id) {
          flag = false;
        }
      }
      if (flag) {
        document.getElementById(`${page.id}`).style.display = "block"
      }
      this.apiCalls.loadingdialogRef.close();
    })

  }

  showPagesToBeConnected() {
    this.facebookBtnToggle()
  }
  fbLogin() {
    this.loadScriptTags(`https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v10.0&appId=${environment.client_id}&autoLogAppEvents=1`, '')
    login();
  }

  facebookBtnToggle() {
    if (localStorage.getItem('fb-user-id')) {
      document.getElementById('fb-button-custom').style.display = "none";
      this.loadPages()
    } else {
      document.getElementById('fb-button-custom').style.display = "block";
    }
  }

  async getLongLivedAppAccessToken(pageAccessToken) {
    const data: any = await this.apiCalls.getLongLivedAppAccessToken1(pageAccessToken)
    this.getLongLivedPageAccessToken(data.access_token)
  }

  async getLongLivedPageAccessToken(appAccessTokenLongLived) {
    var data = await this.apiCalls.getLongLivedPageAccessToken(appAccessTokenLongLived)
    console.log(data)
    data = data.data;
    for(var i=0;i<data.length;i++){
      if(data[i].access_token){
        data=data[i];
        break;
      }
    }
    console.log(data)
    const pageId = data.id;
    const longLivedAccessToken = data.access_token;
    this.storeTokens(longLivedAccessToken, pageId)
    console.log(pageId)
    console.log(longLivedAccessToken)
  }

  async storeTokens(pageAcessToken, pageId) {
    this.apiCalls.storeLongLivedPageAccessToken(pageAcessToken,pageId)
  }

}