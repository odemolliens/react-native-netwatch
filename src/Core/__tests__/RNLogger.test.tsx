import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import RNLogger from '../RNLogger';
import { RNRequest } from '../Objects/RNRequest';

jest.mock('react-native/Libraries/Blob/FileReader', () => ({}));
jest.mock('react-native/Libraries/Network/XHRInterceptor', () => ({
  isInterceptorEnabled: jest.fn().mockReturnValue(true),
  setOpenCallback: jest.fn(),
  setRequestHeaderCallback: jest.fn(),
  setSendCallback: jest.fn(),
  setHeaderReceivedCallback: jest.fn(),
  setResponseCallback: jest.fn(),
  enableInterception: jest.fn(),
  disableInterception: jest.fn(),
}));

const globalDateConstructor = Date.now;

beforeAll(() => {
  global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime());
});

afterAll(() => {
  global.Date.now = globalDateConstructor;
});

describe('enableXHRInterception', () => {
  const logger = new RNLogger();

  afterEach(() => {
    jest.clearAllMocks();
    logger.clear();
    logger.queue.clear();
  });
  it('should setCallback', () => {
    const callback = jest.fn();
    logger.setCallback(callback);
    expect(logger.callback).toEqual(callback);
  });

  it('should disabled XHRInterceptor', () => {
    logger.initialized = false; // Maybe should be false by default?
    logger.enableXHRInterception();
    expect(XHRInterceptor.enableInterception).toHaveBeenCalledTimes(1);
    logger.disableXHRInterception();
    expect(XHRInterceptor.disableInterception).toHaveBeenCalledTimes(1);
  });

  it('should do nothing if interceptor has already been enabled', () => {
    logger.initialized = true; // Maybe should be false by default?
    logger.enableXHRInterception();
    expect(XHRInterceptor.isInterceptorEnabled).toHaveBeenCalledTimes(0);
  });

  it('should not update the maxRequests if exceed not a number ', () => {
    // @ts-ignore
    logger.enableXHRInterception({ maxRequests: '' });
    // @ts-ignore
    const maxRequests = logger.maxRequests;
    // default value
    expect(maxRequests).toBe(100);
  });

  it('should update the maxRequests if provided', () => {
    logger.enableXHRInterception({ maxRequests: 23 });
    // @ts-ignore
    const maxRequests = logger.maxRequests;

    expect(maxRequests).toBe(23);
  });

  it('should call setOpenCallback', () => {
    logger.enableXHRInterception();

    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call setRequestHeaderCallback', () => {
    logger.enableXHRInterception();

    expect(XHRInterceptor.setRequestHeaderCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setRequestHeaderCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call setSendCallback', () => {
    logger.enableXHRInterception();

    expect(XHRInterceptor.setSendCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setSendCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call setHeaderReceivedCallback', () => {
    logger.enableXHRInterception();

    expect(XHRInterceptor.setHeaderReceivedCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setHeaderReceivedCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call setResponseCallback', () => {
    logger.enableXHRInterception();

    expect(XHRInterceptor.setResponseCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setResponseCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should update an existing request in the queue with readyState = 4', () => {
    const xhr = {
      _index: 1,
      readyState: 0,
      _url: 'https://test.com',
      _method: 'GET',
    };
    logger.enableXHRInterception();
    logger.openCallback('POST', 'http://test.url', xhr);

    const mockPartialRequest = {
      startTime: 1614176044011,
      responseContentType: 'application/json',
      responseSize: 0,
      responseType: 'blob',
      responseHeaders: {
        'Content-Length': '0',
        'Content-Type': 'application/json; charset=UTF-8',
        Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
        'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
      },
      readyState: 4,
    };

    const expectRequest = {
      _id: 1,
      type: 'RNR',
      startTime: 1614176044011,
      readyState: 4,
      url: 'http://test.url',
      shortUrl: 'http://test.url',
      method: 'POST',
      status: -1,
      endTime: 0,
      dataSent: '',
      response: '',
      responseContentType: 'application/json',
      responseSize: 0,
      responseType: 'blob',
      responseHeaders: {
        'Content-Length': '0',
        'Content-Type': 'application/json; charset=UTF-8',
        Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
        'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
      },
    };

    logger.updaterequest(1, mockPartialRequest);
    expect(logger.requests[0]).toEqual(expectRequest);
  });

  it('should update an existing request in the queue with readyState = 1', () => {
    const xhr = {
      _index: 2,
      readyState: 0,
      _url: 'https://test.url',
      _method: 'POST',
    };
    logger.enableXHRInterception();
    logger.openCallback('POST', 'http://test.url', xhr);

    const mockPartialRequest = {
      startTime: 1614176044011,
      responseContentType: 'application/json',
      responseSize: 0,
      responseType: 'blob',
      responseHeaders: {
        'Content-Length': '0',
        'Content-Type': 'application/json; charset=UTF-8',
        Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
        'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
      },
      readyState: 1,
    };

    const expectRequest = {
      _id: 2,
      type: 'RNR',
      startTime: 1614176044011,
      readyState: 1,
      url: 'http://test.url',
      shortUrl: 'http://test.url',
      method: 'POST',
      status: -1,
      endTime: 0,
      dataSent: '',
      response: '',
      responseContentType: 'application/json',
      responseSize: 0,
      responseType: 'blob',
      responseHeaders: {
        'Content-Length': '0',
        'Content-Type': 'application/json; charset=UTF-8',
        Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
        'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
      },
    };

    logger.updaterequest(2, mockPartialRequest);
    expect(logger.queue.get(2)).toEqual(expectRequest);
  });

  it('should execute sendCallback', () => {
    const xhr = {
      _index: 1,
      readyState: 0,
      _url: 'https://test.url',
      _method: 'POST',
    };
    logger.enableXHRInterception();
    logger.openCallback('POST', 'http://test.url', xhr);
    logger.sendCallback(JSON.stringify({ test: 'hello' }), xhr);

    const expectRequest = {
      _id: 3,
      type: 'RNR',
      startTime: 1554632430000,
      readyState: 0,
      url: 'http://test.url',
      shortUrl: 'http://test.url',
      method: 'POST',
      status: -1,
      endTime: 0,
      dataSent: '{\n  "test": "hello"\n}',
      response: '',
    };

    expect(logger.queue.get(3)).toEqual(expectRequest);
  });
});

describe('getRequests', () => {
  const logger = new RNLogger();

  afterEach(() => {
    jest.clearAllMocks();
    logger.clear();
    logger.queue.clear();
  });

  it('should return the requests', () => {
    // @ts-ignore
    logger.requests = ['test-request'];

    expect(logger.getRequests()).toEqual(['test-request']);
  });

  it('should clear the requests', () => {
    const logger = new RNLogger();

    // @ts-ignore
    logger.requests = ['test-request'];
    expect(logger.getRequests()).toEqual(['test-request']);
    logger.clear();
    expect(logger.getRequests()).toEqual([]);
  });

  it('should return undefined if missing index', () => {
    // @ts-expect-error
    const result = logger.getRequest();
    expect(result).toBeUndefined();
  });

  it('should return request that matches index', () => {
    const requests = [{ id: 1 }, { id: 2 }, { id: 3 }];
    // @ts-expect-error
    logger.requests = requests;
    const result = logger.getRequest(1);
    expect(result).toBe(requests[1]);
  });
});
