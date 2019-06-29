import { Component, OnInit } from '@angular/core';

import { IoncabServicesService } from '../../services/ioncab-services.service';
// import { SetlocationComponent } from '../setlocation/setlocation.component';
import { EditlocationnComponent } from '../../editlocationn/editlocationn.component';
import {ServerService} from "../../services/server.service";
import {ImagePicker} from "@ionic-native/image-picker/ngx";
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NavController, ModalController, AlertController, NavParams, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};
  data: { 'name': string; 'dial_code': string; 'code': string; }[];
  public customAlertOptions;

  firstname: any;
  lastname: any;
  phonenumber: any;
  city: any;
  validations_form: FormGroup;
  errorMessage: string;
  successMessage: string;
  sss: any;
  validation_messages = {
    'firstname': [
        {type: 'required', message: 'Firstname is required.'}
    ],
    'lastname': [
        {type: 'required', message: 'Lastname is required.'}
    ],
    'phonenumber': [
        {type: 'required', message: 'Phone number is required.'}
    ],
    'city': [
        {type: 'required', message: 'City is required.'}
    ]
  };
  constructor(
    public serviceProvider: IoncabServicesService,
    private db: ServerService,
    private imagePicker: ImagePicker,
    private navCtrl: NavController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder
    ) {
    this.data = serviceProvider.country
    console.log(this.data, 'data coming from service at register page')
  }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.validations_form = this.formBuilder.group({
      firstname: new FormControl('', Validators.compose([
          Validators.required,
      ])),
      lastname: new FormControl('', Validators.compose([
          Validators.required,
      ])),
      city: new FormControl('', Validators.compose([
          Validators.required,
      ])),
      phonenumber: new FormControl('', Validators.compose([
          Validators.required
      ]))
    });

  }
  async gotoEdit() {
    const profileModal: any = await this.serviceProvider.cabModal(EditlocationnComponent,'');
    profileModal.present();

  }
  uploadImage() {
    const app = this;
    this.imagePicker.getPictures({
        maximumImagesCount: 1,
        outputType: 1
    }).then((results) => {
        for (let i = 0; i < results.length; i++) {
            app.db.uploadriderProfileImage({id: app.user.id, profile: results[i]}).subscribe(res1 => {
                this.user.profile = "data:image/jpeg;base64," + results[i];
            });
        }
    }, (err) => {
    });
  }

  hasReadPermission() {
      this.imagePicker.hasReadPermission().then(res => {
          if (res) {
              this.uploadImage();
          } else {
              this.requestReadPermission();
          }
      });
  }

  requestReadPermission() {
      this.imagePicker.requestReadPermission();
      this.uploadImage();
  }
  updateItem(newitem) {
    const app = this;
    //console.log(app.user.id);
    //console.log(newitem.firstname);
    this.firstname = newitem.firstname;
    if(this.firstname == '')
        this.firstname = app.user.firstname;
    
    this.lastname = newitem.lastname;
    if(this.lastname == '')
        this.lastname = app.user.lastname;
    this.phonenumber = newitem.phonenumber;
    if(this.phonenumber == '')
        this.phonenumber = app.user.phonenubmer;
    this.city = newitem.city;
    if(this.city == '')
        this.city = app.user.city;
                            
    const postData = {
        id: app.user.id,
        firstname: this.firstname,
        lastname: this.lastname,
        phonenumber: this.phonenumber,
        city: this.city
    };
    console.log(this.validations_form.value);
    console.log(this.user.profile);
    this.db.updaterideritem(postData).then((res: any) => {
        console.log(res);
        this.sss = JSON.parse(localStorage.getItem("userid"));
        
        this.errorMessage = "";
        this.successMessage = "Your account has been updated.";
    });
  }

  async presentAlertConfirm(newitem) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: '<strong>Do you update user info?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.updateItem(newitem);
          }
        }
      ]
    });

    await alert.present();
  }
  goToBack(){
    this.navCtrl.back();
  }
}
