import { appActionEpic } from './appEpic';
import { combineEpics } from 'redux-observable';

export const rootEpic: import('redux-observable').Epic<any, any, any, any> = combineEpics(appActionEpic);
