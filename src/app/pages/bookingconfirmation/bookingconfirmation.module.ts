import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ProgressBarModule } from 'angular-progress-bar'

import { BookingconfirmationPage } from './bookingconfirmation.page';

const routes: Routes = [
  {
    path: '',
    component: BookingconfirmationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgressBarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingconfirmationPage]
})
export class BookingconfirmationPageModule {}
