import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallsService } from 'src/app/services/api-calls.service';
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
    signUp: [{ heading: 'Home', link: '', bold: false }, { heading: 'Sign Up', link: '/signup', bold: true }],
    signIn: [{ heading: 'Home', link: '', bold: false }, { heading: 'Sign In', link: '/signin', bold: true }],
    flows: [{ heading: 'Home', link: '', bold: false }, { heading: 'flows', link: '/flows', bold: true }],
    flowbuilder: [{ heading: "Home", link: '', bold: false }, { heading: "Flow Builder", link: '/flows/', bold: true }],
    home: [{ heading: "Home", link: '', bold: true }, { heading: "Flow Builder", link: '/flows', bold: false },
    { heading: "Dashboard", link: '/products/add', bold: false }],
    chooseVerticle: [],
    addProduct: [{ heading: "Home", link: '', bold: false }, { heading: "Add Product", link: '/products/add', bold: true }],
    products: [{ heading: "Home", link: '', bold: false }, { heading: "Products", link: '/products', bold: true }],
    store: []
  }
  navHeadings: any = [];

  ngOnInit(): void {

    if (this.router.url == "/") {
      this.navHeadings = this.navOptionalHeadings.home;
    }
    else if (this.router.url == "/flows") {
      this.navHeadings = this.navOptionalHeadings.flows;
    }
    else if (this.router.url == "/signup") {
      this.navHeadings = this.navOptionalHeadings.signUp;
    }
    else if (this.router.url.includes("/flows/")) {
      this.navOptionalHeadings.flowbuilder[1].link = this.router.url;
      this.navHeadings = this.navOptionalHeadings.flowbuilder;
    }
    else if (this.router.url == "/signin") {
      this.navHeadings = this.navOptionalHeadings.signIn;
    } else if (this.router.url == "/chooseverticle") {
      this.navHeadings = this.navOptionalHeadings.chooseVerticle;
    } else if (this.router.url == "/products/add") {
      this.navHeadings = this.navOptionalHeadings.addProduct;
    }
    else if (this.router.url == "/products") {
      this.navHeadings = this.navOptionalHeadings.products;
    }  else if (this.router.url == "/store") {
      this.navHeadings = this.navOptionalHeadings.store;
    }


    const ownerId = localStorage.getItem("ownerId");
    const accessToken = localStorage.getItem("accessToken")
    const username = localStorage.getItem("username");

    if (username && accessToken && ownerId) {
      this.username = username
    }
  }

  logOut(){
    localStorage.clear();
  }

}
