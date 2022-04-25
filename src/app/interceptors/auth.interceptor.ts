import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes("http://localhost:7225/api/license") || request.url.includes("http://localhost:7225/api/user") ) {
      this.authService.checkSkOutdated().subscribe({
        next: (response) => {
        }, error: (error) => {
          this.authService.logout()
        }, complete: () => {

        }
      })
    }


    let token = this.cookieService.get("jwt");
    let newRequest: HttpRequest<any>;
    newRequest = request.clone({
      headers: request.headers.set("Authorization", "Bearer " + token).set("userId", this.cookieService.get("uid")).set("securityKey", this.cookieService.get("sk")),
    })

    return next.handle(newRequest);
  }
}
