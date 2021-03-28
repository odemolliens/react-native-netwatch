import { ILog, LogType } from '../../types';

interface IAction {
  type: string;
  payload: any;
}

export class ReduxAction implements ILog {
  _id: number = -1;
  type: LogType = 'REDUX';
  startTime: number = Date.now();
  stringifiedAction: string = '';
  extra: string = '';
  action: IAction = { type: '__ERROR:UNDEFINED__', payload: '' };

  constructor(attributes?: any) {
    Object.assign(this, attributes);
  }
}

export default ReduxAction;
