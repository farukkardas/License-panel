import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginModel } from 'src/app/models/LoginModel';
import { SingleResponseModel } from 'src/app/models/SingleResponseModel';
import { TokenModel } from 'src/app/models/TokenModel';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/ResponseModel';
import { TimeModel } from '../models/timeModel';
import jwt_decode from "jwt-decode";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }
  apiUrl = "http://localhost:7225/api/auth/";
  timeUrl = "https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Istanbul";
  login(loginModel: LoginModel) {
    let allPath = this.apiUrl + "login";
    return this.httpClient.post<SingleResponseModel<TokenModel>>(allPath, loginModel);
  }

  isAuth() {
    if (this.cookieService.get("jwt")) {
      return true;
    }
    return false;
  }

  checkIfHavePermission() : boolean {
    var role = localStorage.getItem("xx")
    var bytes = CryptoJS.AES.decrypt(role, 'superkey');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (originalText.includes("localseller")) {
     return false;
    }
    else {
      return true;
    }
  }

  checkSkOutdated(): Observable<ResponseModel> {
    let uid = this.cookieService.get("uid")
    let formData = new FormData();
    formData.append("userId", uid)
    return this.httpClient.post<ResponseModel>(this.apiUrl + "checkskoutdated", formData);
  }

  logout() {
    this.cookieService.deleteAll()
    localStorage.removeItem("xx")
    window.location.reload()
  }

  testTime(): Observable<TimeModel> {
    return this.httpClient.get<TimeModel>(this.timeUrl);
  }

  checkJwtExpired(): Boolean {
    let token = this.cookieService.get("jwt");

    if (token) {
      let decoded: any = jwt_decode(token);
      let exp = decoded.exp;
      let now = new Date().getTime() / 1000;
      if (now > exp) {
        return true;
      }
      return false;
    }

    return false;
  }


}
