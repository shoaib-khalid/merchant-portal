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
  constructor(private router: Router, private apiCalls: ApiCallsService) {
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
  }

  ngOnInit(): void {

    const ownerId = localStorage.getItem("ownerId");
    const accessToken = localStorage.getItem("accessToken")
    const username = localStorage.getItem("username");

    if (username && accessToken && ownerId) {
      this.username = username
    }
  }

  logOut() {
    localStorage.clear();
  }


}
