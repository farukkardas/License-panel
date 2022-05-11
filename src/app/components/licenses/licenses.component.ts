import { ChangeDetectorRef, Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComponentType, ToastrService } from 'ngx-toastr';
import { KeyLicense } from 'src/app/models/KeyLicense';
import { UserService } from 'src/app/services/user.service';
import { LicenseService } from '../../services/license.service';
import { KeygenerateComponent } from '../dialogModels/keygenerate/keygenerate.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/models/Application';
import { CreateapplicationComponent } from '../dialogModels/createapplication/createapplication.component';
import { AuthService } from 'src/app/services/auth.service';
import { faCalendar, faCalendarTimes, faCalendarXmark, faCircleExclamation, faClock, faCoffee, faLock, faMoneyBill, faMoneyBill1Wave, faPlus, faPlusCircle, faRepeat, faTabletButton, faTrash, faTrashArrowUp, faTrashRestore, faTrashRestoreAlt, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { ExtendkeyComponent } from '../dialogModels/extendkey/extendkey.component';
import { UpdatepricesComponent } from '../dialogModels/updateprices/updateprices.component';

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.css']
})
@Injectable({
  providedIn: 'root',
})

export class LicensesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isEmpty: boolean = false;
  displayedColumns: any[] = ['id', 'authKey', 'hwid', 'ownerId', 'expirationDate', 'isOwned', 'hwid-reset', 'extend-key', 'delete'];
  dataSource: MatTableDataSource<KeyLicense>
  licenses: KeyLicense[] = []
  applications: Application[] = []
  static extendOption: boolean;
  static applicationId: number;
  modalRef: BsModalRef;
  selectedId: number;
  userBalance: number;
  selectedApp:Application = new Application;
  matTableExporter: any;
  pipe = new DatePipe('en-US');
  now = Date.now();
  supremeId:number;
  isAuth: boolean = false;
  keyGenerateComponent = KeygenerateComponent;
  keyExtendComponent = ExtendkeyComponent;
  createApplicationComponent = CreateapplicationComponent
  updatePricesComponent = UpdatepricesComponent
  faCircle = faClock
  faDelete = faTrash
  faReset = faRepeat
  faApplication = faTabletButton
  faDeleteUnused = faXmarkCircle
  faAdd = faPlus
  faUpdate = faMoneyBill1Wave
  faDisable = faLock
  faCalendar = faCalendarXmark
  myFormattedDate = this.pipe.transform(this.now, 'short');

  constructor(private authService: AuthService, private applicationService: ApplicationService, private licenseService: LicenseService, private matDialog: MatDialog, private modalService: BsModalService, private toastrService: ToastrService, private userService: UserService) { }

  ngOnInit(): void {
    this.getAppById()
    this.getLicenses()
    this.getUserDetails()
    this.disableDivs()
  }

  deleteUnusedKeys() {
    if (LicensesComponent.applicationId == null || LicensesComponent.applicationId == undefined) {
      this.toastrService.error("Please select application!", "Error", { positionClass: 'toast-bottom-right' })
      return;
    }
    this.licenseService.deleteUnusedKeys(LicensesComponent.applicationId).subscribe({
      next: (response) => {
        this.toastrService.success("All unused keys deleted!", "Success", { positionClass: "toast-bottom-right" })
        this.getLicenses()
      }, error: (error) => {
        if (error.error.message != null) {
          this.toastrService.error(error.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
        else {
          this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
        }
      }, complete: () => {
        this.modalRef.hide()
      }
    })
  }

  onChange($event) {
    LicensesComponent.applicationId = $event.value.id;
    this.getLicensesByAppId()
  }

  // delete expired keys from licenseService

  deleteExpiredKeys() {

    if (!this.isAuth) {
      this.licenseService.deleteExpiredKeys(null).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        }, error: (error) => {
          if (error.error.message != null) {
            this.toastrService.error(error.error.message, "Error", { positionClass: 'toast-bottom-right' })
          }
          else {
            console.log(error)
            this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
          }
        }, complete: () => {
          this.getLicenses()
          this.modalRef.hide()
        }
      })
    }

    else {
      if (LicensesComponent.applicationId == null || LicensesComponent.applicationId == undefined) {
        this.toastrService.error("Please select application!", "Error", { positionClass: 'toast-bottom-right' })
        return;
      }
      this.licenseService.deleteExpiredKeys(LicensesComponent.applicationId).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        }, error: (error) => {
          if (error.error.message != null) {
            this.toastrService.error(error.error.message, "Error", { positionClass: 'toast-bottom-right' })
          }
          else {
            console.log(error)
            this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
          }
        }, complete: () => {
          this.getLicensesByAppId()
          this.modalRef.hide()
        }
      })
    }


  }


  getLicensesByAppId() {
    this.licenseService.getLicensesByAppId(LicensesComponent.applicationId).subscribe({
      next: (response) => {
        this.licenses = response.data
        this.dataSource = new MatTableDataSource(this.licenses)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      }, error: (error) => {
        console.log(error)
        this.toastrService.error("Error when getting licenses!", "Error", { positionClass: "toast-bottom-right" })
      }
    })
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
  getLicenses() {
    this.licenseService.getLicenses().subscribe({
      next: (response) => {
        if (response.data.length <= 0) {
          this.isEmpty = true;
        }
        else {
          this.isEmpty = false;
        }
        this.licenses = response.data
        this.dataSource = new MatTableDataSource(response.data)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }, error: (responseError) => {
        console.log(responseError)
        if (responseError.error.message != null) {
          this.toastrService.error(responseError.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
        else {
          this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
        }
      }, complete: () => {

      }
    })
  }

  setExtendOption(option: boolean, keyId: number) {
    LicensesComponent.extendOption = option;
    if (keyId != undefined || keyId != null) {
      ExtendkeyComponent.keyId = keyId;
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  deleteAllUnusedKeys() {

  }

  openGeneratePanel(component) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';
    dialogConfig.height = '300px';
    this.matDialog.open(component, dialogConfig).afterClosed().subscribe(result => {
      this.getLicenses()
      this.getUserDetails()
    });
  }

  openCreateGeneratePanel(component) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '500px';
    if (component == CreateapplicationComponent) {
      dialogConfig.height = '250px';
    }
    this.matDialog.open(component, dialogConfig).afterClosed().subscribe(result => {
      this.getLicenses()
      this.getAppById()
    });
  }

  openModal(template: TemplateRef<any>, deleteKeyId) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
    this.selectedId = deleteKeyId;
  }

  openJustModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
  }

  closeModal() {
    this.matDialog.closeAll()
  }

  confirm(): void {
    this.deleteKey()
  }

  decline(): void {
    this.modalRef.hide();
  }

  deleteKey() {
    this.licenseService.deleteLicense(this.selectedId).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
      }, error: (error) => {
        if (error.error.message != null) {
          this.toastrService.error(error.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
        else {
          this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
        }
      }, complete: () => {
        this.getLicenses()
        this.modalRef.hide()
      }
    })
  }

  disableApplication() {

    if (LicensesComponent.applicationId == null) {
      this.toastrService.error("Please select application!", "Error", { positionClass: 'toast-bottom-right' })
      return;
    }
    this.applicationService.disableApplication(LicensesComponent.applicationId).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
      }, error: (error) => {
        if (error.error.message != null) {
          this.toastrService.error(error.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
        else {
          this.toastrService.error("Connection server error!", "Error", { positionClass: 'toast-bottom-right' })
        }
      }, complete: () => {
        this.getAppById()
      }
    })
  }

  resetHwid(keyId: number) {
    this.licenseService.resetHwid(keyId).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
      }, error: (error) => {
        this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
      }, complete: () => {
        this.getLicenses()
      }
    })

  }

  deleteApplication() {
    if (LicensesComponent.applicationId != null) {
      this.applicationService.deleteApplication(LicensesComponent.applicationId).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        }, error: (error) => {
          console.log(error)
          this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
        }, complete: () => {
          this.getLicenses()
          this.getAppById()
          this.modalRef.hide()
        }
      })
      return;
    }
    this.toastrService.error("Please select application!", "Error", { positionClass: "toast-bottom-right" })

  }

  disableDivs() {
    this.isAuth = this.authService.checkIfHavePermission()
  }

  deleteAllKeys() {
    if (LicensesComponent.applicationId == undefined || LicensesComponent.applicationId == null) {
      this.licenseService.deleteAllKeys().subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        }, error: (error) => {
          this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
        }, complete: () => {
          this.getLicenses()
          this.modalRef.hide()
        }
      })
    }
    else {
      this.licenseService.DeleteAllLicensesByAppId(LicensesComponent.applicationId).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        },
        error: (error) => {
          this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
        },
        complete: () => {
          this.getLicensesByAppId()
          this.modalRef.hide()
        }
      })
    }
  }

  hwidResetAllKeys() {

    if (LicensesComponent.applicationId == undefined || LicensesComponent.applicationId == null) {
      this.licenseService.resetAllHwids().subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        }, error: (error) => {
          this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
        }, complete: () => {
          this.getLicenses()
          this.modalRef.hide()
        }
      })
    }
    else {
      this.licenseService.resetAllLicensesByAppId(LicensesComponent.applicationId).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        }
        , error: (error) => {
          this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
        }
        , complete: () => {
          this.getLicensesByAppId()
          this.modalRef.hide()
        }
      })
    }

  }

  checkLicenseStatus(status: boolean) {
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

  calculateDays(expirationDate: Date) {

    let todayDate = new Date();
    let sentOnDate = new Date(expirationDate);
    sentOnDate.setDate(sentOnDate.getDate());
    let differenceInTime = sentOnDate.getTime() - todayDate.getTime();
    let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays < 0) {
      return "Expired";
    }

    if (differenceInDays < 1) {
      differenceInDays = Math.floor(differenceInTime / (1000 * 3600));
      return differenceInDays + " Hour";
    }
    return differenceInDays + " Day";
  }

  copyLicenses() {
    return JSON.stringify(this.licenses);
  }

  exportPdf() {
    var prepare = [];
    this.dataSource.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.id);
      tempObj.push(e.authKey);
      tempObj.push(e.hwid);
      tempObj.push(e.ownerId);
      tempObj.push(e.isOwned);
      tempObj.push(this.calculateDays(e.expirationDate));

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

  // create method application service getAppById
  getAppById() {
    this.applicationService.getAppById().subscribe({
      next: (response) => {
        this.applications = response.data;
      }, error: (error) => {
        console.log(error)
        this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
      }, complete: () => {
        this.getLicenses()
      }
    })
  }
}




