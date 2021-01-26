import { AnyAction } from 'redux';
import { NativeModules } from 'react-native';
import { ActionsObservable, ofType } from 'redux-observable';
import { catchError, mergeMap } from 'rxjs/operators';
import { actionFailure, actionSuccess } from '../actions/appActions';
import { APP_ACTION_REQUEST } from '../actions/appActions.types';

const { ExampleModule } = NativeModules;

export const appActionEpic = (action$: ActionsObservable<AnyAction>) =>
  action$.pipe(
    ofType(APP_ACTION_REQUEST),
    mergeMap(() => {
      ExampleModule.fetchSomething('https://reqres.in/api/users?page=2');
      return fetch('https://reactnative.dev/movies.json')
        .then((response) => actionSuccess(response))
        .catch((error: string) => actionFailure(error));
    }),
    catchError((error: string) => {
      console.log('ERROR appActionEpic: ', error);
      return [actionFailure(error)];
    }),
  );
