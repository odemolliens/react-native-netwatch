import { ILog } from '../../types';
import {
  getTime,
  getShortDate,
  getDate,
  getStatus,
  duration,
  formatDatas,
  mergeArrays,
  compare,
  xlsxWriter,
} from '../helpers';
import RNFS from 'react-native-fs';

jest.mock('react-native-fs', () => ({
  exists: jest.fn(),
  deleteFile: jest.fn(),
  writeFile: jest.fn(),
  DocumentDirectoryPath: 'my_directory',
}));

describe('Helpers tests', () => {
  const consoleError = jest.spyOn(console, 'error');

  beforeAll(() => {
    consoleError.mockImplementation(() => {});
    // Create a spy on console (console.log in this case) and provide some mocked implementation
    // In mocking global objects it's usually better than simple `jest.fn()`
    // because you can `unmock` it in clean way doing `mockRestore`
  });
  afterAll(() => {
    // Restore mock after all tests are done, so it won't affect other test suites
    consoleError.mockRestore();
  });
  afterEach(() => {
    // Clear mock (all calls etc) after each test.
    // It's needed when you're using console somewhere in the tests so you have clean mock each time
    consoleError.mockClear();
  });

  // Set jest to UTC if necessary - Server must be setted with UTC
  // If you are using jestrunner,
  // add: TZ=UTC yarn test as Jest Command in settings
  describe('Timezones', () => {
    it('should always be UTC', () => {
      expect(new Date().getTimezoneOffset()).toBe(0);
    });
  });

  describe('Status and Date', () => {
    // Test getTime
    it('should return 17:03:44 if unixtime number is 1612976624143', () => {
      const date: number = 1612976624143;
      expect(getTime(date)).toBe('17:03:44');
    });

    // Test getShortTime
    it('should return 10/02/2021 if unixtime number is 1612976624145', () => {
      const date: number = 1612976624145;
      expect(getShortDate(date)).toBe('10/02/2021');
    });

    // Test getDate
    it('should return Wed Feb 10 2021 17:03:44 GMT+0000 (Coordinated Universal Time) if unixtime number is 1612976624145', () => {
      const date: number = 1612976624145; // unixtime
      expect(getDate(date)).toBe('Wed Feb 10 2021 17:03:44 GMT+0000 (Coordinated Universal Time)');
    });

    // Tests getStatus
    it('should return SUCCESS if status=200', () => {
      const status: number = 200;
      expect(getStatus(status)).toBe('SUCCESS');
    });

    it('should return SUCCESS if status=299', () => {
      const status: number = 299;
      expect(getStatus(status)).toBe('SUCCESS');
    });

    it('should return WARNING if status=300', () => {
      const status: number = 300;
      expect(getStatus(status)).toBe('WARNING');
    });

    it('should return WARNING if status=399', () => {
      const status: number = 399;
      expect(getStatus(status)).toBe('WARNING');
    });

    it('should return FAILED if status=400', () => {
      const status: number = 400;
      expect(getStatus(status)).toBe('FAILED');
    });

    it('should return FAILED if status=500', () => {
      const status: number = 500;
      expect(getStatus(status)).toBe('FAILED');
    });

    it('should return FAILED if status=0', () => {
      const status: number = 0;
      expect(getStatus(status)).toBe('FAILED');
    });

    it('should return FAILED if status=199', () => {
      const status: number = 199;
      expect(getStatus(status)).toBe('FAILED');
    });

    it('should return FAILED if status=999', () => {
      const status: number = 999;
      expect(getStatus(status)).toBe('FAILED');
    });

    it('should return FAILED if status is not specified', () => {
      expect(getStatus()).toBe('FAILED');
    });

    //Test duration
    it('should return 1000000 if startTime=1612976624145 and endTime=1612977624145', () => {
      const startTime: number = 1612976624145;
      const endTime: number = 1612977624145;
      expect(duration(startTime, endTime)).toBe(1000000);
    });
  });

  describe('Formatter', () => {
    //Test array conversion to CSV format
    it('should return myRequests formatted to be used with XLSX lib', () => {
      expect(formatDatas(myRequests)).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "",
            "dataSent": "dataSent",
            "endTime": "Tue Feb 16 2021 12:12:55 GMT+0000 (Coordinated Universal Time)",
            "icon": "✅",
            "method": "GET",
            "requestHeaders": "{\\"Content-Type\\":\\"application/json\\"}",
            "response": "response",
            "responseContentType": "application/json",
            "responseHeaders": "{\\"Content-Length\\":\\"0\\",\\"Content-Type\\":\\"application/json: charset=UTF-8\\",\\"Date\\":\\"Tue, 16 Feb 2021 12:12:55 GMT\\",\\"Sozu-Id\\":\\"51989c0c-ebe7-4574-913d-443477875da7\\"}",
            "responseSize": "",
            "responseType": "blob",
            "responseURL": "https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9",
            "startTime": "Tue Feb 16 2021 12:12:54 GMT+0000 (Coordinated Universal Time)",
            "status": 200,
            "timeout": "",
            "type": "REACT NATIVE REQUEST",
            "url": "https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9",
          },
          Object {
            "action": "",
            "dataSent": "dataSent",
            "endTime": "Tue Feb 16 2021 12:12:55 GMT+0000 (Coordinated Universal Time)",
            "icon": "✅",
            "method": "GET",
            "requestHeaders": "{\\"Content-Type\\":\\"application/json\\"}",
            "response": "response",
            "responseContentType": "application/json",
            "responseHeaders": "{\\"Content-Length\\":\\"0\\",\\"Content-Type\\":\\"application/json: charset=UTF-8\\",\\"Date\\":\\"Tue, 16 Feb 2021 12:12:55 GMT\\",\\"Sozu-Id\\":\\"51989c0c-ebe7-4574-913d-443477875da7\\"}",
            "responseSize": "",
            "responseType": "blob",
            "responseURL": "https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9",
            "startTime": "Tue Feb 16 2021 12:12:54 GMT+0000 (Coordinated Universal Time)",
            "status": 200,
            "timeout": "",
            "type": "NATIVE REQUEST",
            "url": "https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9",
          },
          Object {
            "action": "",
            "dataSent": "dataSent",
            "endTime": "Tue Feb 16 2021 12:12:55 GMT+0000 (Coordinated Universal Time)",
            "icon": "⚠️",
            "method": "POST",
            "requestHeaders": "{\\"Content-Type\\":\\"application/json\\"}",
            "response": "response",
            "responseContentType": "application/json",
            "responseHeaders": "{\\"Content-Length\\":\\"0\\",\\"Content-Type\\":\\"application/json: charset=UTF-8\\",\\"Date\\":\\"Tue, 16 Feb 2021 12:12:55 GMT\\",\\"Sozu-Id\\":\\"51989c0c-ebe7-4574-913d-443477875da7\\"}",
            "responseSize": "",
            "responseType": "blob",
            "responseURL": "https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9",
            "startTime": "Tue Feb 16 2021 12:12:54 GMT+0000 (Coordinated Universal Time)",
            "status": 301,
            "timeout": "",
            "type": "NATIVE REQUEST",
            "url": "https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9",
          },
          Object {
            "action": "",
            "dataSent": "dataSent",
            "endTime": "Tue Feb 16 2021 12:12:55 GMT+0000 (Coordinated Universal Time)",
            "icon": "❌",
            "method": "PUT",
            "requestHeaders": "{\\"Content-Type\\":\\"application/json\\"}",
            "response": "response",
            "responseContentType": "application/json",
            "responseHeaders": "{\\"Content-Length\\":\\"0\\",\\"Content-Type\\":\\"application/json: charset=UTF-8\\",\\"Date\\":\\"Tue, 16 Feb 2021 12:12:55 GMT\\",\\"Sozu-Id\\":\\"51989c0c-ebe7-4574-913d-443477875da7\\"}",
            "responseSize": "",
            "responseType": "blob",
            "responseURL": "https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9",
            "startTime": "Tue Feb 16 2021 12:12:54 GMT+0000 (Coordinated Universal Time)",
            "status": 500,
            "timeout": "",
            "type": "NATIVE REQUEST",
            "url": "https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9",
          },
          Object {
            "action": "{\\"type\\":\\"__ERROR:UNDEFINED__\\",\\"payload\\":\\"test\\"}",
            "dataSent": "",
            "endTime": "",
            "icon": "ℹ",
            "method": "",
            "requestHeaders": "",
            "response": "",
            "responseContentType": "",
            "responseHeaders": "",
            "responseSize": "",
            "responseType": "",
            "responseURL": "",
            "startTime": "Thu Jan 01 1970 00:00:00 GMT+0000 (Coordinated Universal Time)",
            "status": "",
            "timeout": "",
            "type": "REDUX",
            "url": "",
          },
          Object {
            "action": "",
            "dataSent": "",
            "endTime": "",
            "icon": "ℹ",
            "method": "",
            "requestHeaders": "",
            "response": "",
            "responseContentType": "",
            "responseHeaders": "",
            "responseSize": "",
            "responseType": "",
            "responseURL": "",
            "startTime": "",
            "status": "",
            "timeout": "",
            "type": "",
            "url": "",
          },
        ]
      `);
    });
  });

  describe('Functions to manipulate arrays', () => {
    it('should return mergedArray', () => {
      const arrayOne: Array<ILog> = [
        { _id: 1, startTime: 2763, type: 'RNR' },
        { _id: 2, startTime: 209387, type: 'RNR' },
      ];
      const arrayTwo: Array<ILog> = [
        { _id: 3, startTime: 397452, type: 'NR' },
        { _id: 4, startTime: 489338, type: 'NR' },
      ];

      const result: Array<ILog> = [
        { _id: 1, startTime: 2763, type: 'RNR' },
        { _id: 2, startTime: 209387, type: 'RNR' },
        { _id: 3, startTime: 397452, type: 'NR' },
        { _id: 4, startTime: 489338, type: 'NR' },
      ];

      expect(mergeArrays(arrayOne, arrayTwo)).toStrictEqual(result);
    });

    it('should return compare', () => {
      const itemCurrent: ILog = { _id: 1, startTime: 1612976624143, type: 'RNR' };
      const itemBefore: ILog = { _id: 2, startTime: 1612976624140, type: 'RNR' };
      const itemAfter: ILog = { _id: 3, startTime: 1612976624145, type: 'RNR' };
      const itemSame: ILog = { _id: 4, startTime: 1612976624143, type: 'RNR' };

      expect(compare(itemCurrent, itemBefore)).toBe(1);
      expect(compare(itemCurrent, itemAfter)).toBe(-1);
      expect(compare(itemCurrent, itemSame)).toBe(0);
    });
  });

  describe('Test RNFS', () => {
    it('should create a new file', async () => {
      RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(false));
      RNFS.writeFile = jest.fn().mockImplementation((path, text, encoding) => Promise.resolve({}));
      RNFS.unlink = jest.fn().mockImplementation(() => Promise.resolve(true));

      let file = await xlsxWriter();
      expect(RNFS.exists).toBeCalledTimes(1);
      expect(RNFS.unlink).not.toBeCalled();
      expect(RNFS.writeFile).toBeCalledTimes(1);
      expect(file).not.toBeUndefined();
    });

    it('should throw an error if param for xlsxWriter is not an array of object', () => {
      RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(false));
      RNFS.unlink = jest.fn().mockImplementation(() => Promise.resolve(true));
      // @ts-ignore
      expect(() => xlsxWriter({})).rejects.toThrowErrorMatchingInlineSnapshot(`"js.forEach is not a function"`);
      expect(RNFS.exists).toBeCalledTimes(1);
    });

    it('should replace an existing file ', async () => {
      RNFS.writeFile = jest.fn().mockImplementation((path, text, encoding) => Promise.resolve({}));
      RNFS.unlink = jest.fn().mockImplementation(() => Promise.resolve(true));

      // Create a first file
      RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(false));
      let file = await xlsxWriter(myDatas, 'utf-8', '/my/path', false);
      expect(RNFS.exists).toBeCalledTimes(1);
      expect(RNFS.unlink).not.toBeCalled();
      expect(RNFS.writeFile).toBeCalledTimes(1);
      expect(file).not.toBeUndefined();

      RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(true));
      // Try to replace with another file with the same path
      let newfile = await xlsxWriter(myDatas, 'utf-8', '/my/path');
      expect(RNFS.exists).toBeCalledTimes(1);
      expect(RNFS.unlink).toBeCalledTimes(1);
      expect(RNFS.writeFile).toBeCalledTimes(2);
      expect(newfile).not.toBeUndefined();
    });

    it('should throw an error when writing a new file', async () => {
      RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(false));
      RNFS.writeFile = jest.fn().mockImplementation(() => Promise.reject({ error: 'Error unexpected' }));

      let errorfile = await xlsxWriter(myDatas, 'utf-8', '/my/path', false);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(errorfile).toBeUndefined();
    });

    it('should throw an error during unlink', async () => {
      RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(true));
      RNFS.unlink = jest.fn().mockImplementation(() => Promise.reject({ error: 'Error unexpected' }));
      RNFS.writeFile = jest.fn().mockImplementation(() => Promise.reject({ error: 'Cannot write this file' }));

      let errorfile = await xlsxWriter(myDatas, 'utf-8', '/my/path');
      expect(consoleError).toHaveBeenCalledTimes(2);
      expect(errorfile).toBeUndefined();
    });
  });
});

const myRequests = [
  {
    _id: 73,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    method: 'GET',
    readyState: 4,
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    response: 'response',
    responseContentType: 'application/json',
    responseHeaders: {
      'Content-Length': '0',
      'Content-Type': 'application/json; charset=UTF-8',
      Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
      'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
    },
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    status: 200,
    timeout: 0,
    type: 'RNR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  },
  {
    _id: 77,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    method: 'GET',
    readyState: 4,
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    response: 'response',
    responseContentType: 'application/json',
    responseHeaders: {
      'Content-Length': '0',
      'Content-Type': 'application/json; charset=UTF-8',
      Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
      'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
    },
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    status: 200,
    timeout: 0,
    type: 'NR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  },
  {
    _id: 78,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    method: 'POST',
    readyState: 4,
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    response: 'response',
    responseContentType: 'application/json',
    responseHeaders: {
      'Content-Length': '0',
      'Content-Type': 'application/json; charset=UTF-8',
      Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
      'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
    },
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    status: 301,
    timeout: 0,
    type: 'NR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  },
  {
    _id: 79,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    method: 'PUT',
    readyState: 4,
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    response: 'response',
    responseContentType: 'application/json',
    responseHeaders: {
      'Content-Length': '0',
      'Content-Type': 'application/json; charset=UTF-8',
      Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
      'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
    },
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    status: 500,
    timeout: 0,
    type: 'NR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  },
  {
    _id: 80,
    startTime: 100,
    type: 'REDUX',
    action: { type: '__ERROR:UNDEFINED__', payload: 'test' },
  },
  {},
];

const myDatas: Array<any> = [
  {
    id: 1,
    name: 'test',
  },
];
