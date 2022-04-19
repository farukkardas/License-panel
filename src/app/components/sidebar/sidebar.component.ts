import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuth: boolean;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.checkIfAuth()
  }

  checkIfAuth() {
    if (this.authService.isAuth()) {
      this.isAuth = true;
    }
    else {
      this.isAuth = false;
    }
  }

  logout(){
    this.authService.logout()
  }
}
