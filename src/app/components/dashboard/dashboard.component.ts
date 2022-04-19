import { Component, OnInit } from '@angular/core';
import { UserInfo } from 'src/app/models/userInfo';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfo;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUserInfo()
  }

  getUserInfo() {
    this.userService.getUserInfos().subscribe({
      next: (response) => {
        this.userInfo = response.data
        console.log(response.data)
      }, error: (e) => {
        console.log(e)
      }
    })
  }

}
