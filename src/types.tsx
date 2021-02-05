export type Headers = { [header: string]: string };

// export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type RequestMethod = 'GET' | 'POST' | 'UPDATE' | 'DELETE';

export type StartNetworkLoggingOptions = {
  /** Max number of requests to keep before overwriting, default 500 */
  maxRequests?: number;
};

export interface IRequest {
  _id: number;
  readyState: number;
  status?: number;
  url: string;
  method: string;
  body?: string;
  requestHeaders?: Headers;
  responseHeaders?: Headers;
}
