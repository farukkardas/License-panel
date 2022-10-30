import { createAction, props } from "@ngrx/store";
import { ResponseModel } from "src/app/models/ResponseModel";
import { SingleResponseModel } from "src/app/models/SingleResponseModel";
import { UserDetails } from "src/app/models/UserDetails";
import { UserInfo } from "src/app/models/userInfo";


export const TYPE = '[USER_API]';

export const get = createAction(
    `${TYPE} GET`,
);

export const getSuccess = createAction(
    `${TYPE} GET_SUCCESS`,
    props<{ payload: SingleResponseModel<UserDetails> }>()
)

export const reduceBalance = createAction(
    `${TYPE} REDUCE_BALANCE`,
    props<{ payload: number }>()
)

export const getError = createAction(
    `${TYPE} GET_ERROR`,
    props<{ payload: ResponseModel }>()
)

