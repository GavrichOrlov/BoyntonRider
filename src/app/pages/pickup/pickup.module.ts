import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';
import { RatingModule } from 'ngx-rating';
import { AgmDirectionModule } from 'agm-direction';

import { PickupPage } from './pickup.page';

const routes: Routes = [
  {
    path: '',
    component: PickupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule,
    RatingModule,
    AgmDirectionModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PickupPage]
})
export class PickupPageModule {}
