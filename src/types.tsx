// export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export enum EnumFilterType {
  All = 'ALL',
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export type LogType = 'REDUX' | 'RNR' | 'NR';
export type SourceType = 'ALL' | 'RNR' | 'NR' | 'REDUX';

export enum EnumSourceType {
  All = 'ALL',
  ReactNativeRequest = 'RNR',
  Nativerequest = 'NR',
  Redux = 'REDUX',
}

export interface ISourceType {
  format: EnumSourceType | SourceType;
}

export type RNLoggerOptions = {
  maxRequests?: number;
};

export interface ILog {
  _id: number;
  startTime: number;
  type: LogType;
}
