// export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type LogType = 'REDUX' | 'RNR' | 'NR';

export type SourceType = 'ALL' | 'RNR' | 'NR' | 'REDUX';

export type RNLoggerOptions = {
  maxRequests?: number;
};

export interface ILog {
  _id: number;
  startTime: number;
  type: LogType;
}
