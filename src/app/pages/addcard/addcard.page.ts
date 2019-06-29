import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController  } from '@ionic/angular';
import { Stripe } from '@ionic-native/stripe/ngx';
import {ServerService} from "../../services/server.service";
import { IoncabServicesService } from '../../services/ioncab-services.service';

@Component({
  selector: 'app-addcard',
  templateUrl: './addcard.page.html',
  styleUrls: ['./addcard.page.scss'],
})
export class AddcardPage implements OnInit {
  public binded: any;
  public customYearValues;
  public re = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  card_number: any;
  cvv_number: any;
  expiry_date: any;
  user: any;
  constructor(
    public navCtrl: NavController,
    private db: ServerService,
    private stripe: Stripe, 
    public serviceProvider: IoncabServicesService,
    public alertCtrl: AlertController) {
    
  }
  dismiss() {
    this.navCtrl.back();
  }
  ngOnInit() {
    this.stripe.setPublishableKey('pk_test_KNe3a137gq3rsW672viR6vPA00Qt8oufM7');
  }
  submit() {
    const date = new Date(this.expiry_date);
    this.user = JSON.parse(localStorage.getItem("user"));
    let card = {
      number: this.card_number.toString(),
      expMonth: date.getMonth()+1,
      expYear: date.getFullYear(),
      cvc: this.cvv_number.toString(),
      type_id: this.serviceProvider.type_id,
      rider_id: this.user.id
    };
    this.db.createstripe(card).then(async(res: any) => {
      if (res.success) {
        this.serviceProvider.stripetoken = res.token;
        this.serviceProvider.stripetoken_id = res.id;
        const alert = await this.alertCtrl.create({
          header: 'Success!',
          message: res.success,
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {
  
              }
            }
          ]
        });
      return await alert.present();
      }
      else{
        const alert = await this.alertCtrl.create({
          header: 'Error!',
          message: res.error,
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {
  
              }
            }
          ]
        });
      return await alert.present();
      }
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: err,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            cssClass: 'secondary',
            handler: blah => {

            }
          }
        ]
      });
      return await alert.present();
    });
    this.dismiss();
  }
  clicked(){
  }
}

