import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '../main/main.component';
const routes: Routes = [

  {
    path: 'flow/:id',
    component: MainComponent,
    children: []
  },

  {
    path: '**',

    component: MainComponent,
    children: []
  },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
