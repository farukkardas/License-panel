import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/models/Application';
import { PanelRegisterDto } from 'src/app/models/PanelRegisterDto';
import { ApplicationService } from 'src/app/services/application.service';
import { PanelService } from 'src/app/services/panel.service';
import { PanelsComponent } from '../../panels/panels.component';

@Component({
  selector: 'app-addpanel',
  templateUrl: './addpanel.component.html',
  styleUrls: ['./addpanel.component.css']
})
export class AddpanelComponent implements OnInit {

  constructor(private applicationService: ApplicationService, private panelService: PanelService, private formBuilder: FormBuilder, private toastrService: ToastrService, private modalService: BsModalService, private panelComponent: PanelsComponent) { }
  panelForm: FormGroup;
  modalRef: BsModalRef;
  applications: Application[] = []
  ngOnInit(): void {
    this.createLoginForm()
    this.getAppById()
  }

  createLoginForm() {
    this.panelForm = this.formBuilder.group({
      panelMail: ["", Validators.required],
      panelPassword: ["", Validators.required],
      balance: ["", Validators.required],
      applicationId: ["", Validators.required]
    })
  }

  onChange($event) {
    let appId: number = $event.value.id;
    this.panelForm.patchValue({
      applicationId: appId
    })
  }

  getAppById() {
    this.applicationService.getAppById().subscribe({
      next: (response) => {
        this.applications = response.data;
      }, error: (error) => {
        this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
      }, complete: () => {
        //this.getLicenses()
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
  }

  generatePanel() {
    let panelRegisterModel: PanelRegisterDto = { ...this.panelForm.value }

    if (panelRegisterModel.applicationId == null || panelRegisterModel.applicationId == undefined || panelRegisterModel.applicationId == 0) {
      this.toastrService.error("Please select application", "Error", { positionClass: "toast-bottom-right" })
      return;
    }
    else {
      this.panelService.addNewPanel(panelRegisterModel).subscribe({
        next: (response) => {
          this.toastrService.success(response.message, "Success", { positionClass: 'toast-bottom-right' })
        }, error: (responseError) => {
          console.log(responseError)
          if (responseError.status == 400 && responseError.error.Errors != null) {
            for (let index = 0; index < responseError.error.Errors.length; index++) {
              this.toastrService.error(responseError.error.Errors[index].ErrorMessage, "Error", { positionClass: "toast-bottom-right" })
            }
          }
          else if(responseError.error.message) {
            this.toastrService.error(responseError.error.message, "Error", { positionClass: "toast-bottom-right" })
          }
          else{
            this.toastrService.error("Internal server error! Please contact with administrator.", "Error", { positionClass: "toast-bottom-right" })
          }
        }, complete: () => {
          this.modalRef.hide()
          this.panelComponent.closeModal()
        }
      })
    }

  }

  confirm(): void {
    this.generatePanel()
  }

  decline(): void {
    this.modalRef.hide();
  }
}
