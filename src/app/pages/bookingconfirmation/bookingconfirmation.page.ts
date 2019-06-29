import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {ServerService} from "../../services/server.service";
import { IoncabServicesService } from '../../services/ioncab-services.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-bookingconfirmation',
  templateUrl: './bookingconfirmation.page.html',
  styleUrls: ['./bookingconfirmation.page.scss'],
})
export class BookingconfirmationPage implements OnInit {
  progress: number = 10;
  userid: any;
  loader: any;
  order_id: any;
  timeout: boolean = false;
  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public statusBar: StatusBar,
    public route: Router,
    public navCtrl: NavController,
    private auth: ServerService,
    public serviceProvider: IoncabServicesService,
    public loadingCtrl: LoadingController
  ) {
    this.statusBar.backgroundColorByHexString('#000');
    this.Load();
  }
  
  ngOnInit() {}
  async Load() {
    this.loader = await this.serviceProvider.loading('Waiting for driver response...');

    this.progress = 10;
    await this.loader.present();
    // this.auth.user.subscribe(res => {
      // this.userid = res.uid;
    this.userid = JSON.parse(localStorage.getItem("user")).id;
    this.order_id = this.serviceProvider.order_id;
    this.initTime();
    // });
    setTimeout(() => {
      this.progress = 20;
    }, 1000);
    setTimeout(() => {
      this.progress = 30;
    }, 3000);
    setTimeout(() => {
      this.progress = 40;
    }, 4000);
    setTimeout(() => {
      this.progress = 50;
    }, 5000);
    setTimeout(() => {
      this.progress = 60;
    }, 6000);
    setTimeout(() => {
      this.progress = 70;
    }, 7000);
    setTimeout(() => {
      this.progress = 80;
    }, 8000);
    setTimeout(() => {
    }, 10000);
    setTimeout(async() => {
      if(!this.serviceProvider.order){
        await this.loader.dismiss();
        let data = {
          id: this.serviceProvider.stripetoken_id
        }
        this.auth.cancelbooking(data).then(async (res: any) => {
          if(res.success){
            const alert = await this.alertCtrl.create({
            header: 'No response!',
            message:
              "The driver does not respond. I'm sorry, Please choose again!",
            buttons: [
              {
                text: 'OK',
                handler: () => {
    
                }
              }
            ]
          });
          await alert.present();
          }
        });
        this.timeout = true;
        this.route.navigate(['menu/home']);
      }
    }, 30000);

  }
  initTime() {
    setTimeout(() => {
      this.checkUserStatus();
    }, 3000);
  }
  async checkUserStatus() {
    const data = {order_id: this.order_id}
    this.auth.checkStatus(data).then(async res => {
      if (res['rideOn']) {
        this.progress = 100;
        await this.loader.dismiss();
        this.serviceProvider.order = res['rideOn'];
        this.route.navigate(['pickup']);
      } else if (res['rejectRide']) {
        await this.loader.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message:
            'Driver cancelled your booking',
          buttons: [
            {
              text: 'Okey',
              handler: () => {
                // this.route.navigate(['bookingconfirmation']);
                this.route.navigate(['menu/home']);
              }
            }
          ]
        });
        return await alert.present();
      } else{
        if(!this.timeout)
          this.initTime();
      }
    });
    // this.serviceProvider.checkStatus(this.userid).subscribe(async res => {
    //   console.log(res);
    //   this.progress = 100;
    //   if (res['rideOn']) {
    //     this.loader.dismiss();
    //     this.route.navigate(['pickup']);
    //   } else if (res['rejectRide']) {
    //     this.loader.dismiss();
    //     const alert = await this.alertCtrl.create({
    //       header: 'Error',
    //       message:
    //         'Driver cancelled your booking',
    //       buttons: [
    //         {
    //           text: 'Okey',
    //           handler: () => {
    //             // this.route.navigate(['bookingconfirmation']);
    //             this.route.navigate(['patnermap']);
    //           }
    //         }
    //       ]
    //     });
    //     return await alert.present();

    //   }
    // });
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad BookingConfitmationPage');
  }
  //go to previous page
  goBack() {
    this.navCtrl.back();
  }

  // async loading() {
  //   const loader = await this.loadingCtrl.create({
  //     message: 'Please wait...',
  //   });
  //   this.serviceProvider.showbutton = true;
  //   await loader.present();
  //   setTimeout(() => {
  //     console.log('timeout');
  //     loader.dismiss()
  //   }, 9000);
  //   loader.onDidDismiss()
  //   console.log('loader got dismissed');
  //   this.route.navigate(['pickup']);
  // }

}
