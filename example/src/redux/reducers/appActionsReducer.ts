import { AnyAction } from 'redux';
import { APP_ACTION_FAILURE, APP_ACTION_REQUEST, APP_ACTION_SUCCESS } from '../actions/appActions.types';

interface IResponse {
  status: number;
  url: string;
  headers: any;
}

export interface IAppState {
  error?: string;
  url: string;
  isSuccess: boolean;
  response?: IResponse;
}

export const defaultState: IAppState = {
  url: '',
  error: undefined,
  response: undefined,
  isSuccess: false,
};

export default function (state = defaultState, action: AnyAction) {
  switch (action.type) {
    case APP_ACTION_REQUEST:
      return {
        ...state,
        url: action.url,
      };
    case APP_ACTION_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        response: action.response,
      };
    case APP_ACTION_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
