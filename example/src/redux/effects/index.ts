import { appActionEpic } from './appEpic';
import { combineEpics, Epic } from 'redux-observable';

export const rootEpic: Epic = combineEpics(appActionEpic);
