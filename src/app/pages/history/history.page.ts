import { Component, OnInit } from '@angular/core';
import { IoncabServicesService } from '../../services/ioncab-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  rating: number = 4;
  starsCount: number;
  data = [];
  cid: any;
  rides: any;
  constructor(
    public services: IoncabServicesService,
    public route: Router,
  ) {
    this.data = this.services.cards;
   }
   dismiss() {
    this.route.navigate(['/menu/home']);
  }
  ngOnInit() {
  }

}
