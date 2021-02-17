// This is a middleware for redux
import { ReduxAction } from './Objects/ReduxAction';

let actions: Array<ReduxAction> = [];
let currentId: number = 0;
let callback: Function = () => {};
let maxActions = 100;

export const setCallback = (_callback: Function) => {
  callback = _callback;
};

export const setMaxActions = (_maxActions?: number) => {
  if (typeof _maxActions !== 'number' || _maxActions < 1) {
    console.warn(
      `react-native-netwatch: maxActions must be a number greater than 0. The logger will use the default value: ${maxActions}`
    );
  } else {
    maxActions = _maxActions;
  }
};

export const clear = () => (actions = []);

export const getExecutedRequests = (): number => {
  return actions.length;
};

export const reduxLoggerMiddleware = (_store: any) => (next: any) => (action: any) => {
  const _action = new ReduxAction({
    _id: currentId++,
    action,
  });

  actions = [_action].concat(actions);
  if (getExecutedRequests() > maxActions) {
    actions = [...actions.slice(0, getExecutedRequests() - 1)];
  }

  callback(getReduxActions());
  return next(action);
};

export const getReduxActions = () => {
  return actions;
};
