import { Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Panel } from 'src/app/models/Panel';
import { PanelService } from 'src/app/services/panel.service';
import { UserService } from 'src/app/services/user.service';
import { AddpanelComponent } from '../dialogModels/addpanel/addpanel.component';
import * as CryptoJS from 'crypto-js';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Application } from 'src/app/models/Application';
import { ApplicationService } from 'src/app/services/application.service';
import { LicensesComponent } from '../licenses/licenses.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.css']
})
@Injectable({
  providedIn: 'root',
})
export class PanelsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  static appId: number;
  panels: Panel[] = []
  dataSource: MatTableDataSource<Panel>;
  displayedColumns: string[] = ['id', 'panelOwnerId', 'panelSellerId', 'isActive', 'balance', 'createdLicense', 'disable'];
  isAuth: boolean = false;
  userBalance: number;
  modalRef: BsModalRef;
  applications: Application[] = []
  selectedId: number;
  pipe = new DatePipe('en-US');
  now = Date.now();
  myFormattedDate = this.pipe.transform(this.now, 'short');

  constructor(private authService:AuthService,private applicationService: ApplicationService, private panelService: PanelService, private userService: UserService, private toastrService: ToastrService, private matDialog: MatDialog, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUserPanels()
    this.getUserDetails()
    this.getAllApplications()
    this.disableAddButton()
  }
  disableAddButton() {
    this.isAuth = this.authService.checkIfHavePermission()
  }

  getAllApplications() {
    this.applicationService.getAppById().subscribe({
      next: (response) => {
        this.applications = response.data
      }, error: (error) => {
        if (error.error.message != null) {
          this.toastrService.error(error.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
        else {
          this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
        }
      }
    })
  }

  onChange($event) {
    PanelsComponent.appId = $event.value.id;
    console.log(PanelsComponent.appId)
    this.getPanelsByAppId()
  }

  getPanelsByAppId() {
    if (PanelsComponent.appId != null || PanelsComponent.appId != undefined) {
      this.panelService.getPanelsByAppId(PanelsComponent.appId).subscribe({
        next: (response) => {
          console.log(response.data)
          this.panels = response.data;
          this.dataSource = new MatTableDataSource(response.data)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        }, error: (responseError) => {
          if (responseError.error.message != null) {
            this.toastrService.error(responseError.error.message, "Error", { positionClass: 'toast-bottom-right' })
          }
          else {
            this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
          }
        }
      })
    }
  }


  openModal(template: TemplateRef<any>, deleteKeyId) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
    this.selectedId = deleteKeyId;
  }

  openGeneratePanel() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = '500px';
    this.matDialog.open(AddpanelComponent, dialogConfig).afterClosed().subscribe(result => {

      this.getPanelsByAppId()

    });
  }

  closeModal() {
    this.matDialog.closeAll()
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        this.userBalance = response.data.balance
      }, error: (error) => {
        if (error.error.message != null) {
          this.toastrService.error(error.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
        else {
          this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
        }
      }
    })
  }

  getUserPanels() {
    this.panelService.getUserPanels().subscribe({
      next: (response) => {
        this.panels = response.data;
        this.dataSource = new MatTableDataSource(response.data)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }, error: (responseError) => {
        if (responseError.error.message != null) {
          this.toastrService.error(responseError.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
        else {
          this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
        }
      }
    })
  }

  disablePanel() {
    this.panelService.disablePanel(this.selectedId).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, "Error", { positionClass: 'toast-bottom-right' })
      }, error: (error) => {
        console.log(error)
        this.toastrService.error(error.error.message, "Error", { positionClass: 'toast-bottom-right' })
      }, complete: () => {
        this.getUserPanels()
        this.modalRef.hide();
      }
    })
  }


  confirm(): void {
    this.disablePanel()
  }

  decline(): void {
    this.modalRef.hide();
  }


  copyLicenses() {
    return JSON.stringify(this.panels);
  }

  exportPdf() {
    var prepare = [];
    this.panels.forEach(e => {
      var tempObj = [];
      tempObj.push(e.panelOwnerId);
      tempObj.push(e.panelSellerId);
      tempObj.push(e.isActive);
      tempObj.push(e.balance);
      tempObj.push(e.createdLicense);
      tempObj.push(e.applicationId);
      tempObj.push(e.panelMail);

      prepare.push(tempObj);
    });
    let doc = new jsPDF();


    autoTable(doc, {
      head: [['ID', 'Key', 'HWID', 'Owner ID', 'Owned', 'Expiration']],
      body: prepare
    });
    doc.setFontSize(12)
    doc.setFont(undefined, undefined, 200)
    doc.text("Date: " + this.myFormattedDate, 195, 10, { align: 'right' })
    doc.save("Licenses : " + this.myFormattedDate.toString() + '.pdf');
  }

  printTable() {
    let printContent = document.getElementById("licenseTable");
    let WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  // filter MatTableDataSource by a key value
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
