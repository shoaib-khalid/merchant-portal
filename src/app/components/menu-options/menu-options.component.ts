import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

/**
 * @title Basic menu
 */
@Component({
    styleUrls: ['./menu-options.component.css'],
    selector: 'menu-options',
    templateUrl: 'menu-options.component.html',
})
export class MenuOptions {
    @ViewChild('clickmenu') menu: MatMenuTrigger;

    constructor() {
    }
    openit() {
        this.menu.openMenu();

    }
}