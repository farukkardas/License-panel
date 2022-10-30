import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RouterNavigatedAction, ROUTER_NAVIGATION } from "@ngrx/router-store";
import { catchError, filter, map, mergeMap, of, tap } from "rxjs";
import { LicenseService } from "src/app/services/license.service";
import { ModalSubscriptionService } from "src/app/services/modal-subscription.service";
import * as LicenseActions from "../actions/license.actions";
import * as NotificationActions from "src/app/state/actions/notification.actions";
import * as UserActions from "src/app/state/actions/user.actions";
import { Store } from "@ngrx/store";

@Injectable()
export class LicenseEffects {
    constructor(private actions$: Actions, private licenseService: LicenseService, private modalSubService: ModalSubscriptionService, private store: Store) { }

    getAll$ = createEffect(() => this.actions$.pipe(ofType(LicenseActions.getAll),
        mergeMap((action) => this.licenseService.getLicenses().pipe(map((response) => {
            return LicenseActions.getAllSuccess({ payload: response });
        }), catchError((error) => of(LicenseActions.getAllError({ payload: error })))))));

    getAllNavigation$ = createEffect(() => this.actions$.pipe(ofType(ROUTER_NAVIGATION),
        filter((route: RouterNavigatedAction) => route.payload.routerState.url.includes('licenses')),
        map(() => {
            return LicenseActions.getAll()
        }),
        catchError(error => of(LicenseActions.getAllError({ payload: error })))));

    generate$ = createEffect(() => this.actions$.pipe(ofType(LicenseActions.generate),
        mergeMap((action) => this.licenseService.generateLicense(action.selectOption, action.applicationId).pipe(
            tap(() => [this.modalSubService.closeModal('keygenerate'), this.store.dispatch(NotificationActions.showSuccess({ message: "License generated successfully" }))]),
            mergeMap((response) => {
                return [LicenseActions.generateSuccess({ payload: response }), UserActions.reduceBalance({ payload: action.price })]
            })))))

    generateAdmin$ = createEffect(() => this.actions$.pipe(ofType(LicenseActions.generateAdmin),
        mergeMap((action) => this.licenseService.generateLicenseLocalSeller(action.selectOption).pipe(
            tap(() => [this.modalSubService.closeModal('keygenerate'), this.store.dispatch(NotificationActions.showSuccess({ message: "License generated successfully" }))]),
            mergeMap((response) => {
                return [LicenseActions.generateAdminSuccess({ payload: response }), UserActions.reduceBalance({ payload: action.price })]
            })))))

    remove$ = createEffect(() => this.actions$.pipe(ofType(LicenseActions.remove),
        mergeMap((action) => this.licenseService.deleteLicense(action.licenseId).pipe(
            tap(() => [this.modalSubService.closeModal('keyremove'), this.store.dispatch(NotificationActions.showSuccess({ message: "License removed successfully" }))]),
            map(() => {
                return LicenseActions.removeSuccess({ licenseId: action.licenseId });
            })
        ))))
}