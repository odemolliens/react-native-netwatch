import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import appActionsReducer from './reducers/appActionsReducer';
import { createEpicMiddleware } from 'redux-observable';
import { createActionLog } from 'redux-action-log';
import { rootEpic } from './effects';
import { reduxLogger } from 'react-native-netwatch';

export interface IRootState {
  app: import('./reducers/appActionsReducer').IAppState;
}

const createReducer = () => (state: any, action: never) =>
  combineReducers({
    app: appActionsReducer,
  })(state, action);

const epicMiddleware = createEpicMiddleware<import('redux').AnyAction, import('redux').AnyAction, IRootState, void>();
export const actionLog = createActionLog({ limit: 100 });

const enhancer = compose(
  applyMiddleware(epicMiddleware, reduxLogger),
  actionLog.enhancer,
) as import('redux').StoreEnhancer;

const store: any = createStore(createReducer(), enhancer);

epicMiddleware.run(rootEpic);

export default store;
