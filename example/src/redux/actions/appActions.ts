import { AnyAction } from 'redux';
import { APP_ACTION_FAILURE, APP_ACTION_REQUEST, APP_ACTION_SUCCESS } from './appActions.types';

export function actionRequest(): AnyAction {
  return {
    type: APP_ACTION_REQUEST,
  };
}

export function actionSuccess(response: any): AnyAction {
  return {
    type: APP_ACTION_SUCCESS,
    response,
  };
}

export function actionFailure(error: string): AnyAction {
  return {
    type: APP_ACTION_FAILURE,
    error,
  };
}
