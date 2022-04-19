import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/ListResponseModel';
import { Log } from '../models/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  apiUrl = "http://localhost:7225/api/log/";

  constructor(private httpClient:HttpClient) { }

  getLogs():Observable<ListResponseModel<Log>> {
    return this.httpClient.get<ListResponseModel<Log>>(this.apiUrl + "getall")
  }
}
