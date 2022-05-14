import { Component, OnInit } from '@angular/core';
import { SidenavToggle } from './components/sidebar/Abstract/SidenavToggle';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) { }
  title = 'License-panel';
  screenWidth = 0;
  isNavsideCollapsed = false;
  isAuth: boolean;

  ngOnInit(): void {
    this.checkIfAuth()
  }

  getSidenavData(data: SidenavToggle) {
    this.screenWidth = data.screenWidth;
    this.isNavsideCollapsed = data.collapsed;
  }


  checkIfAuth() {
    if (this.authService.isAuth()) {
      this.isAuth = true;
    }
    else {
      this.isAuth = false;
    }
  }
}
