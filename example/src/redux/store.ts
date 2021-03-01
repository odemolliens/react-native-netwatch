import { AnyAction, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import appActionsReducer, { IAppState } from './reducers/appActionsReducer';
import { createEpicMiddleware } from 'redux-observable';
import { createActionLog } from 'redux-action-log';
import { rootEpic } from './effects';
import { setup } from '../config/reactotron';
import { reduxLogger } from 'react-native-netwatch';

export interface IRootState {
  app: IAppState;
}

const createReducer = () => (state: any, action: never) =>
  combineReducers({
    app: appActionsReducer,
  })(state, action);

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, IRootState, void>();
export const actionLog = createActionLog({ limit: 100 });

const store: any = createStore(
  createReducer(),
  compose(applyMiddleware(epicMiddleware, reduxLogger), setup().createEnhancer(), actionLog.enhancer),
);

epicMiddleware.run(rootEpic);

export default store;
