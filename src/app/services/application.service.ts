import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../models/Application';
import { ListResponseModel } from '../models/ListResponseModel';
import { ResponseModel } from '../models/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  apiUrl = "http://localhost:7225/api/application/";
  constructor(private httpClient:HttpClient) { }

  // create method getbyid
  getAppById():Observable<ListResponseModel<Application>>{
    return this.httpClient.get<ListResponseModel<Application>>(this.apiUrl + "getbyid");
  }

  //add application
  addApplication(application:Application){
    return this.httpClient.post<ResponseModel>(this.apiUrl + "add",application);
  }
}
