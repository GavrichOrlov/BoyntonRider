import { Component, OnInit } from '@angular/core';
import { IoncabServicesService } from '../../services/ioncab-services.service';
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerService } from '../../services/server.service';
import {hostApi} from "../../global";

declare var google;

const OPTIONS = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT",
    "Accept": "application/json",
    "Content-Type": "application/json"
  })
};

@Component({
  selector: 'app-requestride',
  templateUrl: './requestride.page.html',
  styleUrls: ['./requestride.page.scss'],
})

export class RequestridePage implements OnInit {
  data: {
    iconName: string;
    iconName2: string;
    label: string;
    image: string;
    label2: string;
    text: string;
    text2: string;
    head: string;
  }[];
  public lat: Number;
  public lng: Number;
  public origin: any;
  public destination: any;
  userid: any;
  markers = [];
  zoom: number;
  getData: Promise<void>;

  markerOptions = {
    origin: {
      animation: '\'DROP\'',
      label: 'origin'
    },
    destination: {
      animation: '\'DROP\'',
      label: 'destination'
    }
  };

  public screenOptions;

  constructor(
    public serviceProvider: IoncabServicesService,
    public alertCtrl: AlertController,
    public route: Router,
    private http: HttpClient,
    private auth: ServerService,
    public loadCtrl: LoadingController,
    public toastController:ToastController) {
      this.lat = this.serviceProvider.directionlat;
      this.lng = this.serviceProvider.directionlng;
  }

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
  async alertOnSubmit() {
    if(this.serviceProvider.stripetoken){
      const alert = await this.alertCtrl.create({
        header: 'Confirm Booking',
        message:
          'Your driver will arrive shortly. Do you want to confirm booking?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: blah => {
              console.log('Cancel booking');
            }
          },
          {
            text: 'Book',
            handler: () => {
              // this.route.navigate(['bookingconfirmation']);
              this.bookCab();
            }
          }
        ]
      });
    return await alert.present();
    } else{
      const alert = await this.alertCtrl.create({
        header: 'Add Card',
        message:
          'You have to Add card for this booking!',
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
  }
  async alertOnSchedule(){
    
  }
  ngOnInit() {
    this.userid = JSON.parse(localStorage.getItem("user")).id;
    this.getDirection();
    this.serviceProvider.checkStatus(this.userid).subscribe((result) => {
      const rideCheck = result['rideOn'];
      if (rideCheck === true) {
        this.route.navigate(['bookingconfirmation']);
      }
    });
    // this.auth.user.subscribe(res => {
    //   console.log(res);
    //   this.userid = res.uid;
    //   this.getDirection();
    //   this.serviceProvider.checkStatus(this.userid).subscribe((result) => {
    //     const rideCheck = result['rideOn'];
    //     if (rideCheck === true) {
    //       this.route.navigate(['bookingconfirmation']);
    //     }
    //   });
    // });
  }

  async bookCab() {
    const loading = await this.loadCtrl.create({
      message: 'Loading please wait...'
    })
    await loading.present();
    const obj = {};
    obj['origin'] = this.origin;
    obj['destination'] = this.destination;
    obj['uid'] = this.userid;
    let data = {
      origin_lat: this.origin.lat,
      origin_lng: this.origin.lng,
      destination_lat: this.destination.lat,
      destination_lng: this.destination.lng,
      uid: this.userid,
      did: this.serviceProvider.type_id,
      payment_id: this.serviceProvider.stripetoken_id,
      showpickup: this.serviceProvider.showpickup,
      showdestination: this.serviceProvider.showdestination,
      distance: this.serviceProvider.distance,
      amount: this.serviceProvider.amount,
      driver_index: this.serviceProvider.driver_index
    }
    this.auth.getDriver(data).then(async(res : any) => {
      await loading.dismiss();
      if (res.length === 0) {
        const toast = await this.toastController.create({
          message: 'No driver available at this moment',
          duration: 2000
        });
        toast.present()
      } else {
        this.serviceProvider.driverInfo = res;
        this.serviceProvider.driver_id = res.driver_id;
        this.serviceProvider.order_id = res.id;
        this.serviceProvider.customerLocation = { lat: this.lat, lng: this.lng, origin: this.origin, destination: this.destination };
        this.route.navigate(['bookingconfirmation']);
      }
    });
    // this.http.get(hostApi+'getdriver?origin_lat=' + this.origin.lat + '&origin_lng=' + this.origin.lng + 
    // '&destination_lat=' + this.destination.lat + '&destination_lng=' + this.destination.lng + 
    // '&uid=' + this.userid + '&did=' + this.serviceProvider.driver_id ).subscribe(async(res : any) => {
    // });
    // this.http.post(hostApi+'getdriver', obj, OPTIONS).toPromise().then(async(res: any) => {
    //   loading.dismiss();
    //   console.log(res);
    //   if (res.json().length === 0) {
    //     // console.log('No driver Found');
    //     const toast = await this.toastController.create({
    //       message: 'No driver available at this moment',
    //       duration: 2000
    //     });
    //     toast.present()

    //   } else {
    //     this.serviceProvider.driverInfo = res;
    //     this.serviceProvider.customerLocation = obj;
    //     this.route.navigate(['bookingconfirmation']);
    //   }

    // });
  }

  getDirection() {
    if (this.serviceProvider.showpickup === '') {
      this.origin = { lat: this.lat, lng: this.lng };
      console.log('if condictions serviceProvider');
      console.log(
        'this.serviceProvider.originlatitude',
        this.origin,
        this.destination
      );
    } else {
      if (
        this.serviceProvider.originlatitude &&
        this.serviceProvider.originlongititude
      ) {
        this.origin = {
          lat: this.serviceProvider.originlatitude,
          lng: this.serviceProvider.originlongititude
        };
      } else {
        this.origin = { lat: this.lat, lng: this.lng };
      }
      this.destination = {
        lat: this.serviceProvider.destinationlatitude,
        lng: this.serviceProvider.destinationlongititude
      };
      console.log(
        'this.serviceProvider.originlatitude',
        this.origin,
        this.destination
      );
    }
  }
}
interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}
