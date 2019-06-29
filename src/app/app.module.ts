import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AgmCoreModule } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ServerService } from './services/server.service';
import {HttpClientModule} from "@angular/common/http";
import { Camera } from '@ionic-native/camera/ngx';
import {ImagePicker} from "@ionic-native/image-picker/ngx";
import { Stripe } from '@ionic-native/stripe/ngx';

import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { NotificationComponent } from './pages/notification/notification.component';

@NgModule({
  declarations: [AppComponent, PaymentPageComponent, NotificationComponent],
  entryComponents: [PaymentPageComponent, NotificationComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCnNMBSipK7BYeGXfAg-j_EeU3jWcUsDPs',
      libraries: ['places']
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ServerService,
    Camera,
    Geolocation,
    ImagePicker,
    Stripe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
