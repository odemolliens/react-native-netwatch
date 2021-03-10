import { ILog } from '../../types';
import {
  getTime,
  getShortDate,
  getDate,
  getStatus,
  duration,
  getCSVfromArray,
  mergeArrays,
  compare,
  csvWriter,
} from '../helpers';
import RNFS, { writeFile } from 'react-native-fs';

jest.mock('react-native-fs', () => ({
  exists: jest.fn(),
  deleteFile: jest.fn(),
  writeFile: jest.fn(),
  DocumentDirectoryPath: 'my_directory',
}));

//Set jest to UTC if necessary
describe('Timezones', () => {
  it('should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});

describe('Index test suite', () => {
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

  //Test array conversion to CSV format
  it('should return myRequests in CSV format with ; as separator', () => {
    expect(getCSVfromArray(myRequests)).toBe(myCSV);
  });

  it('should return myCSVwithoutInfo in CSV format with ; as separator without label and device info', () => {
    expect(getCSVfromArray(myRequests, false, false)).toBe(myCSVwithoutInfo);
  });

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

    let file = await csvWriter();
    expect(RNFS.exists).toBeCalledTimes(1);
    expect(RNFS.unlink).not.toBeCalled();
    expect(RNFS.writeFile).toBeCalledTimes(1);
    expect(file).not.toBeUndefined();
  });

  it('should replace an existing file ', async () => {
    RNFS.writeFile = jest.fn().mockImplementation((path, text, encoding) => Promise.resolve({}));
    RNFS.unlink = jest.fn().mockImplementation(() => Promise.resolve(true));

    // Create a first file
    RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(false));
    let file = await csvWriter('mytest', '/my/path', 'utf-8');
    expect(RNFS.exists).toBeCalledTimes(1);
    expect(RNFS.unlink).not.toBeCalled();
    expect(RNFS.writeFile).toBeCalledTimes(1);
    expect(file).not.toBeUndefined();

    RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(true));
    // Try to replace with another file with the same path
    let newfile = await csvWriter('mynewtest', '/my/path', 'utf-8');
    expect(RNFS.exists).toBeCalledTimes(1);
    expect(RNFS.unlink).toBeCalledTimes(1);
    expect(RNFS.writeFile).toBeCalledTimes(2);
    expect(newfile).not.toBeUndefined();
  });

  it('should throw an error when writing a new file', async () => {
    RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(false));
    RNFS.writeFile = jest.fn().mockImplementation(() => Promise.reject({ error: 'Error unexpected' }));

    let errorfile = await csvWriter('myerrortest', '/my/path', 'utf8');
    expect(errorfile).toBeUndefined();
  });

  it('should throw an error during unlink', async () => {
    RNFS.exists = jest.fn().mockImplementation(() => Promise.resolve(true));
    RNFS.unlink = jest.fn().mockImplementation(() => Promise.reject({ error: 'Error unexpected' }));
    RNFS.writeFile = jest.fn().mockImplementation(() => Promise.reject({ error: 'Cannot write this file' }));

    let errorfile = await csvWriter('myerrortest', '/my/path', 'utf8');
    console.log(errorfile);
    expect(errorfile).toBeUndefined();
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

const myCSV =
  'icon;type;method;status;url;action;startTime;endTime;timeout;dataSent;requestHeaders;responseHeaders;responseContentType;responseSize;responseType;responseURL;response\nbrand,;os,;systemVersion,;apiLevel,;appName,;appVersion,;appBuild,\n✅;REACT NATIVE REQUEST;GET;200;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;;Tue Feb 16 2021 13:12:54 GMT+0100 (Central European Standard Time);Tue Feb 16 2021 13:12:55 GMT+0100 (Central European Standard Time);;dataSent;{"Content-Type":"application/json"};{"Content-Length":"0","Content-Type":"application/json: charset=UTF-8","Date":"Tue, 16 Feb 2021 12:12:55 GMT","Sozu-Id":"51989c0c-ebe7-4574-913d-443477875da7"};application/json;;blob;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;response\n✅;NATIVE REQUEST;GET;200;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;;Tue Feb 16 2021 13:12:54 GMT+0100 (Central European Standard Time);Tue Feb 16 2021 13:12:55 GMT+0100 (Central European Standard Time);;dataSent;{"Content-Type":"application/json"};{"Content-Length":"0","Content-Type":"application/json: charset=UTF-8","Date":"Tue, 16 Feb 2021 12:12:55 GMT","Sozu-Id":"51989c0c-ebe7-4574-913d-443477875da7"};application/json;;blob;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;response\n⚠️;NATIVE REQUEST;POST;301;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;;Tue Feb 16 2021 13:12:54 GMT+0100 (Central European Standard Time);Tue Feb 16 2021 13:12:55 GMT+0100 (Central European Standard Time);;dataSent;{"Content-Type":"application/json"};{"Content-Length":"0","Content-Type":"application/json: charset=UTF-8","Date":"Tue, 16 Feb 2021 12:12:55 GMT","Sozu-Id":"51989c0c-ebe7-4574-913d-443477875da7"};application/json;;blob;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;response\n❌;NATIVE REQUEST;PUT;500;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;;Tue Feb 16 2021 13:12:54 GMT+0100 (Central European Standard Time);Tue Feb 16 2021 13:12:55 GMT+0100 (Central European Standard Time);;dataSent;{"Content-Type":"application/json"};{"Content-Length":"0","Content-Type":"application/json: charset=UTF-8","Date":"Tue, 16 Feb 2021 12:12:55 GMT","Sozu-Id":"51989c0c-ebe7-4574-913d-443477875da7"};application/json;;blob;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;response\n❌;REDUX;;;;{"type":"__ERROR:UNDEFINED__","payload":"test"};Thu Jan 01 1970 01:00:00 GMT+0100 (Central European Standard Time);;;;;;;;;;\n❌;;;;;;;;;;;;;;;;';

const myCSVwithoutInfo =
  '✅;REACT NATIVE REQUEST;GET;200;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;;Tue Feb 16 2021 13:12:54 GMT+0100 (Central European Standard Time);Tue Feb 16 2021 13:12:55 GMT+0100 (Central European Standard Time);;dataSent;{"Content-Type":"application/json"};{"Content-Length":"0","Content-Type":"application/json: charset=UTF-8","Date":"Tue, 16 Feb 2021 12:12:55 GMT","Sozu-Id":"51989c0c-ebe7-4574-913d-443477875da7"};application/json;;blob;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;response\n✅;NATIVE REQUEST;GET;200;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;;Tue Feb 16 2021 13:12:54 GMT+0100 (Central European Standard Time);Tue Feb 16 2021 13:12:55 GMT+0100 (Central European Standard Time);;dataSent;{"Content-Type":"application/json"};{"Content-Length":"0","Content-Type":"application/json: charset=UTF-8","Date":"Tue, 16 Feb 2021 12:12:55 GMT","Sozu-Id":"51989c0c-ebe7-4574-913d-443477875da7"};application/json;;blob;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;response\n⚠️;NATIVE REQUEST;POST;301;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;;Tue Feb 16 2021 13:12:54 GMT+0100 (Central European Standard Time);Tue Feb 16 2021 13:12:55 GMT+0100 (Central European Standard Time);;dataSent;{"Content-Type":"application/json"};{"Content-Length":"0","Content-Type":"application/json: charset=UTF-8","Date":"Tue, 16 Feb 2021 12:12:55 GMT","Sozu-Id":"51989c0c-ebe7-4574-913d-443477875da7"};application/json;;blob;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;response\n❌;NATIVE REQUEST;PUT;500;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;;Tue Feb 16 2021 13:12:54 GMT+0100 (Central European Standard Time);Tue Feb 16 2021 13:12:55 GMT+0100 (Central European Standard Time);;dataSent;{"Content-Type":"application/json"};{"Content-Length":"0","Content-Type":"application/json: charset=UTF-8","Date":"Tue, 16 Feb 2021 12:12:55 GMT","Sozu-Id":"51989c0c-ebe7-4574-913d-443477875da7"};application/json;;blob;https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9;response\n❌;REDUX;;;;{"type":"__ERROR:UNDEFINED__","payload":"test"};Thu Jan 01 1970 01:00:00 GMT+0100 (Central European Standard Time);;;;;;;;;;\n❌;;;;;;;;;;;;;;;;';
