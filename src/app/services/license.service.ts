import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable, tap } from 'rxjs';
import { KeyLicense } from 'src/app/models/KeyLicense';
import { ListResponseModel } from 'src/app/models/ListResponseModel';
import { ResponseModel } from '../models/ResponseModel';
import { SingleResponseModel } from '../models/SingleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  apiUrl = "http://localhost:7225/api/license/";

  constructor(private httpClient: HttpClient) { }

  getLicenses(): Observable<ListResponseModel<KeyLicense>> {
    return this.httpClient.get<ListResponseModel<KeyLicense>>(this.apiUrl + "getlicenses")
  }

  getLicensesByAppId(appId: number): Observable<ListResponseModel<KeyLicense>> {
    return this.httpClient.get<ListResponseModel<KeyLicense>>(this.apiUrl + "GetLicenseByAppId?applicationId=" + appId);
  }

  DeleteAllLicensesByAppId(applicationId: number) {
    const params = new HttpParams()

    return this.httpClient.post<ResponseModel>(this.apiUrl + "DeleteAllLicensesByAppId?applicationId=" + applicationId, params);
  }

  generateLicense(keyExpiration: number, applicationId: number): Observable<SingleResponseModel<KeyLicense>> {
    const params = new HttpParams()
    return this.httpClient.post<SingleResponseModel<KeyLicense>>(this.apiUrl + "newlicense?keyEnd=" + keyExpiration + "&applicationId=" + applicationId, params)
  }

  generateLicenseLocalSeller(keyExpiration: number): Observable<SingleResponseModel<KeyLicense>> {
    const params = new HttpParams()
    return this.httpClient.post<SingleResponseModel<KeyLicense>>(this.apiUrl + "newlicense?keyEnd=" + keyExpiration, params)
  }

  deleteLicense(deleteKeyId: number) {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "deletelicense?keyId=" + deleteKeyId, params);
  }

  resetHwid(keyId: number) {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "ResetHwid?keyId=" + keyId, params);
  }

  deleteAllKeys() {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "deletealllicenses", null);
  }

  resetAllHwids() {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "resetalllicenses", null);
  }

  resetAllLicensesByAppId(applicationId: number) {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "ResetAllLicensesByAppId?applicationId=" + applicationId, params);
  }


  extendAllKeys(timeSelection: number, dateOption: number, applicationId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "extendalllicenses?timeSelection=" + timeSelection + "&dateOption=" + dateOption + "&applicationId=" + applicationId, null);
  }

  extendLicense(timeSelection: number, dateOption: number, keyId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "extendlicense?timeSelection=" + timeSelection + "&dateOption=" + dateOption + "&keyId=" + keyId, null);
  }

  deleteUnusedKeys(applicationId: number): Observable<ResponseModel> {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "DeleteUnusedKeys?applicationId=" + applicationId, params);
  }


  //deleteexpiredkeys with paramter applicationid or null
  deleteExpiredKeys(...args: [applicationId: number]): Observable<ResponseModel> {
    const params = new HttpParams();
    return this.httpClient.post<ResponseModel>(this.apiUrl + "DeleteExpiredKeys?applicationId=" + args, params);

  }

}
