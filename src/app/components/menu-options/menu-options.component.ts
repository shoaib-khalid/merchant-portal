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
        alert("Menu Clicked")
        this.open.emit('open');
    }
    actionClicked() {
        alert("Action Clicked")
        this.open.emit("event");

    }
    conditionClicked() {
        this.open.emit("event");

        alert("Condition Clicked")
    }
}