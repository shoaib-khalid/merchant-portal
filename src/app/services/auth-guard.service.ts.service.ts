import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router) { }
  canActivate(): boolean {
    // this.router.navigate(['/signin']);
    return true;

  }
}
