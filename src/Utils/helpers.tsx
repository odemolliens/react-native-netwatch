import { EnumStatus, ILog } from '../types';
import RNFS from 'react-native-fs';
import {
  getDeviceId,
  getSystemVersion,
  getApiLevelSync,
  getApplicationName,
  getVersion,
  getBuildNumber,
} from 'react-native-device-info';
import XLSX from 'xlsx';
import { NRequest } from '../Core/Objects/NRequest';
import { RNRequest } from '../Core/Objects/RNRequest';

interface IDeviceInfo {
  brand: string;
  systemVersion: string;
  apiLevel: number;
  appName: string;
  appVersion: string;
  appBuild: string;
}

const _getDeviceInfo = (): IDeviceInfo => {
  const _brand = getDeviceId();
  const _systemVersion = getSystemVersion();
  const _apiLevel = getApiLevelSync();
  const _appName = getApplicationName();
  const _appVersion = getVersion();
  const _appBuild = getBuildNumber();

  return {
    brand: _brand,
    systemVersion: _systemVersion,
    apiLevel: _apiLevel,
    appName: _appName,
    appVersion: _appVersion,
    appBuild: _appBuild,
  };
};

export const getTime = (date: number | string): string => {
  // iOS need a string, Android need a number
  const _date = new Date(Number(date));
  const _minutes = ('0' + _date.getMinutes()).slice(-2);
  const _hours = ('0' + _date.getHours()).slice(-2);
  const _seconds = ('0' + _date.getSeconds()).slice(-2);
  return `${_hours}:${_minutes}:${_seconds}`;
};

// format date -> DD/MM/YYYY
export const getShortDate = (date: number | string): string => {
  const _date = new Date(Number(date));
  const _day = ('0' + _date.getDate()).slice(-2);
  const _month = ('0' + (_date.getMonth() + 1)).slice(-2);
  const _year = _date.getFullYear();

  return `${_day}/${_month}/${_year}`;
};

export const getDate = (date: number | string): string =>
  typeof date === 'string' ? new Date(Number.parseInt(date, 10)).toString() : new Date(date).toString();

export const getStatus = (status: number = 500): string => {
  if (status >= 200 && status < 300) return EnumStatus.Success;
  if (status >= 300 && status < 400) return EnumStatus.Warning;
  return EnumStatus.Failed;
};

export const duration = (startTime: number, endTime: number): number => endTime - startTime;

const _LIMIT = 100;
export const isLongText = (value: string): boolean => value !== undefined && value.length > _LIMIT;
export const addEllipsis = (value: string): string =>
  isLongText(value) ? value.slice(0, _LIMIT).concat('...') : value;

const _path = RNFS.DocumentDirectoryPath + '/export' + '.xlsx';
// write the file
export const xlsxWriter = async (text = [], encoding = 'ascii', path = _path, showDeviceInfo: boolean = true) => {
  if (await RNFS.exists(path)) {
    await deleteFile(path);
  }

  // Generate a new workbook
  const wb = XLSX.utils.book_new();
  // Tranform Object into sheet format
  const datas = XLSX.utils.json_to_sheet(text);
  // Add the sheet in the work book
  XLSX.utils.book_append_sheet(wb, datas, 'datas');

  if (showDeviceInfo) {
    try {
      const _temp: Array<IDeviceInfo> = [_getDeviceInfo()];
      const deviceInfos = XLSX.utils.json_to_sheet(_temp);
      XLSX.utils.book_append_sheet(wb, deviceInfos, 'device_infos');
    } catch (error) {
      console.error(error.message);
    }
  }
  // Write the file
  const xlsxFile = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

  return RNFS.writeFile(path, xlsxFile, encoding)
    .then(() => path)
    .catch(err => {
      console.error(err.message);
    });
};
export const deleteFile = (path: any) =>
  RNFS.unlink(path)
    .then(() => {})
    // `unlink` will throw an error, if the item to unlink does not exist
    .catch(err => {
      console.log(err.message);
    });

// *******************************************************
// Helpers to convert the lists of calls into a CSV format
// *******************************************************

const _getTemplate = (): any => ({
  icon: '',
  type: '',
  method: '',
  status: '',
  url: '',
  connectionType: '',
  isConnected: '',
  action: '',
  startTime: '',
  endTime: '',
  timeout: '',
  dataSent: '',
  requestHeaders: '',
  responseHeaders: '',
  responseContentType: '',
  responseSize: '',
  responseType: '',
  responseURL: '',
  response: '',
});

