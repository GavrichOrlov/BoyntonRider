import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IoncabServicesService } from '../services/ioncab-services.service';
import { MouseEvent } from '@agm/core';
@Component({
  selector: 'app-editlocationn',
  templateUrl: './editlocationn.component.html',
  styleUrls: ['./editlocationn.component.scss'],
})
export class EditlocationnComponent implements OnInit {
  searchItem = '';
  autocompleteItems = [];
  public lat: number;
  public lng: number;
  public latitude: number;
  public longitude: number;
  item: any;
  zoom: number = 8;
  public location;
  public screenOptions;
  constructor(public modalCtrl: ModalController, public __zone: NgZone, public serviceProvider: IoncabServicesService) {
    this.lat = 26.9124;
    this.lng = 75.7873;
   }

  ngOnInit() {}
  searcOnChnage() {
    console.log('update search', this.searchItem);
    if (this.searchItem) {
      const service = new window['google'].maps.places.AutocompleteService();
      service.getPlacePredictions({ input: this.searchItem, componentRestrictions: { country: 'IN' } }, (predictions, status) => {
        console.log(predictions);
        this.autocompleteItems = [];
        this.__zone.run(() => {
          if (predictions != null) {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction.description);
              console.log(this.autocompleteItems, 'autocomplete array');
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
    console.log(e, 'full address')
    this.modalCtrl.dismiss();
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
  markers: marker[];
}
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}