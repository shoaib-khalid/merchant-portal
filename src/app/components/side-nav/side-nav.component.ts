import {Component} from '@angular/core';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNav {
  opened:boolean;

  toggle(){
    if(this.opened){
      this.opened=false;
    }else{
      this.opened=true;
    }
  }
}