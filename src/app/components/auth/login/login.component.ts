import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginModel } from 'src/app/models/LoginModel';
import { AuthService } from '../../../services/auth.service';
import jwt_decode from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  buttonEnabled: boolean = true;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private cookieService: CookieService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.checkIsLogged()
    this.createLoginForm()
    this.buttonEnabled = true;

  }
  checkIsLogged() {
    if (this.authService.isAuth()) {
      setTimeout(() => { this.router.navigate(['']) }, 10)
    }
  }


  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  login() {
    this.buttonEnabled = false;

    let loginModel: LoginModel = { ...this.loginForm.value };


    this.authService.login(loginModel).subscribe({
      next: (response) => {

        let decodedJwt: any = jwt_decode(response.data.token);

        for (const k in decodedJwt) {
          if (k === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier") {
            decodedJwt["id"] = decodedJwt[k];
            delete decodedJwt[k];
          }
          if (k === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name") {
            decodedJwt["name"] = decodedJwt[k];
            delete decodedJwt[k];
          }
          if (k === "http://schemas.microsoft.com/ws/2008/06/identity/claims/role") {
            decodedJwt["role"] = decodedJwt[k];
            delete decodedJwt[k];
          }
        }


        const acceptedRoles = ['admin', 'reseller', 'localseller'];
        let getRole = decodedJwt.role;

        if (!acceptedRoles.includes(getRole)) {
          this.toastrService.error("You don't have permission to login panel!", "Error", { positionClass: 'toast-bottom-right' })
          return false;
        }

        var userRole = CryptoJS.AES.encrypt(getRole, 'superkey').toString();
        localStorage.setItem("xx", userRole)


        this.cookieService.set("jwt", response.data.token)
        this.cookieService.set("uid", decodedJwt.id)
        this.cookieService.set("sk", response.data.securityKey)
        this.toastrService.success(response.message, "Success", { positionClass: 'toast-bottom-right' })
        return true;
      }, error: (responseError) => {
        console.log(responseError)
        if (responseError.error.message != null) {
          this.toastrService.error(responseError.error.message, "Error", { positionClass: 'toast-bottom-right' })
          this.buttonEnabled = true;
        }
        else {
          this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
          this.buttonEnabled = true;
        }
      }, complete: () => {
        setTimeout(() => { this.router.navigate([""]), window.location.reload() }, 2000)

      }
    })
  }
}
