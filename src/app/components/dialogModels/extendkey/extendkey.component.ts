import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LicenseService } from 'src/app/services/license.service';
import { LicensesComponent } from '../../licenses/licenses.component';

@Component({
  selector: 'app-extendkey',
  templateUrl: './extendkey.component.html',
  styleUrls: ['./extendkey.component.css']
})
export class ExtendkeyComponent implements OnInit {
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService, private licenseService: LicenseService, private toastrService: ToastrService) { }
  selectOption: number;
  selectCount: number;
  static keyId : number;
  countArray: number[] = []
  ngOnInit(): void {
    this.generateNumber()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
  }

  generateNumber() {
    // generate thirty piece number and add selectCount
    for (let i = 1; i < 31; i++) {
      this.countArray.push(i)
    }
  }

  onChange($event, selection: any) {
    selection = $event.value
    console.log(selection)
  }

  extendAllKeys() {
    if (this.selectCount === undefined || this.selectOption === undefined || LicensesComponent.applicationId === undefined) {
      this.toastrService.error("Please select a number and select an application!", "Error", { positionClass: 'toast-bottom-right' });
      return;
    }

    if (LicensesComponent.extendOption === true) {
      this.licenseService.extendAllKeys(this.selectCount, this.selectOption, LicensesComponent.applicationId).subscribe(
        {
          next: (response) => {
            this.toastrService.success(response.message, "Success", { positionClass: 'toast-bottom-right' })
          },
          error: (responseError) => {
            console.log(responseError)
            this.toastrService.error(responseError.error.message, "Error", { positionClass: 'toast-bottom-right' })
          }
        })
    }
    else {
      this.licenseService.extendLicense(this.selectCount, this.selectOption, ExtendkeyComponent.keyId).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: 'toast-bottom-right' })
        }, error: (responseError) => {
          this.toastrService.error(responseError.error.message, "Error", { positionClass: 'toast-bottom-right' })
        }
      })
    }
  }


    confirm() {
      this.extendAllKeys()
    }

    decline() {
      this.modalRef.hide()
    }

  }
