import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private authService: AuthService, private modalService: BsModalService, private licenseService: LicenseService, private toastrService: ToastrService, private licenseComponent: LicensesComponent) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
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

    if (LicensesComponent.applicationId == null || LicensesComponent.applicationId < 1) {
      this.toastrService.error("Please select application!", "Error", { positionClass: 'toast-bottom-right' });
      return;
    }
    else {
      this.licenseService.generateLicense(this.selectOption, LicensesComponent.applicationId).subscribe({
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
