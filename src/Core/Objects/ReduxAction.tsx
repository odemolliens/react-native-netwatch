import { ILog, LogType } from '../../types';

interface IAction {
  type: string;
  action: any;
}

export class ReduxAction implements ILog {
  _id: number = -1;
  startTime: number = Date.now();
  type: LogType = 'REDUX';
  action: IAction = { type: '__ERROR:UNDEFINED__', action: '' };

  constructor(attributes: any) {
    Object.assign(this, attributes);
  }
}

export default ReduxAction;
