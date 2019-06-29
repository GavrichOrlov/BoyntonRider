import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { ToastController, LoadingController, AlertController, ModalController,
  MenuController, } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IoncabServicesService } from '../../services/ioncab-services.service';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';
import {hostApi} from "../../global";

declare var google;

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.page.html',
  styleUrls: ['./pickup.page.scss'],
})
export class PickupPage implements OnInit {
  user: any;
  toast: any;
  lineCoordinates = [];
  block: any;
  street: any;
  building: any;
  zoom: number = 8;
  starsCount: number;
  lat: number;
  lng: number;
  customerInfo: any;
  userid: any;
  markers: marker[];
  host_url: string;
  url: any;
  public screenOptions;

  public markerOptions = {
    origin: {
      animation: '\'DROP\'',
      label: 'origin',

    },
    destination: {
      animation: '\'DROP\'',
      label: 'destination',

    },
  }
   renderOptions = {
    suppressMarkers: true,
  }
  constructor(
    public serviceProvider: IoncabServicesService,
    private auth: ServerService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public geolocation: Geolocation,
    private route: Router
  ) {}

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  ngOnInit() {
    this.host_url = hostApi + 'public/';
    this.url = { url: '../../../assets/img/cab.png', scaledSize: { width: 30, height: 30 } };
    this.auth.user.subscribe(res => {
      this.userid = res.uid;
      this.checkUserStatus();
    });
    this.customerInfo = this.serviceProvider.customerLocation;
    // const parsedObj = JSON.parse(driverinfo._body);
    
    this.user = JSON.parse(localStorage.getItem("user"));
    this.initsetTime();
  }
  initsetTime(){
    setTimeout(()=>{
      this.getLocataionData();
    }, 6000);
  }

  getLocataionData() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude
      this.lng = resp.coords.longitude
      this.serviceProvider.directionlat = this.lat
      this.serviceProvider.directionlng = this.lng
    });
    let data = {
      lat: this.serviceProvider.directionlat,
      lng: this.serviceProvider.directionlng,
      user_id: this.user.id,
      driver_id: this.serviceProvider.driver_id,
      order_id: this.serviceProvider.order_id,
      user_kind: 2
    }
    this.auth.getdriverLocation(data).then((res: any) => {
      if(res.data == "empty"){
        this.initsetTime();
      } else {
        if(res.notification === "arrived"){
          this.showToast();
          this.serviceProvider.driver_arrived = true;
          this.HideToast();
          this.initsetTime();
        } else if(res.notification === "completed"){
          this.showCompletedOnOrder();
        } else {
          this.serviceProvider.driverInfo.lat = res.data.lat;
          this.serviceProvider.driverInfo.lng = res.data.lng;
          this.initsetTime();
        }
      }
    }, err => {
      alert(err);
    });
  }
  
  async showCompletedOnOrder(){
    const alert = await this.alertCtrl.create({
      header: 'Completed Ride',
      message:
        'Your ride has been successfully completed!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.route.navigate(['feedbackgiven']);
          }
        }
      ]
    });
    return await alert.present();
  }
  showToast() {
    this.toast = this.toastCtrl.create({
      message: 'Driver arrived...',
      duration: 3000
    }).then((toastData)=>{
      toastData.present();
    });
  }
  HideToast(){
    this.toast = this.toastCtrl.dismiss();
  }
  async showNotifiction(){
    // const profileModal: any = await this.serviceProvider.cabModal(NotificationComponent,'backTransparent');
    // profileModal.present();
  }

  checkUserStatus() {
    this.serviceProvider.checkStatus(this.userid).subscribe(res => {
      if (res['rideOn'] === false) {
        this.route.navigate(['menu/home']);
      }
    });
  }
  completeBooking(){
    let data = {
      id: this.serviceProvider.stripetoken_id,
      token_id: this.serviceProvider.stripetoken.id
    }
    this.auth.completebooking(data).then(async(res: any) => {
      if(res.success){
        this.route.navigate(['feedbackgiven']);
      }
    });
  }
  callDriver(){
    //call function
  }
  cancelBooking(){
    let data = {
      id: this.serviceProvider.stripetoken_id
    }
    this.auth.cancelbooking(data).then(async (res: any) => {
      if(res.success){
        const alert = await this.alertCtrl.create({
        header: 'canceled',
        message:
          res.success,
        buttons: [
          
          {
            text: 'OK',
            handler: () => {

            }
          }
          // {
          //   text: 'No',
          //   role: 'cancel',
          //   handler: () => {

          //   }
          // }
        ]
      });
      await alert.present();
      // this.serviceProvider.showdestination = '';
      // this.serviceProvider.destinationlatitude = '';
      // this.serviceProvider.destinationlongititude = ';';
      // this.serviceProvider.destination = '';
      // this.serviceProvider.marker = true;
      this.serviceProvider.driver_index ++;
      console.log(this.serviceProvider.driver_index);
      this.route.navigate(['requestride']);
      }
    });
  }
  cancelTrip(){
    let data = {
      id: this.serviceProvider.order_id
    }
    this.auth.canceltrip(data).then(async (res: any) => {
      if(res.success){
        const alert = await this.alertCtrl.create({
        header: 'canceled',
        message:
          res.success,
        buttons: [
          {
            text: 'OK',
            handler: () => {

            }
          }
        ]
      });
      await alert.present();
      // this.serviceProvider.showdestination = '';
      // this.serviceProvider.destinationlatitude = '';
      // this.serviceProvider.destinationlongititude = ';';
      // this.serviceProvider.destination = '';
      // this.serviceProvider.marker = true;
      this.serviceProvider.driver_index ++; 
      this.route.navigate(['requestride']);
      }
    });
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

