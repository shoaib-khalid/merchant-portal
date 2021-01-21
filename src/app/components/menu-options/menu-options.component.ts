import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Output, EventEmitter } from '@angular/core';

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
    @Output() open: EventEmitter<any> = new EventEmitter();


    constructor() {
    }
    ngAfterViewInit() {

    }
    openit() {
        this.menu.openMenu();
    }
    menuClicked() {
        this.open.emit('MENU_MESSAGE');
    }
    actionClicked() {
        this.open.emit("ACTION");

    }
    conditionClicked() {
        this.open.emit("CONDITION");
    }
    handOverClicked() {
        this.open.emit("HANDOVER");
    }
}