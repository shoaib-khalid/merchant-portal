import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ApiCallsService } from './api-calls.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopUpComponent } from '../modules/home/components/error-pop-up/error-pop-up.component';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  allowedUnAuthenticated: any = ["", "signin", "signup"]
  redirectUrl: String = "";

  constructor(public router: Router, private apiCalls: ApiCallsService, private dialog: MatDialog,private location:Location) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (localStorage.getItem("accessToken")) {
      return this.validateToken(route)
    } else {
      if (route.url[0]) {
        if (this.allowedUnAuthenticated.includes(route.url[0].path)) {
          this.redirectUrl="";
          return true;
        } else {
          this.makeRedirectUrl();
          this.router.navigateByUrl("signin")
          return false;
        }
      } else {
        this.makeRedirectUrl();
        return true;
      }
    }
  }

  makeRedirectUrl(){
    this.redirectUrl = this.location.path();
  }

  async getFreshAccessToken(path) {
    const data = await this.apiCalls.getAccessTokenUsingRefresh();
    localStorage.setItem('accessToken', data.data.session.accessToken)
    localStorage.setItem('refreshToken', data.data.session.refreshToken)
    localStorage.setItem("created", data.data.session.created)
    localStorage.setItem("expiry", data.data.session.expiry)
    this.apiCalls.loadingdialogRef.close();
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


  validateToken(route) {
    const d = new Date();
    if (new Date(localStorage.getItem("expiry")) > new Date(d.toUTCString())) {
      return this.storeSelected(route.url[0] ? route.url[0].path : "");
    } else if (localStorage.getItem('rememberMe') == "true") {
      this.apiCalls.loadingAnimation("Updating session")
      this.getFreshAccessToken(route.url[0] ? route.url[0].path : "");
    } else {
      this.generateSessionExpiryError();
      localStorage.clear();
      this.router.navigateByUrl('/signin')
    }
  }

  generateSessionExpiryError() {
    const dialogRef = this.dialog.open(ErrorPopUpComponent, {
      disableClose: true,
      width: "600px",
      data: { data: "Your session has expired. Please login again, Thank you." }
    });
  }
}
