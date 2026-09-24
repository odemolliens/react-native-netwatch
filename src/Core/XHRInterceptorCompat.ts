type XHR = {
  addEventListener?: (event: string, listener: () => void, useCapture?: boolean) => void;
  getAllResponseHeaders: () => string;
  getResponseHeader: (header: string) => string | null;
  readyState: number;
  HEADERS_RECEIVED: number;
  DONE: number;
  response: any;
  responseType: string;
  responseURL: string;
  status: number;
  timeout: number;
};

type XHRMethod = (this: XHR, ...args: any[]) => any;

type XHRConstructor = {
  prototype: {
    open: XHRMethod;
    send: XHRMethod;
    setRequestHeader: XHRMethod;
  };
};

type OpenCallback = (...args: any[]) => any;
type SendCallback = (...args: any[]) => any;
type RequestHeaderCallback = (...args: any[]) => any;
type HeaderReceivedCallback = (...args: any[]) => any;
type ResponseCallback = (...args: any[]) => any;

let XMLHttpRequestConstructor: XHRConstructor | undefined;
let originalOpen: XHRMethod | undefined;
let originalSend: XHRMethod | undefined;
let originalSetRequestHeader: XHRMethod | undefined;

let openCallback: OpenCallback | undefined;
let sendCallback: SendCallback | undefined;
let requestHeaderCallback: RequestHeaderCallback | undefined;
let headerReceivedCallback: HeaderReceivedCallback | undefined;
let responseCallback: ResponseCallback | undefined;
let isInterceptorEnabled = false;

const XHRInterceptor = {
  setOpenCallback(callback: OpenCallback) {
    openCallback = callback;
  },

  setSendCallback(callback: SendCallback) {
    sendCallback = callback;
  },

  setRequestHeaderCallback(callback: RequestHeaderCallback) {
    requestHeaderCallback = callback;
  },

  setHeaderReceivedCallback(callback: HeaderReceivedCallback) {
    headerReceivedCallback = callback;
  },

  setResponseCallback(callback: ResponseCallback) {
    responseCallback = callback;
  },

  isInterceptorEnabled() {
    return isInterceptorEnabled;
  },

  enableInterception() {
    if (isInterceptorEnabled) return;

    const constructor = (global as any).XMLHttpRequest as XHRConstructor | undefined;
    if (!constructor) return;

    XMLHttpRequestConstructor = constructor;
    originalOpen = constructor.prototype.open;
    originalSend = constructor.prototype.send;
    originalSetRequestHeader = constructor.prototype.setRequestHeader;
    const open = originalOpen;
    const send = originalSend;
    const setRequestHeader = originalSetRequestHeader;

    constructor.prototype.open = function (this: XHR, ...args: any[]) {
      const [method, url] = args;

      if (openCallback) openCallback(method, url, this);
      return open.apply(this, args);
    };

    constructor.prototype.setRequestHeader = function (this: XHR, ...args: any[]) {
      const [header, value] = args;

      if (requestHeaderCallback) requestHeaderCallback(header, value, this);
      return setRequestHeader.apply(this, args);
    };

    constructor.prototype.send = function (this: XHR, ...args: any[]) {
      const [data] = args;

      if (sendCallback) sendCallback(data, this);
      if (this.addEventListener) {
        this.addEventListener(
          'readystatechange',
          () => {
            if (!isInterceptorEnabled) return;

            if (this.readyState === this.HEADERS_RECEIVED) {
              const contentType = this.getResponseHeader('Content-Type')?.split(';')[0];
              const contentLength = this.getResponseHeader('Content-Length');
              const responseSize = contentLength ? parseInt(contentLength, 10) : undefined;

              if (headerReceivedCallback) {
                headerReceivedCallback(contentType, responseSize, this.getAllResponseHeaders(), this);
              }
            }

            if (this.readyState === this.DONE && responseCallback) {
              responseCallback(this.status, this.timeout, this.response, this.responseURL, this.responseType, this);
            }
          },
          false,
        );
      }

      return send.apply(this, args);
    };

    isInterceptorEnabled = true;
  },

  disableInterception() {
    if (!isInterceptorEnabled) return;

    XMLHttpRequestConstructor!.prototype.open = originalOpen!;
    XMLHttpRequestConstructor!.prototype.send = originalSend!;
    XMLHttpRequestConstructor!.prototype.setRequestHeader = originalSetRequestHeader!;
    openCallback = undefined;
    sendCallback = undefined;
    requestHeaderCallback = undefined;
    headerReceivedCallback = undefined;
    responseCallback = undefined;
    isInterceptorEnabled = false;
  },
};

export default XHRInterceptor;
