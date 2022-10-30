import { UserDetails } from "src/app/models/UserDetails";
import { createReducer, on } from "@ngrx/store";
import * as Actions from '../actions/user.actions';

export interface State {
    userInfo: UserDetails | null
    isLoading: number
}

export const initialState: State = {
    userInfo: null,
    isLoading: 0
}

export const reducer = createReducer(
    initialState,
    on(Actions.get, (state) => {
        return { ...state, isLoading: state.isLoading + 1 }
    }),
    on(Actions.getSuccess, (state, action) => {
        return { ...state, userInfo: action.payload.data, isLoading: state.isLoading - 1 }
    }),
    on(Actions.reduceBalance, (state, action) => {
        return { ...state, userInfo: { ...state.userInfo, balance: state.userInfo.balance - action.payload } }
    }),
    on(Actions.getError, (state) => {
        return { ...state, isLoading: Math.max(state.isLoading - 1, 0) }
    })
)