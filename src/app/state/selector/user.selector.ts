import { State } from "../reducers/user.reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const getMainState = createFeatureSelector<State>('userInfo');

export const getUser = createSelector(
    getMainState,
    (state: State) => state.userInfo
)

export const getLoading = createSelector(
    getMainState,
    (state: State) => state.isLoading > 0
)

