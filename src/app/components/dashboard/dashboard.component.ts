import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Log } from 'src/app/models/log';
import { UserInfo } from 'src/app/models/userInfo';
import { LogService } from 'src/app/services/log.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userInfo: UserInfo;
  isEmpty: boolean = false;
  displayedColumns: any[] = ['id', 'message', 'ownerId', 'date', 'success'];
  dataSource: MatTableDataSource<Log>
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private userService: UserService, private logService: LogService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getUserLogs()
    this.getUserInfo()
  }

  getUserInfo() {
    this.userInfo = new UserInfo;
    this.userService.getUserInfos().subscribe({
      next: (response) => {
        this.userInfo = response.data
      }, error: (e) => {
        this.toastrService.error("Error when retrieving user info!", "Error", { positionClass: 'toast-bottom-right' })
      }
    })
  }


  getUserLogs() {
    this.logService.getLogs().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      }, error: (responseError) => {
        this.toastrService.error("Error when retrieving user logs!", "Error", { positionClass: 'toast-bottom-right' })
      }
    })
  }

  checkLogStatus(status: boolean) {
    switch (status) {
      case false: {
        return "assets/red_check.png"
      }
      case true: {
        return "assets/green_check.png"
      }
      default: {
        return "assets/red_check.png"
      }
    }
  }




}
