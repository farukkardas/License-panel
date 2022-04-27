import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { KeyLicense } from 'src/app/models/KeyLicense';
import { ListResponseModel } from 'src/app/models/ListResponseModel';
import { ResponseModel } from '../models/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  apiUrl = "http://localhost:7225/api/license/";

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  getLicenses(): Observable<ListResponseModel<KeyLicense>> {
    return this.httpClient.get<ListResponseModel<KeyLicense>>(this.apiUrl + "getlicenses")
  }

  getLicensesByAppId(appId:number): Observable<ListResponseModel<KeyLicense>> {
    return this.httpClient.get<ListResponseModel<KeyLicense>>(this.apiUrl + "GetLicenseByAppId?applicationId=" + appId);
  }

  DeleteAllLicensesByAppId(applicationId: number) {
    const params = new HttpParams()

    return this.httpClient.post<ResponseModel>(this.apiUrl + "DeleteAllLicensesByAppId?applicationId=" + applicationId,params);
  }

  generateLicense(keyExpiration: number, applicationId: number) {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "newlicense?keyEnd=" + keyExpiration + "&applicationId=" + applicationId,params );
  }

  deleteLicense(deleteKeyId: number) {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "deletelicense?keyId=" + deleteKeyId,params );
  }

  resetHwid(keyId:number){
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "ResetHwid?keyId=" + keyId,params );
  }

  deleteAllKeys()
  {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "deletealllicenses",null);
  }

  resetAllHwids(){
    return this.httpClient.post<ResponseModel>(this.apiUrl + "resetalllicenses",null);
  }

  resetAllLicensesByAppId(applicationId: number) {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "ResetAllLicensesByAppId?applicationId=" + applicationId,params);
  }
  

}
