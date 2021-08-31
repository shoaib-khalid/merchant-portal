import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperMethodsService {

  constructor() { }
  setUserDetailsOnAuthentication(data, rememberMe) {
    localStorage.setItem('accessToken', data.data.session.accessToken)
    localStorage.setItem('ownerId', data.data.session.ownerId)
    localStorage.setItem('username', data.data.session.username)
    localStorage.setItem('refreshToken', data.data.session.refreshToken)
    localStorage.setItem("created", data.data.session.created)
    localStorage.setItem("expiry", data.data.session.expiry)
    localStorage.setItem('rememberMe', rememberMe.toString())
  }
  setDefaultStoreDetails(data){
    localStorage.setItem("storeId", data.data.content[0].id)
    localStorage.setItem("store", data.data.content[0].name)
  }
}
