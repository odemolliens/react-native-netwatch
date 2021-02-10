// @ts-ignore
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import { RequestMethod, StartNetworkLoggingOptions } from '../types';
import { Request } from './Request';
import { getResponseBody, getRequestBody } from './Request'

// xhr will be passed in every step (open/send/requestHeaders/headerReceived/response)
// _index has been added to identify each request (_requestId in xhr object cannot be used because null in openCallback)
interface IXHR {
  _index: number;
  readyState: number;
  responseHeaders?: Headers;
  requestHeaders?: any;
}

class Logger {
  initialized: boolean = false;
  maxRequests: number = 10;
  requestId: number = 0;
  requests: Array<Request> = [];
  queue: Map<number, Request> = new Map();

  callback: Function = () => {};

  setCallback = (callback: any) => {
    this.callback = callback;
  };

  getRequests = (): Array<any> => {
    return this.requests;
  };

  getExecutedRequests = (): number => {
    return this.requests.length;
  };

  getRequest = (index: number) => {
    return this.requests[index];
  };

  clear = () => {
    this.requests = [];
  };

  disableXHRInterception = () => {
    XHRInterceptor.disableInterception();
  };

  isEnabled = () => {
    return this.initialized && XHRInterceptor.isInterceptorEnabled();
  };

  // readyState = 0 - Client has been created. open() not called yet.
  // readyState = 1 - open() has been called.
  // readyState = 2 - send() has been called, and headers and status are available.
  // readyState = 3 - Downloading; responseText holds partial data.
  // readyState = 4 -	The operation is complete (suucessful or failed).
  updaterequest = (index: number, request: Partial<Request>): void => {
    if (request.readyState === 4) {
      // Be careful, always use immutable function on array (concat, splice)
      // never unshift/shift function
      this.requests = [
        {
          ...(this.queue.get(index) as Request),
          ...request,
        },
      ].concat(this.requests);

      if (this.getExecutedRequests() > this.maxRequests) {
        this.requests = [...this.requests.slice(0, this.getExecutedRequests() - 1)];
      }
      this.callback(this.getRequests());
      this.queue.delete(index);
    } else {
      this.queue.set(index, {
        ...(this.queue.get(index) as Request),
        ...request,
      });
    }
  };

  openCallback = (method: RequestMethod, url: string, xhr: IXHR) => {
    this.requestId++;
    xhr._index = this.requestId;

    const _request: Request = new Request({
      _id: this.requestId,
      readyState: xhr.readyState,
      url: url,
      method: method,
    });
    this.queue.set(xhr._index, _request);
  };

  sendCallback = (data: string, xhr: IXHR) => {
    this.updaterequest(this.requestId, {
      readyState: xhr.readyState,
      dataSent: getRequestBody(data),
    } as Partial<Request>);
  };

  requestHeadersCallback = (header: string, value: string, xhr: IXHR) => {
    let _requestHeaders: Partial<Request> = { ...this.queue.get(xhr._index)?.requestHeaders };
    // @ts-ignore
    _requestHeaders[header] = value;
    this.updaterequest(xhr._index, { requestHeaders: _requestHeaders } as Partial<Request>);
  };

  headerReceivedCallback = (
    responseContentType: string,
    responseSize: number,
    _responseHeaders: Headers, // Unused parameter, remove _ to used responseHeaders value in the function
    xhr: IXHR
  ) => {
    this.updaterequest(xhr._index, {
      responseContentType,
      responseSize,
      responseHeaders: xhr.responseHeaders,
      readyState: xhr.readyState,
    } as Partial<Request>);
  };

  responseCallback = async (
    status: number,
    timeout: number,
    response: any,
    responseURL: string,
    responseType: string,
    xhr: IXHR
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
    } as Partial<Request>);
  };

  enableXHRInterception = (options?: StartNetworkLoggingOptions) => {
    if (options?.maxRequests !== undefined) {
      if (typeof options.maxRequests !== 'number' || options.maxRequests < 1) {
        console.warn(
          'react-native-netwatch: maxRequests must be a number greater than 0. The logger has not been started.'
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

    XHRInterceptor.enableInterception();
    this.initialized = true;
  };
}

export default Logger;
