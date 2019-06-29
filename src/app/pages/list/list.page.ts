import { Component, OnInit } from '@angular/core';
import { IoncabServicesService } from '../../services/ioncab-services.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  private selectedItem: any;
  public items = [];
  constructor(public ioncabservices: IoncabServicesService,public navCtrl:NavController) {
    this.items = this.ioncabservices.icons
   }
   dismiss() {
    this.navCtrl.back();
  }
  ngOnInit() {
  }

}
