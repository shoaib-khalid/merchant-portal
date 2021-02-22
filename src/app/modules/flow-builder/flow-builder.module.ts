import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';


//user-defined components
import { SideNav } from "./components/side-nav/side-nav.component";
import { FlowDialog } from './components/flow-dialog/flow-dialog.component';
import { MenuOptions } from './components/menu-options/menu-options.component';
import { SideNavAction } from "./components/side-nav-action/side-nav-action.component";
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideNavHandOverComponent } from './components/side-nav-handover/side-nav-handover.component';
import { ActionDialog } from './components/action-dialog/action-dialog.component';
import { SideNavConditionComponent } from './components/side-nav-condition/side-nav-condition.component';



@NgModule({
  declarations: [
    SideNav,
    FlowDialog,
    MenuOptions,
    SideNavAction,
    MainComponent,
    FooterComponent,
    SideNavHandOverComponent,
    SideNavConditionComponent,
    ActionDialog,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSidenavModule,
    MatMenuModule,
    MatSelectModule,
    RouterModule

  ]
})
export class FlowBuilderModule { }
