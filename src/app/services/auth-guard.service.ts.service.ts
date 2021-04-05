import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ApiCallsService } from './api-calls.service';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  allowedUnAuthenticated: any = ["", "signin", "signup"]


  constructor(public router: Router, private apiCalls: ApiCallsService) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (localStorage.getItem("accessToken")) {
      const d = new Date();
      if (new Date(localStorage.getItem("expiry")) > new Date(d.toUTCString())) {
        return this.storeSelected(route.url[0] ? route.url[0].path : "");
      } else {
        this.getFreshAccessToken(route.url[0] ? route.url[0].path : "");
      }

    } else {
      if (route.url[0]) {
        if (this.allowedUnAuthenticated.includes(route.url[0].path)) {
          return true;
        } else {
          this.router.navigateByUrl("/")
        }
      } else {
        return true;
      }
    }



  }
  async getFreshAccessToken(path) {
    const data = await this.apiCalls.getAccessTokenUsingRefresh();
    localStorage.setItem('accessToken', data.data.session.accessToken)
    localStorage.setItem('refreshToken', data.data.session.refreshToken)
    localStorage.setItem("created", data.data.session.created)
    localStorage.setItem("expiry", data.data.session.expiry)
    this.router.navigateByUrl("/" + path)
  }


  storeSelected(route) {

    if (route == "chooseverticle" || route == "store" || route == "store-management") {
      return true;
    } else {
      if (localStorage.getItem("storeId")) {
        if (route == "") {
          this.router.navigateByUrl("products")
        } else {
          return true;
        }
      } else {
        this.router.navigate(["/store-management"]);
      }
    }

  }
}
