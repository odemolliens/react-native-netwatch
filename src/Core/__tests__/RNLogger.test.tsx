import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import RNLogger from '../RNLogger';
import { RNRequest } from '../Objects/RNRequest';

jest.mock('react-native/Libraries/Blob/FileReader', () => ({}));
jest.mock('react-native/Libraries/Network/XHRInterceptor', () => ({
  isInterceptorEnabled: jest.fn(),
  setOpenCallback: jest.fn(),
  setRequestHeaderCallback: jest.fn(),
  setSendCallback: jest.fn(),
  setHeaderReceivedCallback: jest.fn(),
  setResponseCallback: jest.fn(),
  enableInterception: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('enableXHRInterception', () => {
  it('should setCallback', () => {
    const logger = new RNLogger();
    const callback = jest.fn();
    logger.setCallback(callback);
    expect(logger.callback).toEqual(callback);
  });

  // FIX: This test failed
  it('should disabled XHRInterceptor', () => {
    const logger = new RNLogger();
    logger.enableXHRInterception();
    (XHRInterceptor.isInterceptorEnabled as jest.Mock).mockReturnValueOnce(true);
    logger.disableXHRInterception();
    expect(XHRInterceptor.isInterceptorEnabled).toHaveBeenCalledTimes(1);
  });

  it('should do nothing if interceptor has already been enabled', () => {
    const logger = new RNLogger();

    (XHRInterceptor.isInterceptorEnabled as jest.Mock).mockReturnValueOnce(true);

    expect(logger.enableXHRInterception()).toBeUndefined();
    expect(XHRInterceptor.isInterceptorEnabled).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledTimes(0);
  });

  it('should update the maxRequests if provided', () => {
    const logger = new RNLogger();

    logger.enableXHRInterception({ maxRequests: 23 });
    // @ts-ignore
    const maxRequests = logger.maxRequests;

    expect(maxRequests).toBe(23);
  });

  it('should call setOpenCallback', () => {
    const logger = new RNLogger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call setRequestHeaderCallback', () => {
    const logger = new RNLogger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setRequestHeaderCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setRequestHeaderCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call setSendCallback', () => {
    const logger = new RNLogger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setSendCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setSendCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call setHeaderReceivedCallback', () => {
    const logger = new RNLogger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setHeaderReceivedCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setHeaderReceivedCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should call setResponseCallback', () => {
    const logger = new RNLogger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setResponseCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setResponseCallback).toHaveBeenCalledWith(expect.any(Function));
  });

  // TODO: Fix this test
  it('should update an existing request in the queue', () => {
    const logger = new RNLogger();
    const xhr = {
      _index: 1,
      readyState: 0,
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
      readyState: 0,
      url: 'http://test.url',
      method: 'POST',
      status: -1,
      endTime: 0,
      dataSent: '',
      response: '',
    };

    expect(logger.updaterequest(1, mockPartialRequest)).toEqual(expectRequest);
  });

  it('should call enableInterception', () => {
    const logger = new RNLogger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.enableInterception).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.enableInterception).toHaveBeenCalledWith();
  });
});

describe('getRequests', () => {
  it('should return the requests', () => {
    const logger = new RNLogger();

    // @ts-ignore
    logger.requests = ['test-request'];

    expect(logger.getRequests()).toEqual(['test-request']);
  });
});

describe('clearRequests', () => {
  it('should clear the requests', () => {
    const logger = new RNLogger();

    logger.callback = jest.fn();

    // @ts-ignore
    logger.requests = ['test-request'];

    logger.clear();

    expect(logger.getRequests()).toEqual([]);
    expect(logger.callback).toHaveBeenCalledTimes(1);
    expect(logger.callback).toHaveBeenCalledWith([]);
  });
});

// Private methods

describe('getRequest', () => {
  it('should return undefined if missing index', () => {
    const logger = new RNLogger();
    // @ts-expect-error
    const result = logger.getRequest();
    expect(result).toBeUndefined();
  });

  it('should return request that matches index', () => {
    const logger = new RNLogger();
    const requests = [{ id: 1 }, { id: 2 }, { id: 3 }];
    // @ts-expect-error
    logger.requests = requests;
    const result = logger.getRequest(1);
    expect(result).toBe(requests[1]);
  });
});
