import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/models/Application';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { LicenseService } from 'src/app/services/license.service';
import { LicensesComponent } from '../../licenses/licenses.component';
@Component({
  selector: 'app-keygenerate',
  templateUrl: './keygenerate.component.html',
  styleUrls: ['./keygenerate.component.css']
})
export class KeygenerateComponent implements OnInit {
  expirationDates: number[] = [
    1, 2, 3
  ];
  selectOption: number;
  modalRef: BsModalRef;
  applications: Application[] = []
  activeApplication: Application = new Application;
  isAuth: boolean = false;

  constructor(private cd: ChangeDetectorRef, private applicationService: ApplicationService, private authService: AuthService, private modalService: BsModalService, private licenseService: LicenseService, private toastrService: ToastrService, private licenseComponent: LicensesComponent) { }

  ngOnInit(): void {
    this.disableDivs()
    this.getAppById()
  }

  disableDivs() {
    this.isAuth = this.authService.checkIfHavePermission()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
  }
  onChange($event) {
    this.activeApplication = $event.value;
    this.cd.detectChanges()
  }

  getAppById() {

    this.applicationService.getAppById().subscribe({
      next: (response) => {
        if(this.isAuth == false){
        response.data.forEach(element => {
          this.activeApplication = element
        });
        }
        this.applications = response.data;
      }, error: (error) => {
        this.toastrService.error(error.error.message, "Error", { positionClass: "toast-bottom-right" })
      }, complete: () => {
        //this.getLicenses()
      }
    })


  }

  generateKey() {
    let isAdmin: boolean = this.authService.checkIfHavePermission();

    if (isAdmin == false) {
      this.licenseService.generateLicenseLocalSeller(this.selectOption).subscribe({
        next: (response) => {

          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        }, error: (error) => {
          this.modalRef.hide()
          this.toastrService.error(error.error.message, "Error", { positionClass: "toast-bottom-right" })
        }, complete: () => {
          this.modalRef.hide()
          this.licenseComponent.closeModal()
        }
      })
      return;
    }

    if (this.activeApplication.id == null || this.activeApplication.id < 1 || this.activeApplication.id == undefined) {
      this.toastrService.error("Please select application!", "Error", { positionClass: 'toast-bottom-right' });
      return;
    }
    else {
      this.licenseService.generateLicense(this.selectOption, this.activeApplication.id).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
        }, error: (error) => {
          this.modalRef.hide()
          this.toastrService.error(error.error.message, "Error", { positionClass: "toast-bottom-right" })
        }, complete: () => {
          this.modalRef.hide()
          this.licenseComponent.closeModal()
        }
      })
    }
  }


  confirm(): void {
    this.generateKey()
  }

  decline(): void {
    this.modalRef.hide();
  }

}
