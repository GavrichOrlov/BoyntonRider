import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {hostApi} from "../global";
import {Observable} from "rxjs/index";
import { BehaviorSubject } from 'rxjs';

const OPTIONS = {
    headers: new HttpHeaders({
        "Content-Type": "application/json"
    })
};
@Injectable({
  providedIn: 'root'
})
export class ServerService {
user: BehaviorSubject<any> = new BehaviorSubject<any>('');
  constructor(private http: HttpClient) { }

  //riders
  ridercreate(value): any {
    const postData = {
        firstname: value.firstname,
        lastname: value.lastname,
        email: value.email,
        password: value.password,
        phonenumber: value.phonenumber,
        city: value.city
    };
    console.log(postData);
    return this.http.post(hostApi + "ridersignup", postData, OPTIONS).toPromise();
    }

    riderlogin(value) {
        const postData = {
            email: value.email,
            password: value.password
        };
        return this.http.post(hostApi + "ridersignin", postData, OPTIONS).toPromise();
    }
    riderlogout() {
        const postData = {
            value: "logout"
        };
        return this.http.post(hostApi + "riderlogout", postData, OPTIONS).toPromise();
    }

    uploadriderProfileImage(value: any): Observable<any> {
        return this.http.post(hostApi + "rideruploadprofile", value, OPTIONS);
    }
    updaterideritem(postData): any {
        return this.http.post(hostApi + "riderupdate", postData, OPTIONS).toPromise();
    }
    getriderLocation(postData){
        return this.http.post(hostApi + "getriderLocation", postData, OPTIONS).toPromise();
    }
    getDriverTypes(postData){
        return this.http.post(hostApi + "getdrivertypes", postData, OPTIONS).toPromise();
    }
    getdriverLocation(postData){
        return this.http.post(hostApi + "getdriverlocation", postData, OPTIONS).toPromise();
    }
    checkStatus(postData){
        return this.http.post(hostApi + "checkstatus", postData, OPTIONS).toPromise();
    }
    getDriver(postData){
        return this.http.post(hostApi + "getdriver", postData, OPTIONS).toPromise();
    }
    createstripe(postData){
      return this.http.post(hostApi + "createstripe", postData, OPTIONS).toPromise();
    }
    completebooking(postData){
        return this.http.post(hostApi + "chargestripe", postData, OPTIONS).toPromise();
    }
    cancelbooking(postData){
        return this.http.post(hostApi + "cancelbooking", postData, OPTIONS).toPromise();
    }
    canceltrip(postData){
        return this.http.post(hostApi + "canceltrip", postData, OPTIONS).toPromise();
    }
    //bako added
    ridergivenfeedback(postData): any {
        return this.http.post(hostApi + "ridergivenfeedback", postData, OPTIONS).toPromise();
    }
}
