import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from 'src/app/services/api-calls.service';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectRegionPopupComponent } from '../select-region-popup/select-region-popup.component';
@Component({
  selector: 'app-choose-verticle',
  templateUrl: './choose-verticle.component.html',
  styleUrls: ['./choose-verticle.component.scss']
})
export class ChooseVerticleComponent implements OnInit {

  verticles: any = [];
  region: any = "";

  constructor(private apiCalls: ApiCallsService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.showverticals();
  }

  async getVerticles(region) {
    const data1: any = await this.apiCalls.getRegionVerticles();
    const data2 = data1.data;
    this.verticles = data2.filter(ele => ele.regionId == region)
  }

  storePage(code) {
    this.router.navigate([`/store/${code}`], { queryParams: { region:this.region } })
  }

  async showverticals() {
    this.apiCalls.checkCountry().then((data: any) => {
      const country = data.country;
      if (country == "Pakistan") {
        this.region = "SA";
      } else if (country == "Malaysia") {
        this.region = "SEA";
      } else {
        const dialogRef = this.dialog.open(SelectRegionPopupComponent, { disableClose: true });
        dialogRef.afterClosed().subscribe(result => {
          this.region=result;
          this.getVerticles(this.region);
        });
      }
      this.getVerticles(this.region);
    }, (error) => {
      const dialogRef = this.dialog.open(SelectRegionPopupComponent, { disableClose: true });
      dialogRef.afterClosed().subscribe(result => {
        this.region=result;
        this.getVerticles(this.region);
      });
    });

  }

}