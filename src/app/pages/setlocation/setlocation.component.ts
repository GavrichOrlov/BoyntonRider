import { Component, OnInit, NgZone } from '@angular/core';
import { IoncabServicesService } from '../../services/ioncab-services.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { google } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-setlocation',
  templateUrl: './setlocation.component.html',
  styleUrls: ['./setlocation.component.scss'],
})
export class SetlocationComponent implements OnInit {
  searchItem = '';
  autocompleteItems = [];
  public search_lat: number;
  public search_lng: number;
  public search_latitude: number;
  public search_longitude: number;
  item: any;
  public location;
  constructor(private __zone: NgZone, 
    public serviceProvider: IoncabServicesService,
     public modalCtrl: ModalController, 
     public route: Router) { }

  ngOnInit() {}
  searcOnChnage() {
    console.log('update search', this.searchItem);
    if (this.searchItem) {
      const service = new window['google'].maps.places.AutocompleteService();
        service.getPlacePredictions({ input: this.searchItem, componentRestrictions: { country: 'US' } }, (predictions, status) => {
      //  service.getPlacePredictions({ input: this.searchItem, componentRestrictions: { country: 'RU' } }, (predictions, status) => {
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
