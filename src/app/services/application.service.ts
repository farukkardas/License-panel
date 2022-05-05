import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../models/Application';
import { ListResponseModel } from '../models/ListResponseModel';
import { ResponseModel } from '../models/ResponseModel';
import { SetApplicationPrices } from '../models/SetApplicationPrices';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {


  apiUrl = "http://localhost:7225/api/application/";
  constructor(private httpClient: HttpClient) { }

  // create method getbyid
  getAppById(): Observable<ListResponseModel<Application>> {
    return this.httpClient.get<ListResponseModel<Application>>(this.apiUrl + "getbyid");
  }

  //create setapplicationprice put method
  setApplicationPrices(priceModel: SetApplicationPrices): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(this.apiUrl + "setapplicationprices", priceModel);
  }

  //add application
  addApplication(application: Application) {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "add", application);
  }

  deleteApplication(applicationId: number) {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "delete?applicationId=" + applicationId, params);
  }

  disableApplication(applicationId: number) {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "disableApplication?applicationId=" + applicationId, params);
  }
}
