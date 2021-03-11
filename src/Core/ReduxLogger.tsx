// This is a middleware for redux
import { ReduxAction } from './Objects/ReduxAction';

let actions: Array<ReduxAction> = [];
let currentId: number = 0;
let callback: Function = () => {};
let maxActions = 100;

export const initCurrentId = () => (currentId = 0);

export const getCurrentId = () => currentId;

export const setCallback = (_callback: Function) => {
  callback = _callback;
};

export const setMaxActions = (_maxActions?: number) => {
  if (typeof _maxActions !== 'number' || _maxActions < 1) {
    console.warn(
      `react-native-netwatch: maxActions must be a number greater than 0. The logger will use the default value: ${maxActions}`,
    );
  } else {
    maxActions = _maxActions;
  }
};

export const getMaxActions = (): number => maxActions;

export const clear = () => (actions = []);

export const getStoredActions = (): number => actions.length;

export const reduxLoggerMiddleware = (_store: any) => (next: any) => (action: any) => {
  const _action = new ReduxAction({
    _id: currentId++,
    stringifiedAction: JSON.stringify(action).slice(0, 253),
    action,
  });

  actions = [_action].concat(actions);
  if (getStoredActions() > maxActions) {
    actions = [...actions.slice(0, getStoredActions() - 1)];
  }

  callback(getReduxActions());
  // actions = []
  return next(action);
};

export const getReduxActions = () => actions;

if (__DEV__) {
  console.log('Launch Redux actions simulator');
  let counter = 0;
  let testActions: Array<ReduxAction> = [];
  setInterval(() => {
    const _action: ReduxAction = new ReduxAction({
      _id: counter++,
      action: { payload: 'Learn about actions', type: 'todos/todoAdded' },
    });
    testActions = [_action].concat(testActions);
    // callback(testActions);
    testActions = [];
  }, 6000);
}
