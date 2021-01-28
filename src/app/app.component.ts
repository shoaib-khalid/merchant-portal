import { Component } from '@angular/core';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})

export class AppComponent {

   public anchorPosition: boolean = true;
   graph: any;
   triggers: any;
   redoPointer: any;
   opened: boolean;

   constructor() { }

}