// @ts-ignore
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import { RequestMethod, RNLoggerOptions } from '../types';
import { RNRequest } from './Objects/RNRequest';
import { getResponseBody, getRequestBody } from './Objects/RNRequest';

// readyState = 0 - Client has been created. open() not called yet.
// readyState = 1 - open() has been called.
// readyState = 2 - send() has been called, and headers and status are available.
// readyState = 3 - Downloading; responseText holds partial data.
// readyState = 4 -	The operation is complete (suucessful or failed).
// const XHR_CREATE_STATUS = 0;
// const XHR_OPEN_STATUS = 1;
// const XHR_SEND_STATUS = 2;
// const XHR_DOWNLOAD_STATUS = 3;
const XHR_COMPLETE_STATUS = 4;

// xhr will be passed in every step (open/send/requestHeaders/headerReceived/response)
// _index has been added to identify each request (_requestId in xhr object cannot be used because null in openCallback)
interface IXHR {
  _index: number;
  readyState: number;
  responseHeaders?: Headers;
  requestHeaders?: any;
}

export class RNLogger {
  static instance: RNLogger;

  initialized: boolean = true;
  maxRequests: number = 100;
  requestId: number = 0;
  requests: Array<RNRequest> = [];
  // This queue will keep all the requests created until the readyState equal 4. At this moment, the request will be
  // moved in requests: Array<RNRequest>
  queue: Map<number, RNRequest> = new Map();
  callback: Function = () => {};

  constructor() {
    if (RNLogger.instance) {
      return RNLogger.instance;
    }
    RNLogger.instance = this;
  }

  setCallback = (callback: any) => {
    this.callback = callback;
  };

  getRequests = (): Array<RNRequest> => {
    const _temp = this.requests;
    // this.clear()
    return _temp;
  };

  getExecutedRequests = (): number => this.requests.length;

  getRequest = (index: number) => this.requests[index];

  clear = () => {
    this.requests = [];
  };

  disableXHRInterception = () => {
    XHRInterceptor.disableInterception();
  };

  isEnabled = () => this.initialized && XHRInterceptor.isInterceptorEnabled();

  updaterequest = (index: number, request: Partial<RNRequest>): void => {
    const _rnRequest = new RNRequest({
      ...this.queue.get(index),
      ...request,
    });
    if (request.readyState === XHR_COMPLETE_STATUS) {
      // Be careful, always use immutable function on array (concat, splice)
      // never unshift/shift function
      this.requests = [_rnRequest].concat(this.requests);

      if (this.getExecutedRequests() > this.maxRequests) {
        this.requests = [...this.requests.slice(0, this.getExecutedRequests() - 1)];
      }
      this.callback(this.getRequests());
      this.queue.delete(index);
    } else {
      this.queue.set(index, _rnRequest);
    }
  };

  openCallback = (method: RequestMethod, url: string, xhr: IXHR) => {
    this.requestId++;
    xhr._index = this.requestId;

    const _request: RNRequest = new RNRequest({
      _id: this.requestId,
      readyState: xhr.readyState,
      url,
      shortUrl: url.slice(0, 50),
      method,
    });
    this.queue.set(xhr._index, _request);
  };

  sendCallback = (data: string, xhr: IXHR) => {
    this.updaterequest(this.requestId, {
      readyState: xhr.readyState,
      dataSent: getRequestBody(data),
    } as Partial<RNRequest>);
  };

  requestHeadersCallback = (header: string, value: string, xhr: IXHR) => {
    const _requestHeaders: Partial<RNRequest> = { ...this.queue.get(xhr._index)?.requestHeaders };
    // @ts-ignore
    _requestHeaders[header] = value;
    this.updaterequest(xhr._index, { requestHeaders: _requestHeaders } as Partial<RNRequest>);
  };

  headerReceivedCallback = (
    responseContentType: string,
    responseSize: number,
    _responseHeaders: Headers, // Unused parameter, remove _ to used responseHeaders value in the function
    xhr: IXHR,
  ) => {
    this.updaterequest(xhr._index, {
      responseContentType,
      responseSize,
      responseHeaders: xhr.responseHeaders,
      readyState: xhr.readyState,
    } as Partial<RNRequest>);
  };

  responseCallback = async (
    status: number,
    timeout: number,
    response: any,
    responseURL: string,
    responseType: string,
    xhr: IXHR,
  ) => {
    const _response = await getResponseBody(responseType, response);
    this.updaterequest(xhr._index, {
      endTime: Date.now(),
      readyState: xhr.readyState,
      status,
      timeout,
      response: _response,
      responseURL,
      responseType,
    } as Partial<RNRequest>);
  };

  enableXHRInterception = (options?: RNLoggerOptions) => {
    // if (XHRInterceptor.isInterceptorEnabled()) {
    //   return;
    // }

    if (options?.maxRequests !== undefined) {
      if (typeof options.maxRequests !== 'number' || options.maxRequests < 1) {
        console.warn(
          'react-native-netwatch: maxRequests must be a number greater than 0. The logger has not been started.',
        );
        return;
      }
      this.maxRequests = options.maxRequests;
    }

    XHRInterceptor.setOpenCallback(this.openCallback);
    XHRInterceptor.setRequestHeaderCallback(this.requestHeadersCallback);
    XHRInterceptor.setHeaderReceivedCallback(this.headerReceivedCallback);
    XHRInterceptor.setSendCallback(this.sendCallback);
    XHRInterceptor.setResponseCallback(this.responseCallback);

    if (!this.initialized) XHRInterceptor.enableInterception();
    this.initialized = true;
  };
}

export default RNLogger;
