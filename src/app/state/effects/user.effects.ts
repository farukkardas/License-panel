import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, of } from "rxjs";
import { UserService } from "src/app/services/user.service";
import * as UserActions from '../actions/user.actions';

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions, private userService: UserService) { }

    get$ = createEffect(() => this.actions$.pipe(ofType(UserActions.get),
        switchMap(() => this.userService.getUserDetails().pipe(map(user => {
            return UserActions.getSuccess({ payload: user });
        }), catchError(error => of(UserActions.getError({ payload: error })))))));
}