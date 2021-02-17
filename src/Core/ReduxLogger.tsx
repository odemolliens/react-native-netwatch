// This is a middleware for redux
import { ReduxAction } from './Objects/ReduxAction';

let actions: Array<ReduxAction> = [];
let currentId: number = -1;
let callback: Function = () => {};

export const setCallback = (_callback: Function) => {
  callback = _callback;
};

export const clear = () => (actions = []);

export const reduxLoggerMiddleware = (_store: any) => (next: any) => (action: any) => {
  const _action = new ReduxAction({
    _id: currentId++,
    action,
  });

  actions.push(_action);
  callback(getReduxActions());
  return next(action);
};

export const getReduxActions = () => actions;
