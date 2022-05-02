import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/ListResponseModel';
import { Panel } from '../models/Panel';
import { PanelRegisterDto } from '../models/PanelRegisterDto';
import { ResponseModel } from '../models/ResponseModel';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  apiUrl = "http://localhost:7225/api/panel/";

  constructor(private httpClient: HttpClient) { }

  getUserPanels(): Observable<ListResponseModel<Panel>> {
    return this.httpClient.get<ListResponseModel<Panel>>(this.apiUrl + "getuserpanels");
  }

  addNewPanel(panelRegisterDto: PanelRegisterDto): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "createnewpanel", panelRegisterDto);
  }

  disablePanel(panelId: number): Observable<ResponseModel> {
    const params = new HttpParams()
    return this.httpClient.post<ResponseModel>(this.apiUrl + "disablepanel?panelid=" + panelId, { params: params });

  }

  getPanelsByAppId(appId: number): Observable<ListResponseModel<Panel>> {
    const params = new HttpParams()
    return this.httpClient.get<ListResponseModel<Panel>>(this.apiUrl + "GetPanelsByUserId?applicationId=" + appId, { params: params });
  }
}
