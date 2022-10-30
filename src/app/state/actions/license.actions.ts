import { createAction, props } from "@ngrx/store";
import { KeyLicense } from "src/app/models/KeyLicense";
import { ListResponseModel } from "src/app/models/ListResponseModel";
import { ResponseModel } from "src/app/models/ResponseModel";
import { SingleResponseModel } from "src/app/models/SingleResponseModel";
import { UserDetails } from "src/app/models/UserDetails";
import { UserInfo } from "src/app/models/userInfo";


export const TYPE = '[LICENSE_API]';

export const getAll = createAction(
    `${TYPE} GET_ALL`,
);

export const getAllSuccess = createAction(
    `${TYPE} GET_ALL_SUCCESS`,
    props<{ payload: ListResponseModel<KeyLicense> }>()
)

export const getAllError = createAction(
    `${TYPE} GET_ERROR`,
    props<{ payload: ResponseModel }>()
)

export const generate = createAction(
    `${TYPE} GENERATE_LICENSE`,
    props<{ selectOption: number, applicationId: number,price:number }>()
)

export const generateSuccess = createAction(
    `${TYPE} GENERATE_LICENSE_SUCCESS`,
    props<{ payload: SingleResponseModel<KeyLicense> }>()
)

export const generateAdmin = createAction(
    `${TYPE} GENERATE_LICENSE_ADMIN`,
    props<{ selectOption: number, price: number }>()
)

export const generateAdminSuccess = createAction(
    `${TYPE} GENERATE_LICENSE_ADMIN_SUCCESS`,
    props<{ payload: SingleResponseModel<KeyLicense> }>()
)

export const remove = createAction(
    `${TYPE} REMOVE_LICENSE`,
    props<{ licenseId: number }>()
)

export const removeSuccess = createAction(
    `${TYPE} REMOVE_LICENSE_SUCCESS`,
    props<{ licenseId: number }>()
)