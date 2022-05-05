import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/models/Application';
import { SetApplicationPrices } from 'src/app/models/SetApplicationPrices';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-updateprices',
  templateUrl: './updateprices.component.html',
  styleUrls: ['./updateprices.component.css']
})
export class UpdatepricesComponent implements OnInit {
  modalRef: BsModalRef;
  priceForm: FormGroup;

  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, private applicationService: ApplicationService, private toastrService: ToastrService) { }
  applications: Application[] = []

  ngOnInit(): void {
    this.createPriceForm()
    this.getAppById()
  }

  createPriceForm() {
    this.priceForm = this.formBuilder.group({
      dailyPrice: ["", Validators.required],
      weeklyPrice: ["", Validators.required],
      monthlyPrice: ["", Validators.required],
      applicationId: ["", Validators.required]
    })
  }

  onChange($event) {
    let appId: number = $event.value.id;
    this.priceForm.patchValue({
      applicationId: appId
    })
  }

  getAppById() {
    this.applicationService.getAppById().subscribe({
      next: (response) => {
        this.applications = response.data;
      }, error: (error) => {
        
        this.toastrService.error(error.error.message, "Error", { positionClass: "toast-bottom-right" })
      }, complete: () => {
        //this.getLicenses()
      }
    })
  }

  confirm() {

    let priceModel: SetApplicationPrices = this.priceForm.value
    // call settapplicationprice from applicationservice

    // return error when priceForm value is not valid
    if (this.priceForm.invalid) {
      this.toastrService.error("Please fill all the fields!", "Error", { positionClass: "toast-bottom-right" })
      return;
    }



    this.applicationService.setApplicationPrices(priceModel).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, "Success", { positionClass: "toast-bottom-right" })
      }, error: (error) => {
        console.log(error)
        this.toastrService.error(error.message, "Error", { positionClass: "toast-bottom-right" })
      }, complete: () => {
        this.modalRef.hide()
      }
    })

  }

  decline() {
    this.modalRef.hide()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' })
  }
}