const _icon = (value: number) => {
  if (getStatus(value) === EnumStatus.Success) return '✅';
  if (getStatus(value) === EnumStatus.Warning) return '⚠️';
  return '❌';
};

export const formatDatas = (array: any): [] => {
  const excludedAttributes = ['_id', 'readyState', 'shortUrl', 'stringifiedAction'];

  // Loop 1: Iterate on every requests
  const rows = array.map((row: any) => {
    const _temp = _getTemplate();
    const _row = {
      icon: row.status ? _icon(row.status) : 'ℹ',
      ...row,
    };

    // Create formatted rows
    Object.entries(_row)
      .filter(item => !excludedAttributes.includes(item[0]))
      .map(value => {
        try {
          if (value[0] === 'type') {
            if (value[1] !== 'NR' && value[1] !== 'RNR') _temp[value[0]] = value[1];
            if (value[1] === 'NR') _temp[value[0]] = 'NATIVE REQUEST';
            if (value[1] === 'RNR') _temp[value[0]] = 'REACT NATIVE REQUEST';
          } else if (
            (value[0] === 'startTime' || value[0] === 'endTime') &&
            (typeof value[1] === 'number' || typeof value[1] === 'string')
          ) {
            _temp[value[0]] = getDate(value[1]);
          } else if (value[0] === 'responseContentType' && typeof value[1] === 'string') {
            _temp[value[0]] = value[1].replace(/(;)/gm, ':');
          } else if (typeof value[1] === 'object') {
            _temp[value[0]] = JSON.stringify(value[1])
              .replace(/(\r\n|\n|\r)/gm, '')
              .replace(/(;)/gm, ':');
          } else {
            _temp[value[0]] = value[1] || '';
          }
        } catch (error) {
          return;
        }
      });
    return _temp;
  });

  return rows;
};

export const mergeArrays = (...arrays: Array<ILog[]>) => [...arrays.flat()];

export const compare = (a: ILog, b: ILog) => {
  const startTimeA = a.startTime;
  const startTimeB = b.startTime;

  let comparison = 0;
  if (startTimeA > startTimeB) {
    comparison = 1;
  } else if (startTimeA < startTimeB) {
    comparison = -1;
  }
  return comparison;
};

export const getGeneralElementsAsArray = (item: NRequest | RNRequest) => (item && Object.entries(item)) || [];

export const getRequestHeadersElementsAsArray = (item: NRequest | RNRequest) =>
  (item?.requestHeaders && Object.entries(item.requestHeaders)) || [];

export const getResponseHeadersElementsAsArray = (item: NRequest | RNRequest) =>
  (item?.responseHeaders && Object.entries(item.responseHeaders)) || [];

export const stringifyData = (array: Array<string[]>): string => {
  const _string = '';
  const _result = array
    .filter((item: Array<string>) => !excludedAttributesForExport.includes(item[0]))
    .map((item: Array<string>) => {
      return _string.concat(item[0], ': ', item[1], '\n');
    });
  return _result.join('\n');
};

// These attribute will not be added in the details scrollview because always displayed in the other components
export const excludedAttributesForExport: Array<string> = [
  '_id',
  'type',
  'readyState',
  'method',
  'status',
  'startTime',
  'endTime',
  'dataSent',
  'requestHeaders',
  'responseHeaders',
  'response',
  'responseSize',
  'responseType',
  'responseContentType',
  'stringifiedAction',
  'shortUrl',
];

export const formatSharedMessage = (
  general: Array<string[]>,
  requestHeaders: Array<string[]>,
  postData: string,
  responseHeaders: Array<string[]>,
  bodyResponse: string,
): string => {
  const _general = stringifyData(general);
  const _requestHeaders = stringifyData(requestHeaders);
  const _responseHeaders = stringifyData(responseHeaders);
  const _report = ''.concat(
    'GENERAL\n',
    _general,
    '\n',
    'REQUEST HEADERS\n',
    _requestHeaders,
    '\n',
    'REQUEST DATA\n',
    postData,
    '\n',
    'RESPONSE HEADERS\n',
    _responseHeaders,
    '\n',
    'RESPONSE BODY\n',
    bodyResponse,
  );
  return _report;
};
