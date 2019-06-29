import { Component, OnInit } from '@angular/core';
import { IoncabServicesService } from '../../services/ioncab-services.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss'],
})
export class PaymentPageComponent implements OnInit {
  destination: any;
  carName: any;
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
