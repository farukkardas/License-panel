import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { tap } from "rxjs";
import * as NotificationActions from "src/app/state/actions/notification.actions";

@Injectable()
export class NotificationEffects {
    constructor(private actions$: Actions, private toastrService: ToastrService) { }

    success$ = createEffect(() =>
        this.actions$.pipe(
            ofType(NotificationActions.showSuccess),
            tap(action => {
                this.toastrService.success(action.message, "Success")
            })
        ),
        { dispatch: false });


    error$ = createEffect(() =>
        this.actions$.pipe(
            ofType(NotificationActions.showError),
            tap(action => {
                this.toastrService.error(action.message, "Error")
            })
        ),
        { dispatch: false });

    info$ = createEffect(() => this.actions$.pipe(
        ofType(NotificationActions.showInfo),
        tap(action => {
            this.toastrService.info(action.message, "Info")
        })), { dispatch: false });

}