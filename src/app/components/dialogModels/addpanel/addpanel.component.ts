import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PanelRegisterDto } from 'src/app/models/PanelRegisterDto';
import { PanelService } from 'src/app/services/panel.service';
import { PanelsComponent } from '../../panels/panels.component';

@Component({
  selector: 'app-addpanel',
  templateUrl: './addpanel.component.html',
  styleUrls: ['./addpanel.component.css']
})
export class AddpanelComponent implements OnInit {

  constructor(private panelService: PanelService, private formBuilder: FormBuilder, private toastrService: ToastrService,private modalService:BsModalService,private panelComponent:PanelsComponent) { }
  panelForm: FormGroup;
  modalRef:BsModalRef;
  ngOnInit(): void {
    this.createLoginForm()
  }

  createLoginForm() {
    this.panelForm = this.formBuilder.group({
      panelMail: ["", Validators.required],
      panelPassword: ["", Validators.required],
      balance: ["", Validators.required]
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
  }

  generatePanel() {
    let panelRegisterModel: PanelRegisterDto = { ...this.panelForm.value }
    this.panelService.addNewPanel(panelRegisterModel).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, "Success", { positionClass: 'toast-bottom-right' })
      }, error: (e) => {
        console.log(e)
        this.toastrService.error(e.error.message, "Error", { positionClass: 'toast-bottom-right' })
      },complete:()=>{
        this.modalRef.hide()
        this.panelComponent.closeModal()
      }
    })
  }

  confirm(): void {
    this.generatePanel()
  }

  decline(): void {
    this.modalRef.hide();
  }
}
