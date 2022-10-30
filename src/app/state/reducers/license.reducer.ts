import { createEntityAdapter, EntityState } from "@ngrx/entity"
import { createReducer, on } from "@ngrx/store";
import { KeyLicense } from "src/app/models/KeyLicense"
import * as LicenseActions from "../actions/license.actions"
export interface State extends EntityState<KeyLicense> {
    isLoading: number
    errorMessage: Record<string, string>
}

export const adapter = createEntityAdapter<KeyLicense>();

export const initialState = adapter.getInitialState({
    isLoading: 0,
    errorMessage: {}
})

export const reducer = createReducer(
    initialState,
    on(LicenseActions.getAll, (state) => {
        return { ...state, isLoading: state.isLoading + 1 }
    }),
    on(LicenseActions.getAllSuccess, (state, { payload }) => {
        return adapter.setAll(payload.data, { ...state, isLoading: state.isLoading - 1 })
    }),
    on(LicenseActions.getAllError, (state) => {
        return { ...state, isLoading: Math.max(state.isLoading - 1, 0) }
    }),
    on(LicenseActions.generate, (state) => {
        return { ...state, isLoading: state.isLoading + 1 }
    }),
    on(LicenseActions.generateSuccess, (state, { payload }) => {
        return adapter.addOne(payload.data, { ...state, isLoading: state.isLoading - 1 })
    }),
    on(LicenseActions.generateAdmin, (state) => {
        return { ...state, isLoading: state.isLoading + 1 }
    }),
    on(LicenseActions.generateAdminSuccess, (state, { payload }) => {
        return adapter.addOne(payload.data, { ...state, isLoading: state.isLoading - 1 })
    }),
    on(LicenseActions.remove, (state) => {
        return { ...state, isLoading: state.isLoading + 1 }
    }),
    on(LicenseActions.removeSuccess, (state, { licenseId }) => {
        return adapter.removeOne(licenseId, { ...state, isLoading: state.isLoading - 1 })
    })
)