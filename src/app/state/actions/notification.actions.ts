import { createAction, props } from "@ngrx/store";

export const TYPE = '[NOTIFICATION_UI]';


export const showSuccess = createAction(
    `${TYPE} SHOW_SUCCESS`,
    props<{ message: string }>()
)

export const showError = createAction(
    `${TYPE} SHOW_ERROR`,
    props<{ message: string }>()
)

export const showInfo = createAction(
    `${TYPE} SHOW_INFO`,
    props<{ message: string }>()
)