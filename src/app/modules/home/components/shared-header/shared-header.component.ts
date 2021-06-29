import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import $ from "jquery";

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.css']
})

export class SharedHeaderComponent implements OnInit {
  stores: any;
  store:any="";
  loggedOut: boolean = true;
  constructor(private router: Router, private apiCalls: ApiCallsService) {
    if (localStorage.getItem("store") == undefined) {
      this.loggedOut=true;
    }else{
      this.loggedOut=false;
      this.store = localStorage.getItem('store');
    }
  }

  username: any;
  navOptionalHeadings: any = {
    signedIn: [],
    signedUp: []
  }

  navHeadings: any = [];
  @HostListener('document:click', ['$event.target'])
  onClick(btn) {
    if (!btn.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
    this.toggleDropdown(btn);
  }

  ngOnInit(): void {
    this.loadStores();
    const ownerId = localStorage.getItem("ownerId");
    const accessToken = localStorage.getItem("accessToken")
    const username = localStorage.getItem("username");

    if (username && accessToken && ownerId) {
      this.username = username
    }
  }

  logOut() {
    if (this.apiCalls.loadingdialogRef) {
      this.apiCalls.loadingdialogRef.close();
    }
    localStorage.clear();
  }

  get leftHeading(): any {
    return localStorage.getItem('store');
  }

  toggleDropdown(btn) {
    if (btn.classList.value.includes("username")) {
      const disp = $(".dropdown-content-header-content").css("display");

      if (disp == "block") {
        $(".dropdown-content-header").css("display", "none");

      } else {
        $(".dropdown-content-header").css("display", "block");

      }
    } else {
      $(".dropdown-content-header").css("display", "none");

    }

    if (btn.classList.value.includes("heading")) {
      const disp = $(".dropdown-content-heading").css("display");
      console.log(disp)
      if (disp == "block") {
        $(".dropdown-content-heading").css("display", "none");

      } else {
        $(".dropdown-content-heading").css("display", "block");

      }
    } else {
      $(".dropdown-content-heading").css("display", "none");

    }
  }

  async loadStores() {
    if (localStorage.getItem("accessToken")) {
      const data: any = await this.apiCalls.getStoresByOwnerId();
      this.stores = data.data.content;
    }
  }

  selectStore(id, name, domain) {
    localStorage.setItem("store-domain", domain)
    localStorage.setItem("storeId", id)
    localStorage.setItem("store", name)
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/products']);
    });
  }
}
