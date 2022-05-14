import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  isAuth: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.checkIfAuth()
  }

  getBodyClass(): string {
    let styleClass = '';



    if (this.isAuth) {
      styleClass = 'body'
      if (this.collapsed && this.screenWidth > 768) {
        styleClass = 'body body-trimmed '
      } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
        styleClass = 'body body-md-screen'
      }
    }
    else {
      styleClass = 'body-unauth'
    }
    console.log(styleClass)
    return styleClass;
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
