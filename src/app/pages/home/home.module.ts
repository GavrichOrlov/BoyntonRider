import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { SetlocationComponent } from '../setlocation/setlocation.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule,
    AgmDirectionModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    HomePage,
    SetlocationComponent
  ],
  entryComponents: [
    SetlocationComponent
  ]
})
export class HomePageModule {}
