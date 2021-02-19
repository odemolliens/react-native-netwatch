import { ILog, LogType } from '../../types';

export class NRequest implements ILog {
  _id: number = -1;
  type: LogType = 'NR';
  startTime: number = Date.now();
  readyState: number = 0;
  url: string = '';
  method: string = '';
  status: number = -1;
  endTime: number = 0;
  timeout?: number;
  dataSent?: string = '';
  requestHeaders?: any;
  responseHeaders?: any;
  responseContentType?: string;
  responseSize?: number;
  responseType?: string;
  responseURL?: string;
  response?: string = '';

  constructor(attributes: any) {
    Object.assign(this, attributes);
  }
}

export default NRequest;
