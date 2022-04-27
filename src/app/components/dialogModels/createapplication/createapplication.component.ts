import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/models/Application';
import { ApplicationService } from 'src/app/services/application.service';
import { LicenseService } from 'src/app/services/license.service';
import { PanelsComponent } from '../../panels/panels.component';

@Component({
  selector: 'app-createapplication',
  templateUrl: './createapplication.component.html',
  styleUrls: ['./createapplication.component.css']
})
export class CreateapplicationComponent implements OnInit {
  modalRef: BsModalRef;
  panelForm: FormGroup;

  constructor(private modalService: BsModalService,private formBuilder: FormBuilder, private applicationService: ApplicationService, private toastrService: ToastrService,private panelComponent:PanelsComponent) { }

  ngOnInit(): void {
    this.createLoginForm()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
  }

  confirm(): void {
    this.createApplication()
  }

  createLoginForm() {
    this.panelForm = this.formBuilder.group({
      applicationName: ["", Validators.required]
    })
  }

  //add license
  createApplication() {
    let application: Application = { ...this.panelForm.value }

    this.applicationService.addApplication(application).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, "Success", { positionClass: 'toast-bottom-right' })
      },
      error: (e) => {
        this.toastrService.error(e.error.message, "Error", { positionClass: 'toast-bottom-right' })
      },
      complete: () => {
        this.modalRef.hide()
        this.panelComponent.closeModal()
      }
    })

   
 

}


decline(): void {
  this.modalRef.hide();
}

}
