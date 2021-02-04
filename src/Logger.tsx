// @ts-ignore
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import { Headers, RequestMethod, StartNetworkLoggingOptions } from './types';

// xhr will be passed in every step (open/send/requestHeaders/headerReceived/response)
// _index has been added to identify each request (_requestId in xhr object cannot be used because null in openCallback)
interface IXHR {
  _index: number;
  readyState: number;
  responseHeaders?: Headers;
}

interface IRequest {
  _id: number;
  readyState: number;
  status?: number;
  url: string;
  method: string;
  body?: string;
  requestHeaders?: any;
}

class Logger {
  maxRequests: number = 100;
  requests: Map<number, IRequest> = new Map();
  queue: Map<number, IRequest> = new Map();
  requestId: number = 0;
  firstRequestId: number = 0;

  callback: Function = () => {}

  setCallback = (callback: any) => {
    this.callback = callback;
  }

  getRequests = (): Array<any> => {
    const _results = Array.from(this.requests.values());
    return _results.reverse();
  };

  getExecutedRequests = (): number => {
    return this.requests.size
  }

  getRequest = (index: number) => {
    return this.requests.get(index);
  };

  // Changer this.requests >>> Array
  // Commenter


  // readyState = 0 - Client has been created. open() not called yet.
  // readyState = 1 - open() has been called.
  // readyState = 2 - send() has been called, and headers and status are available.
  // readyState = 3 - Downloading; responseText holds partial data.
  // readyState = 4 -	The operation is complete.
  updaterequest = (index: number, request: Partial<IRequest>): void => {
    if (request.readyState === 4) {
      this.requests.set(index, {
        ...(this.queue.get(index) as IRequest),
        ...request,
      });
      this.queue.delete(index);
      this.callback(this.getRequests())

      if (this.getExecutedRequests() > this.maxRequests) {
        this.requests.delete(this.firstRequestId);
        this.firstRequestId++;
      }

    } else {
      this.queue.set(index, {
        ...(this.queue.get(index) as IRequest),
        ...request,
      });
    }
  };

  openCallback = (method: RequestMethod, url: string, xhr: IXHR) => {
    this.requestId++;
    if (this.requestId === 0) this.firstRequestId = this.requestId;
    xhr._index = this.requestId;
    const _request: IRequest = {
      _id: this.requestId,
      readyState: xhr.readyState,
      url: url,
      method: method,
    };
    this.queue.set(this.requestId, _request);
  };

  sendCallback = (data: string, xhr: IXHR) => {
    this.updaterequest(xhr._index, {
      startTime: Date.now(),
      readyState: xhr.readyState,
      dataSent: data,
    } as Partial<Request>);
  };

  requestHeadersCallback = (header: string, value: string, xhr: IXHR) => {
    const _request = this.getRequest(xhr._index);
    if (!_request) return;
    _request.requestHeaders[header] = value;
  };

  headerReceivedCallback = (
    responseContentType: string,
    responseSize: number,
    responseHeaders: Headers,
    xhr: IXHR
  ) => {
    this.updaterequest(xhr._index, {
      responseContentType,
      responseSize,
      responseHeaders: xhr.responseHeaders,
      readyState: xhr.readyState,
    } as Partial<Request>);
  };

  responseCallback = (
    status: number,
    timeout: number,
    response: string,
    responseURL: string,
    responseType: string,
    xhr: IXHR
  ) => {
    console.log('*******responseCallback***********');
    // console.log(xhr._index);
    this.updaterequest(xhr._index, {
      endTime: Date.now(),
      readyState: xhr.readyState,
      status,
      timeout,
      response,
      responseURL,
      responseType,
    } as Partial<Request>);
  };

  enableXHRInterception = (options?: StartNetworkLoggingOptions) => {
    // if (XHRInterceptor.isInterceptorEnabled()) {
    //   return;
    // }
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
  };
}

export default Logger;
