import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { actionFailure, actionSuccess } from '../actions/appActions';
import { APP_ACTION_REQUEST } from '../actions/appActions.types';

export const appActionEpic: import('redux-observable').Epic<import('redux').AnyAction, import('redux').AnyAction> = (
  action$,
) =>
  action$.pipe(
    ofType(APP_ACTION_REQUEST),
    mergeMap(() => {
      return fetch('https://reactnative.dev/movies.json')
        .then((response) => actionSuccess(response))
        .catch((error: string) => actionFailure(error));
    }),
    catchError((error: string) => {
      console.log('ERROR appActionEpic: ', error);
      return of(actionFailure(error));
    }),
  );
