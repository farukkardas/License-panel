import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/models/Application';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { LicenseService } from 'src/app/services/license.service';
import { LicensesComponent } from '../../licenses/licenses.component';
import * as LicenseActions from '../../../state/actions/license.actions';
import { Actions, ofType } from '@ngrx/effects';
import { ModalSubscriptionService } from 'src/app/services/modal-subscription.service';
import { skipWhile, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-keygenerate',
  templateUrl: './keygenerate.component.html',
  styleUrls: ['./keygenerate.component.css']
})
export class KeygenerateComponent implements OnInit, OnDestroy {
  expirationDates: number[] = [
    1, 2, 3
  ];
  unsubscribe$ = new Subject<void>()
  selectOption: any;
  modalRef: BsModalRef;
  applications: Application[] = []
  activeApplication: Application = new Application;
  isAuth: boolean = false;

  constructor(private modalSubService: ModalSubscriptionService, private store: Store, private cd: ChangeDetectorRef, private applicationService: ApplicationService, private authService: AuthService, private modalService: BsModalService, private licenseService: LicenseService, private toastrService: ToastrService, private licenseComponent: LicensesComponent) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  ngOnInit(): void {
    this.disableDivs()
    this.getAppById()
    this.successAction()
  }

  successAction() {
    this.modalSubService.closeModalObservable$
      .pipe(skipWhile(x => x != "keygenerate"),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.modalRef.hide()
          this.licenseComponent.closeModal()
        }
      })
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
        if (this.isAuth == false) {
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

    if (this.activeApplication.id == null || this.activeApplication.id < 1 || this.activeApplication.id == undefined) {
      this.toastrService.error("Please select application!", "Error", { positionClass: 'toast-bottom-right' });
      return;
    }

    let price = 0
    console.log(this.activeApplication);

    switch (this.selectOption) {
      case "1":
        price = this.activeApplication.dailyPrice;
        break;
      case "2":
        price = this.activeApplication.weeklyPrice;
        break;
      case "3":
        price = this.activeApplication.monthlyPrice;
        break;
      default:
        break;
    }

    if (isAdmin == false) {
      this.store.dispatch(LicenseActions.generateAdmin({ selectOption: this.selectOption, price: price }))
    }

    else {
      this.store.dispatch(LicenseActions.generate({ applicationId: this.activeApplication.id, selectOption: this.selectOption, price: price }))
    }
  }


  confirm(): void {
    this.generateKey()
  }

  decline(): void {
    this.modalRef.hide();
  }

}
