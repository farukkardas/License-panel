import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LicensesComponent } from './components/licenses/licenses.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { KeygenerateComponent } from './components/dialogModels/keygenerate/keygenerate.component';
import { MatSelectModule } from '@angular/material/select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PanelsComponent } from './components/panels/panels.component';
import { AddpanelComponent } from './components/dialogModels/addpanel/addpanel.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LogsComponent } from './components/logs/logs.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateapplicationComponent } from './components/dialogModels/createapplication/createapplication.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtendkeyComponent } from './components/dialogModels/extendkey/extendkey.component';
import { UpdatepricesComponent } from './components/dialogModels/updateprices/updateprices.component';
import { BodyComponent } from './components/body/body.component';
import { HeaderComponent } from './components/header/header.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './state';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './state/effects/user.effects';
import { environment } from 'src/environments/environment';
import { LicenseEffects } from './state/effects/license.effects';
import { NotificationEffects } from './state/effects/notification.effects';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LicensesComponent,
    LoginComponent,
    KeygenerateComponent,
    PanelsComponent,
    AddpanelComponent,
    LogsComponent,
    DashboardComponent,
    CreateapplicationComponent,
    ExtendkeyComponent,
    UpdatepricesComponent,
    BodyComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableExporterModule,
    MatSelectModule,
    ModalModule.forRoot(),
    ClipboardModule,
    MatSidenavModule,
    FontAwesomeModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }) : [],

    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([UserEffects,LicenseEffects,NotificationEffects])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
