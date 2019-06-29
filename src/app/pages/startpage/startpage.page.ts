import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.page.html',
  styleUrls: ['./startpage.page.scss'],
})
export class StartpagePage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }
  goToLoginPage(){
    this.navCtrl.navigateForward('/login');
  }
  goToRegisterPage(){
    this.navCtrl.navigateForward('/register');
  }
}
