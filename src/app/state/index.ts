import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import * as UserState from './reducers/user.reducer';
import * as LicenseState from './reducers/license.reducer';
export interface State {
    userInfo: UserState.State,
    keyLicenses: LicenseState.State
}

export const reducers: ActionReducerMap<State> = {
    userInfo: UserState.reducer,
    keyLicenses : LicenseState.reducer
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
