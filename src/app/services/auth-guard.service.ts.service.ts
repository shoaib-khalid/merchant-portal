import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import  {ApiCallsService} from './api-calls.service';
import {ActivatedRouteSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router,private apiCalls:ApiCallsService) { }
   canActivate(route: ActivatedRouteSnapshot): boolean {
    if (localStorage.getItem("accessToken")) {
      if (new Date(localStorage.getItem("created")) < new Date(localStorage.getItem("expiry"))) {
        return true;
      } else {
        this.getFreshAccessToken(route.url[0].path);
      }

    } else {
      this.router.navigate(["/signin"]);
      return false;
    }

  

  }
  async getFreshAccessToken(path){
    const data =await this.apiCalls.getAccessTokenUsingRefresh();
    localStorage.setItem('accessToken', data.data.session.accessToken)
    localStorage.setItem('refreshToken', data.data.session.refreshToken)
    localStorage.setItem("created", data.data.session.created)
    localStorage.setItem("expiry", data.data.session.expiry)
    this.router.navigateByUrl("/"+path)
  }
}
