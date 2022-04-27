import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private keyLicenseComponent: LicensesComponent, private modalService: BsModalService, private licenseService: LicenseService, private toastrService: ToastrService, private licenseComponent: LicensesComponent) { }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
  }

  generateKey() {
    console.log(LicensesComponent.applicationId)
    if (LicensesComponent.applicationId == null || LicensesComponent.applicationId < 1) {
      this.toastrService.error("Please select application!", "Error", { positionClass: 'toast-bottom-right' });
    }
    this.licenseService.generateLicense(this.selectOption, LicensesComponent.applicationId).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
      }, error: (error) => {
        this.modalRef.hide()
        this.toastrService.error("Error when creating key!", "Error", { positionClass: "toast-bottom-right" })
      }, complete: () => {
        this.modalRef.hide()
        this.licenseComponent.closeModal()
      }
    })
  }

  confirm(): void {
    this.generateKey()
  }

  decline(): void {
    this.modalRef.hide();
  }

}
