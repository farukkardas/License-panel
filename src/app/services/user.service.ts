import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/SingleResponseModel';
import { UserDetails } from '../models/UserDetails';
import { UserInfo } from '../models/userInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = "http://localhost:7225/api/user/";

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  getUserDetails() : Observable<SingleResponseModel<UserDetails>>{
    let uid = this.cookieService.get("uid")
    let sk = this.cookieService.get("sk")
    let header = new HttpHeaders().append("uid",uid).append("securityKey",sk)
    return this.httpClient.post<SingleResponseModel<UserDetails>>(this.apiUrl + "getuserdetails",{header:header})
  }

  getUserInfos() : Observable<SingleResponseModel<UserInfo>>{
    return this.httpClient.get<SingleResponseModel<UserInfo>>(this.apiUrl + "getuserinfo")
  }
}
