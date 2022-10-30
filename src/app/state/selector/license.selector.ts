import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State, adapter } from "../reducers/license.reducer";

export const getMainState = createFeatureSelector<State>('keyLicenses');

export const selectorAdapter = adapter.getSelectors()

export const getAll = createSelector(getMainState, selectorAdapter.selectAll)
