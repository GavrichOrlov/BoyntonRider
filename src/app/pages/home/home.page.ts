import { Component, NgZone, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MouseEvent, MapsAPILoader } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { IoncabServicesService } from '../../services/ioncab-services.service';
import { ServerService } from "../../services/server.service";

import { PaymentPageComponent } from '../payment-page/payment-page.component';
import { SetlocationComponent } from '../setlocation/setlocation.component';
import { NotificationComponent } from '../notification/notification.component';

import {hostApi} from "../../global";
import { forEach } from '@angular/router/src/utils/collection';

declare var google;

const PUSHER_API_KEY = '68eefd5f3327f36ea517';
const PUSHER_CLUSTER = 'mt1';

const OPTIONS_HEADER = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT",
    "Accept": "application/json",
    "Content-Type": "application/json"
  })
};
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('search') searchElementRef: ElementRef;

  user: any = {};
  public searchControl: FormControl;
  public formatted_address: string;
  public options = {
    suppressMarkers: true,
  };
  data : any;
  driver : any;
  lineCoordinates = [];
  comments = [];
  message: string;
  rating = {
    good: 0,
    bad: 0
  };
  public waypoints: any = []
  public show = true;
  zoom: number = 12;
  starsCount: number;
  public lat: number;
  public lng: number;
  public address: Object;

  map: any;
  showpickup = '';
  markers = [];
  street: any;
  building: any;
  public origin: any;
  public destination: any
  pickup: boolean;
  loader: any;
  block: any;
  color = ['black', 'black', 'black'];
  item: { color: string; size: number; margin: number; hw: number; icolor: string; ml: number; marginpic: number; flag: boolean; name: string }[];
  dir: { origin: { lat: number; lng: number; }; destination: { lat: number; lng: number; }; };
  host_url: string;
  locations = [];
  drivers = [];

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
  
  public screenOptions;

  searchItem = '';
  autocompleteItems = [];
  searach_Item_Flag = false;
  public search_lat: number;
  public search_lng: number;
  public search_latitude: number;
  public search_longitude: number;
  searach_item: any;

  public location;
  constructor(
    private __zone: NgZone,
    public geolocation: Geolocation,
    public serviceProvider: IoncabServicesService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public http : HttpClient,
    public route: Router,
    private db: ServerService) {
    if (this.serviceProvider.destination === '') {
      this.pickup = true;
      this.serviceProvider.marker = true;
    }
    this.getCurrentLoaction();
    this.show = true;
    this.item = [{
      color: '#f4f4f4',
      size: 1.2,
      margin: 0,
      hw: 40,
      icolor: 'black',
      ml: 35,
      marginpic: 5,
      flag: false,
      name: 'black'
    }, {
      color: '#f4f4f4',
      size: 1.2,
      margin: 0,
      hw: 40,
      icolor: 'black',
      ml: 35,
      marginpic: 5,
      flag: false,
      name: 'black'

    }, {
      color: '#f4f4f4',
      size: 1.2
      , margin: 0,
      hw: 40,
      icolor: 'black',
      ml: 35,
      marginpic: 5,
      flag: false,
      name: 'black'
    }];
  }

  async getCurrentLoaction() {
    const loader = await this.serviceProvider.loading('Getting your location..');
    loader.present()
    this.geolocation.getCurrentPosition().then((resp) => {
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      // const mapOptions = {
      //   center: latLng,
      //   zoom: this.zoom,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP,
      //   defaultView: false
      // }
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.serviceProvider.directionlat = this.lat;
      this.serviceProvider.directionlng = this.lng;
      this.serviceProvider.originlatitude = this.lat;
      this.serviceProvider.originlongititude = this.lng;
      // this.map = new google.maps.Map(mapOptions);
      this.getGeoLocation(resp.coords.latitude, resp.coords.longitude);
      this.lineCoordinates.push(new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude));
      loader.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
    }).finally(() => {
      
    });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

    });
  }

  async getGeoLocation(lat: number, lng: number) {
    if (navigator.geolocation) {
      const geocoder = await new google.maps.Geocoder();
      const latlng = await new google.maps.LatLng(lat, lng);
      // console.log(latlng);
      const request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          const rsltAdrComponent = result.address_components;
          if (result !== null) {
            if (rsltAdrComponent[0] !== null) {
              this.block = rsltAdrComponent[0].long_name;
              this.street = rsltAdrComponent[2].short_name;
              this.building = rsltAdrComponent[1].short_name;
            }
            if (this.serviceProvider.flag === true && this.serviceProvider.pickup !== 'India') {
              this.serviceProvider.showpickup = this.block + ' ' + this.street + ' ' + this.building;
            } else if (this.serviceProvider.pickup !== 'India') {
              this.serviceProvider.showdestination = this.street + this.building;
            }
          } else {
            alert('No address available!');
          }
        }
      });
    }
  }

