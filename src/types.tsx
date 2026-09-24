// export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export enum EnumFilterType {
  All = 'ALL',
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export enum EnumStatus {
  Success = 'SUCCESS',
  Warning = 'WARNING',
  Failed = 'FAILED',
}

export type LogType = 'REDUX' | 'RNR' | 'CONNECT';
export type SourceType = 'ALL' | 'RNR' | 'REDUX';

export enum EnumSourceType {
  All = 'ALL',
  ReactNativeRequest = 'RNR',
  Redux = 'REDUX',
  Connection = 'CONNECTION',
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
