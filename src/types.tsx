// export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type RequestMethod = 'GET' | 'POST' | 'UPDATE' | 'DELETE';

export type StartNetworkLoggingOptions = {
  /** Max number of requests to keep before overwriting, default 500 */
  maxRequests?: number;
};

export interface IRequest {
  _id: number;
  readyState: number;
  url: string;
  method: string;
  status: number;
  startTime: number;
  endTime: number;
  timeout?: number;
  dataSent?: string;
  requestHeaders?: any;
  responseHeaders?: any;
  responseContentType?: string;
  responseSize?: number;
  responseType?: string;
  responseURL?: string;
  response?: any;
}