// set type property of selected car 

  async openImageCtrl(name, path, type_id, mile_price, speed) {
    this.serviceProvider.carname = name;
    this.serviceProvider.path = path;
    this.serviceProvider.type_id = type_id;
    this.serviceProvider.mile_price = mile_price;
    this.serviceProvider.speed = speed;
    let directionsService = new google.maps.DirectionsService();

    let request = {
      origin      : this.serviceProvider.showpickup, // a city, full address, landmark etc
      destination : this.serviceProvider.showdestination,
      travelMode  : google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if ( status == google.maps.DirectionsStatus.OK ) {
        document.getElementById('distance').setAttribute('value', (response.routes[0].legs[0].distance.value / 1609.34).toFixed(1));
        document.getElementById('amount').setAttribute('value', (response.routes[0].legs[0].distance.value / 1609.34  * 12).toFixed(1));
      }
      else {
        // oops, there's no route between these two locations
        // every time this happens, a kitten dies
        // so please, ensure your address is formatted properly
      }
    });
  }

  async request_ride(){
    if (this.serviceProvider.showdestination === '') {
      // this.modalCtrl.dismiss();
      const toast: any = await this.serviceProvider.presentToast('You Must select Destination Location First For Ride');
      await toast.present();
    } else if(this.serviceProvider.carname === ''){
      // this.modalCtrl.dismiss();
      const toast: any = await this.serviceProvider.presentToast('You Must select Dirver Model First For Ride');
      await toast.present();
    } else {
      // this.modalCtrl.dismiss();
      this.route.navigate(['requestride']);
    }
    // const profileModal: any = await this.serviceProvider.cabModal(PaymentPageComponent,'backTransparent');
    // profileModal.present();
  }
  changeStyle(j) {
    for (let i = 0; i < this.drivers.length; i++) {
      this.item[i].ml = 0;
      this.item[i].color = '#f4f4f4';
      this.item[i].size = 1.2;
      this.item[i].margin = 0;
      this.item[i].marginpic = 5;
      this.item[i].icolor = 'black';
      this.item[i].hw = 65;
      this.color[i] = 'black';
      this.item[i].flag = false;
      this.item[i].name = 'black';
    }
    this.item[j].flag = true;
    this.color[j] = '#3880ff';
    this.item[j].hw = 70;
    this.item[j].margin = 5;
    this.item[j].color = '#3880ff';
    this.item[j].size = 2;
    this.item[j].ml = 0;
    this.item[j].marginpic = 0;
    this.item[j].icolor = 'white';
    this.item[j].name = '#3880ff'

  }
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
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
    this.getCurrentLoaction();
    this.user = JSON.parse(localStorage.getItem("user"));
    this.getDriverTypes();
    // this.initsetTime();
  }

  getDriverTypes(){
    let data = {
      id: this.user.id
    }
    this.db.getDriverTypes(data).then((res: any) => {
      this.host_url = hostApi + 'public/';
      this.drivers = res.data;
      for(let i = 0; i < res.data.length; i++){
        this.item.push({
          color: '#f4f4f4',
          size: 1.2,
          margin: 0,
          hw: 65,
          icolor: 'black',
          ml: 35,
          marginpic: 5,
          flag: false,
          name: 'black'
        });
      }
    }, err => {
      alert(err);
    });
  }

  initsetTime(){
    setTimeout(()=>{
      this.getLocataionData();
    }, 5000);
  }

  getLocataionData() {
    let data = {
      lat: this.lat,
      lng: this.lng,
      user_id: this.user.id,
      user_kind: 2
    }
    this.db.getriderLocation(data).then((res: any) => {
      if(res.data == "empty"){
      } else {
        // this.locations  = res.data;
        // this.drivers = res.data;
        // for(let i = 0; i < res.data.length; i++){
        //   this.locations[i].icon  = { url: hostApi + res.data[i].icon, scaledSize: { width: 20, height: 20 } };
        //   this.item.push({
        //     color: '#f4f4f4',
        //     size: 1.2,
        //     margin: 0,
        //     hw: 40,
        //     icolor: 'black',
        //     ml: 35,
        //     marginpic: 5,
        //     flag: false,
        //     name: 'black'
        //   });
        // }
      }
      // if(res.notification === "accepted"){
      //   this.serviceProvider.order = res.notification_data;
      //   this.showNotifiction();
      // } else{
      //   this.initsetTime();
      // }
      this.initsetTime();
    }, err => {
      alert(err);
    });
  }
  async showNotifiction(){
    const profileModal: any = await this.serviceProvider.cabModal(NotificationComponent,'backTransparent');
    profileModal.present();
  }
  sendComment() {
    console.log(this.message)
    if (this.message != "") {
      this.http.post(hostApi, {message: this.message}).subscribe((res: any) => {
        this.message = '';
      });
    }
  }

  updateMap(data){
    this.lat = parseFloat(data.lat);
    this.lng = parseFloat(data.long);

    this.map.setCenter({lat:this.lat, lng:this.lng, alt:0});
    // this.markers.push({lat:this.lat, lng:this.lng, alt:0});

    this.lineCoordinates.push(new google.maps.LatLng(this.lat, this.lng));

    let lineCoordinatesPath = new google.maps.Polyline({
      path: this.lineCoordinates,
      geodesic: true,
      map: this.map,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  }
  async gotoEdit(name, value, open) {
    this.serviceProvider.pickupLocation = name;
    if (open === 'modal') {
      const modal = await this.modalCtrl.create({
        component: SetlocationComponent,
      });

      await modal.present();
      await modal.onDidDismiss();
      if (this.serviceProvider.showpickup === '') {
        this.origin = { lat: this.lat, lng: this.lng }
      } else {
        if (this.serviceProvider.originlatitude && this.serviceProvider.originlongititude) {
          this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude }
        } else {
          this.origin = { lat: this.lat, lng: this.lng }
        }
        this.destination = { lat: this.serviceProvider.destinationlatitude, lng: this.serviceProvider.destinationlongititude }
        this.serviceProvider.marker = false;
      }
    }
    this.pickup = value

  }
   async openLocationModal(){

  }
  searcOnChnage() {
    console.log('update search', this.searchItem);
    if (this.searchItem) {
      const service = new window['google'].maps.places.AutocompleteService();
      // service.getPlacePredictions({ input: this.searchItem, componentRestrictions: { country: 'US' } }, (predictions, status) => {
        service.getPlacePredictions({ input: this.searchItem, componentRestrictions: { country: 'RU' } }, (predictions, status) => {
        // console.log(predictions);
        this.autocompleteItems = [];
        this.__zone.run(() => {
          if (predictions != null) {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction.description);
              // console.log(this.autocompleteItems, 'autocomplete array');
            });
          }
        });
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  chooseItem(e) {
    if (this.serviceProvider.pickupLocation === 'pickup') {
      this.serviceProvider.showpickup = e
      // console.log('pickup success');
      this.serviceProvider.getLatLan(e).subscribe(result => {
        this.__zone.run(() => {
          this.search_lat = result.lat();
          this.search_lng = result.lng();
          this.serviceProvider.originlatitude = this.search_lat;
          // console.log(this.serviceProvider.originlatitude, 'chooseitem originlatitude pickup');
          this.serviceProvider.originlongititude = this.search_lng;

          // console.log(this.serviceProvider.originlongititude, 'chooseitem originlongititude pickup');
          this.modalCtrl.dismiss();
        })
      }, error => console.log(error),
        () => console.log('pickup completed'))
    }
    if (this.serviceProvider.pickupLocation === 'destination') {
      // console.log('destination success');
      this.serviceProvider.showdestination = e
      this.serviceProvider.getLatLan(e).subscribe(result => {
        this.__zone.run(() => {
          this.search_latitude = result.lat();
          this.search_longitude = result.lng();
          this.serviceProvider.destinationlatitude = this.search_latitude;
          this.serviceProvider.destinationlongititude = this.search_longitude;
          // console.log(this.serviceProvider.destinationlatitude, 'chooseitem destinationlatitude');
          // console.log(this.serviceProvider.destinationlongititude, 'chooseitem destinationlongititude');
          this.modalCtrl.dismiss();
        })
      }, error => console.log(error),
        () => console.log('pickup completed'))
    }
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}