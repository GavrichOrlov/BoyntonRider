import { Component, OnInit } from '@angular/core';
import { IoncabServicesService } from '../../services/ioncab-services.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  destination: any;
  carName: any;
  order: any;
  constructor(public serviceProvider: IoncabServicesService, public modalCtrl: ModalController, public route: Router ) {
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  async routeModal() {
    if (this.serviceProvider.showdestination === '') {
      this.modalCtrl.dismiss();
      const toast: any = await this.serviceProvider.presentToast('You Must select Destination Location First For Estimate Fare');
      await toast.present();
    } else {
      this.modalCtrl.dismiss();
      this.route.navigate(['requestride']);
    }
  }
  ngOnInit() {}

}

