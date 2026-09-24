import { APP_ACTION_FAILURE, APP_ACTION_REQUEST, APP_ACTION_SUCCESS } from './appActions.types';

export function actionRequest(): import('redux').AnyAction {
  return {
    type: APP_ACTION_REQUEST,
  };
}

export function actionSuccess(response: any): import('redux').AnyAction {
  return {
    type: APP_ACTION_SUCCESS,
    response,
  };
}

export function actionFailure(error: string): import('redux').AnyAction {
  return {
    type: APP_ACTION_FAILURE,
    error,
  };
}
