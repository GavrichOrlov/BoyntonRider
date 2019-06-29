import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {ServerService} from '../../services/server.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
 
  validation_messages = {
    'firstname': [
      { type: 'required', message: 'Firstname is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Lastname is required.' }
    ],
    'phonenumber': [
      { type: 'required', message: 'Phone number is required.' }
    ],
    'city': [
      { type: 'required', message: 'City is required.' }
    ],
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Enter a valid email.' }
   ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
  };
  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    public db: ServerService,
  ) { }

  ngOnInit() {
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
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    }); 
  }
  goToBack(){
    this.navCtrl.navigateBack('/startpage');
  }
  goToLogin(){
    this.navCtrl.navigateBack('/login');
  }
  createItem(newitem) {
    console.log(newitem.firstname);

    this.db.ridercreate(newitem).then((res: any) => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
        this.goToLogin();
    });
  }
}
