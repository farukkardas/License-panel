import { ChangeDetectorRef, Component, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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
  displayedColumns: any[] = ['id', 'authKey', 'hwid', 'ownerId', 'expirationDate', 'isOwned', 'hwid-reset', 'delete'];
  dataSource: MatTableDataSource<KeyLicense>
  licenses: KeyLicense[] = []
  modalRef: BsModalRef;
  selectedId: number;
  userBalance: number;
  matTableExporter: any;
  pipe = new DatePipe('en-US');
  now = Date.now();
  myFormattedDate = this.pipe.transform(this.now, 'short');

  constructor(private router: Router, private licenseService: LicenseService, private matDialog: MatDialog, private modalService: BsModalService, private toastrService: ToastrService, private userService: UserService) { }

  ngOnInit(): void {
    this.getLicenses()
    this.getUserDetails()

  }


  getUserDetails() {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        this.userBalance = response.data.balance
      }, error: (error) => {
        this.toastrService.error(error, "Error", { positionClass: 'toast-bottom-right' })
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
        this.toastrService.error(responseError, "Error", { positionClass: 'toast-bottom-right' })
      }, complete: () => {

      }
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openGeneratePanel() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "25%";
    dialogConfig.height = "20%";
    this.matDialog.open(KeygenerateComponent, dialogConfig).afterClosed().subscribe(result => {
      this.getLicenses()
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
        this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
      }, complete: () => {
        this.getLicenses()
        this.modalRef.hide()
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

  deleteAllKeys() {
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

  hwidResetAllKeys() {
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
}




