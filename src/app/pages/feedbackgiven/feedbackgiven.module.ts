import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'

import { IonicModule } from '@ionic/angular';

import { FeedbackgivenPage } from './feedbackgiven.page';
// import { SetlocationComponent } from '../setlocation/setlocation.component';
const routes: Routes = [
  {
    path: '',
    component: FeedbackgivenPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule,
    AgmDirectionModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    FeedbackgivenPage
  ]
})
export class FeedbackgivenPageModule {}
