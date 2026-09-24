describe('XHRInterceptorCompat', () => {
  const originalXMLHttpRequest = (global as any).XMLHttpRequest;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    (global as any).XMLHttpRequest = originalXMLHttpRequest;
  });

  const setup = () => {
    const open = jest.fn();
    const send = jest.fn();
    const setRequestHeader = jest.fn();

    const XMLHttpRequestMock = function () {} as any;
    XMLHttpRequestMock.prototype.open = open;
    XMLHttpRequestMock.prototype.send = send;
    XMLHttpRequestMock.prototype.setRequestHeader = setRequestHeader;
    (global as any).XMLHttpRequest = XMLHttpRequestMock;

    const interceptor = require('../XHRInterceptorCompat').default;

    return { interceptor, XMLHttpRequestMock, open, send, setRequestHeader };
  };

  it('intercepts open, headers and send without importing React Native internals', () => {
    const { interceptor, XMLHttpRequestMock, open, send, setRequestHeader } = setup();
    const openCallback = jest.fn();
    const sendCallback = jest.fn();
    const requestHeaderCallback = jest.fn();
    const xhr = new XMLHttpRequestMock();

    xhr.addEventListener = jest.fn();
    interceptor.setOpenCallback(openCallback);
    interceptor.setSendCallback(sendCallback);
    interceptor.setRequestHeaderCallback(requestHeaderCallback);
    interceptor.enableInterception();

    xhr.open('GET', 'https://example.test');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send('body');

    expect(openCallback).toHaveBeenCalledWith('GET', 'https://example.test', xhr);
    expect(requestHeaderCallback).toHaveBeenCalledWith('Accept', 'application/json', xhr);
    expect(sendCallback).toHaveBeenCalledWith('body', xhr);
    expect(open).toHaveBeenCalledWith('GET', 'https://example.test');
    expect(setRequestHeader).toHaveBeenCalledWith('Accept', 'application/json');
    expect(send).toHaveBeenCalledWith('body');
  });

  it('reports response headers and completed responses', () => {
    const { interceptor, XMLHttpRequestMock } = setup();
    const headerReceivedCallback = jest.fn();
    const responseCallback = jest.fn();
    const xhr = new XMLHttpRequestMock();
    let readyStateListener = () => {};

    Object.assign(xhr, {
      HEADERS_RECEIVED: 2,
      DONE: 4,
      readyState: 1,
      status: 200,
      timeout: 1000,
      response: '{"ok":true}',
      responseURL: 'https://example.test',
      responseType: 'json',
      getResponseHeader: jest.fn((header: string) =>
        header === 'Content-Type' ? 'application/json; charset=utf-8' : '12',
      ),
      getAllResponseHeaders: jest.fn(() => 'Content-Type: application/json'),
      addEventListener: jest.fn((_event: string, listener: () => void) => {
        readyStateListener = listener;
      }),
    });

    interceptor.setHeaderReceivedCallback(headerReceivedCallback);
    interceptor.setResponseCallback(responseCallback);
    interceptor.enableInterception();
    xhr.send();

    xhr.readyState = xhr.HEADERS_RECEIVED;
    readyStateListener();
    expect(headerReceivedCallback).toHaveBeenCalledWith('application/json', 12, 'Content-Type: application/json', xhr);

    xhr.readyState = xhr.DONE;
    readyStateListener();
    expect(responseCallback).toHaveBeenCalledWith(200, 1000, '{"ok":true}', 'https://example.test', 'json', xhr);
  });

  it('restores the original XMLHttpRequest methods when disabled', () => {
    const { interceptor, XMLHttpRequestMock, open, send, setRequestHeader } = setup();

    interceptor.enableInterception();
    expect(interceptor.isInterceptorEnabled()).toBe(true);
    interceptor.disableInterception();

    expect(interceptor.isInterceptorEnabled()).toBe(false);
    expect(XMLHttpRequestMock.prototype.open).toBe(open);
    expect(XMLHttpRequestMock.prototype.send).toBe(send);
    expect(XMLHttpRequestMock.prototype.setRequestHeader).toBe(setRequestHeader);
  });

  it('does nothing when XMLHttpRequest is unavailable', () => {
    (global as any).XMLHttpRequest = undefined;
    const interceptor = require('../XHRInterceptorCompat').default;

    expect(() => interceptor.enableInterception()).not.toThrow();
    expect(interceptor.isInterceptorEnabled()).toBe(false);
  });

  it('does not patch XMLHttpRequest more than once', () => {
    const { interceptor, XMLHttpRequestMock } = setup();

    interceptor.enableInterception();
    const patchedOpen = XMLHttpRequestMock.prototype.open;
    interceptor.enableInterception();

    expect(XMLHttpRequestMock.prototype.open).toBe(patchedOpen);
  });
});
