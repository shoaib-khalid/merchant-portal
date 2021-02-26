import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router) { }
  canActivate(): boolean {
    if(localStorage.getItem("accessToken")){
      return true;

    }else{
      this.router.navigate(["/signin"]);
      return false;
    }


  }
}
