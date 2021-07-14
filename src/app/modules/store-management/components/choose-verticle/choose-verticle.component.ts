import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-choose-verticle',
  templateUrl: './choose-verticle.component.html',
  styleUrls: ['./choose-verticle.component.scss']
})
export class ChooseVerticleComponent implements OnInit {

  verticles: any = [];
  region: any = "";

  constructor(private apiCalls: ApiCallsService, private router: Router) { }

  ngOnInit(): void {
    this.showverticals();
  }

  async getVerticles(region) {
    const data1: any = await this.apiCalls.getRegionVerticles();
    console.log(data1)
    const data2= data1.data.content;
    this.verticles = data2.filter(ele=>ele.regionId==region)
  }

  storePage(code) {
    this.router.navigateByUrl(`/store/${code}`)
  }

  async showverticals() {
    const data: any = await this.apiCalls.checkCountry();
    const country = data.country;
    if (country == "Pakistan") {
      this.region = "SA";
    } else if (country == "Malaysia") {
      this.region = "SEA";
    }
    this.getVerticles(this.region);
  }

}