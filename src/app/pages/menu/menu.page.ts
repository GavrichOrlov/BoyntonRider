import { Component, OnInit } from '@angular/core';
import {Router, RouterEvent} from '@angular/router';
import {NavController, ModalController, AlertController, NavParams, ToastController} from '@ionic/angular';
import {ServerService} from "../../services/server.service";
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  user: any = {};
  selectedPath = '';
  errorMessage: string;
  successMessage: string;
  public content;
  public appPages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home',
      image: '../assets/img/avatar.png'
    },
    {
      title: 'Add card',
      url: '/menu/addcard',
      icon: 'cash'
    },
    {
      title: 'History',
      url: '/menu/history',
      icon: 'timer'
    },
    {
      title: 'Notification',
      icon: 'notifications-outline',
      toggle: true
    },
    {
      title: 'Help',
      url: '/menu/list',
      icon: 'help-circle'
    },
    {
      title: 'Logout',
      // url: '/home',
      icon: 'log-out'
    }
  ];
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private db: ServerService
  ) {
    this.router.events.subscribe((event: RouterEvent) =>{
      if(event && event.url){
        this.selectedPath = event.url;
      }
    });
   }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));
  }
  goToBack() {
    this.navCtrl.navigateBack('/startpage');
  }
  riderlogout() {
      this.db.riderlogout().then((res: any) => {
          console.log(res);
          this.errorMessage = "";
          this.successMessage = "Your account logout.";
          this.goToBack();
      });
  }
  logout(page) {
    if (page.title === 'Logout') {
      this.riderlogout();
    } else {
      this.router.navigate([page.url]);
    }
  }
  profile() {
    
    this.router.navigate(['/menu/profile']);
  }

}
