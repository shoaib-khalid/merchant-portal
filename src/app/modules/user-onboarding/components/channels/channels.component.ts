import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service'
import { HelperTextService } from 'src/app/helpers/helper-text.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewComponent } from './create-new/create-new.component'
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  /**
   * connect makes sure that FB page connection request to appToken tables goes first time only.
   * Second time it is already saved in appToken we need to save in userChannels DB only.
   */
  connect: Boolean = true;

  constructor(private apiCalls: ApiCallsService, private dialog: MatDialog, private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document
    , private helperText: HelperTextService) { }

  ngOnInit(): void {
    this.loadUserChannels();
  }

  async loadUserChannels() {
    const data: any = await this.apiCalls.getUserChannels();
    this.myChannels = data.data.content;
    this.facebookBtnToggle();
    console.log(this.myChannels)
  }

  nextPage() {

  }

  previousPage() {

  }

  addChannel() {
    const dialogRef = this.dialog.open(CreateNewComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      this.channels = [];
      this.loadUserChannels()
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
          this.checkChannelInDB(pageList[i])
        }
      });
    }
  }

  async connectToFbPage(accessToken, pageId, botNo, channelName) {
    this.addFacebookChannel(pageId, channelName)
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
      console.log(data)
      var flag = true;
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].id == environment.client_id) {
          flag = false;
        }
      }
      this.channels.push(page)
      this.apiCalls.loadingdialogRef.close();
      if (flag) {
        this.connect = true;
        document.getElementById(`${page.id}`).style.display = "block"
      } else {
        this.connect = false;
      }
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
      this.loadPages()
    } else {
    }
  }

  async getLongLivedAppAccessToken(pageAccessToken) {
    const data: any = await this.apiCalls.getLongLivedAppAccessToken1(pageAccessToken)
    console.log(data)
    this.getLongLivedPageAccessToken(data.access_token)
  }

  async getLongLivedPageAccessToken(appAccessTokenLongLived) {
    var data = await this.apiCalls.getLongLivedPageAccessToken(appAccessTokenLongLived)
    console.log(data)
    data = data.data;
    for (var i = 0; i < data.length; i++) {
      if (data[i].access_token) {
        data = data[i];
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
    this.apiCalls.storeLongLivedPageAccessToken(pageAcessToken, pageId)
  }

  /**
   * Adds facebook page details to user channels when page is connected. 
   * 
   */
  async addFacebookChannel(pageId, pageName) {
    await this.apiCalls.createChannel({
      channelName: pageName,
      refId: pageId,
      userId: localStorage.getItem('ownerId')
    })
    this.apiCalls.successPopUp(`Channel Connected Successfully. 
    Kindly go to 'Flows' menu to publish the channel.`, 2800, '290px')
  }

  /**
   * Deletes user channel from DB
   */
  async deleteUserChannel(channelId) {
    await this.apiCalls.deleteUserChannel(channelId)
    this.apiCalls.successPopUp("Channel Deleted Successfully")
    this.channels = [];
    this.loadUserChannels();
  }

  /**
   * Checks if the channels coming from facebook exist in DB.
   * Since we have DB channels already saved in myChannels array
   * we compare channels coming facebook with this array
   * if they exist in DB we dont show them otherwise we show them
   * with connect button.
   */
  checkChannelInDB(page) {
    var obj = "";
    obj = this.myChannels.filter(x => x.refId === page.id);
    if (obj.length) {
      this.apiCalls.loadingdialogRef.close();
    } else {
      this.checkForConnectedPages(page)
    }
  }


}