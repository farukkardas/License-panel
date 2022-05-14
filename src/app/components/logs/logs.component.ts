import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Log } from 'src/app/models/log';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class LogsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isEmpty: boolean = false;
  displayedColumns: any[] = ['id', 'message', 'ownerId', 'date', 'success'];
  dataSource: MatTableDataSource<Log>

  constructor(private logService: LogService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getUserLogs()
  }


  getUserLogs() {
    this.logService.getLogs().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      }, error: (responseError) => {
        if (responseError.error.message != null) {
          this.toastrService.error(responseError.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
        else {
          this.toastrService.error("Connection   error!", "Error", { positionClass: 'toast-bottom-right' })
        }
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

  //filter table by passing in the value of the search bar

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


}
