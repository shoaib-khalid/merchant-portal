import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SideNav } from "./components/side-nav/side-nav.component";
import { FlowDialog } from './components/flow-dialog/flow-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MenuOptions } from './components/menu-options/menu-options.component';
import { SideNavAction } from "./components/side-nav-action/side-nav-action.component";
@NgModule({
  declarations: [
    SideNav,
    FlowDialog,
    AppComponent,
    MenuOptions,
    SideNavAction
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule
  ], entryComponents: [FlowDialog],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
