import { Injectable } from '@angular/core';
import { AppConfig } from './app.config.ts.service';
declare function showChatBotIcon():any;

@Injectable({
  providedIn: 'root'
})

export class HelperMethodsService {
  private storeFrontExtension:string = AppConfig.settings.storeFrontUrl;
  constructor() { }
  setUserDetailsOnAuthentication(data, rememberMe) {
    localStorage.setItem('accessToken', data.data.session.accessToken)
    localStorage.setItem('ownerId', data.data.session.ownerId)
    localStorage.setItem('username', data.data.session.username)
    localStorage.setItem('refreshToken', data.data.session.refreshToken)
    localStorage.setItem("created", data.data.session.created)
    localStorage.setItem("expiry", data.data.session.expiry)
    localStorage.setItem('rememberMe', rememberMe.toString())
    showChatBotIcon();
  }
  setDefaultStoreDetails(data){
    localStorage.setItem("storeId", data.data.content[0].id)
    localStorage.setItem("store", data.data.content[0].name)
  }

  getStoreExtension(){
    return this.storeFrontExtension;
  }
}
