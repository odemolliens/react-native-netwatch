import { EnumStatus, ILog } from '../types';
import RNFS from 'react-native-fs';
import {
  getBrand,
  getBaseOsSync,
  getSystemVersion,
  getApiLevelSync,
  getApplicationName,
  getVersion,
  getBuildNumber,
} from 'react-native-device-info';

interface IDeviceInfo {
  brand: string;
  os: string;
  systemVersion: string;
  apiLevel: number;
  appName: string;
  appVersion: string;
  appBuild: string;
}

const _getDeviceInfo = (): IDeviceInfo => {
  const _brand = getBrand();
  const _os = getBaseOsSync();
  const _systemVersion = getSystemVersion();
  const _apiLevel = getApiLevelSync();
  const _appName = getApplicationName();
  const _appVersion = getVersion();
  const _appBuild = getBuildNumber();

  return {
    brand: _brand,
    os: _os,
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

export const getDate = (date: number | string): string => new Date(Number(date)).toString();

export const getStatus = (status: number = 500): string => {
  if (status >= 200 && status < 300) return EnumStatus.Success;
  if (status >= 300 && status < 400) return EnumStatus.Warning;
  return EnumStatus.Failed;
};

export const duration = (startTime: number, endTime: number): number => endTime - startTime;

const _path = RNFS.DocumentDirectoryPath + '/export' + '.csv';
// write the file
export const csvWriter = async (text = '', path = _path, encoding = 'utf8') => {
  if (await RNFS.exists(path)) {
    await deleteFile(path);
  }

  return RNFS.writeFile(path, text, encoding)
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

export const getCSVfromArray = (array: any, showLabel: boolean = true, showDeviceInfo: boolean = true): string => {
  const excludedAttributes = ['_id', 'readyState'];

  let deviceInfo = {};
  try {
    deviceInfo = _getDeviceInfo();
  } catch (error) {
    console.error(error.message);
  }

  // Loop 1: Iterate on every requests
  const rows = array.map((row: any) => {
    const _temp = _getTemplate();
    const _row = {
      icon: _icon(row.status),
      ...row,
    };

    // Create a row as string
    Object.entries(_row)
      .filter(item => !excludedAttributes.includes(item[0]))
      .map(value => {
        try {
          if (value[0] === 'type') {
            if (value[1] !== 'NR' && value[1] !== 'RNR') _temp[value[0]] = value[1];
            if (value[1] === 'NR') _temp[value[0]] = 'NATIVE REQUEST';
            if (value[1] === 'RNR') _temp[value[0]] = 'REACT NATIVE REQUEST';
          } else if ((value[0] === 'startTime' || value[0] === 'endTime') && typeof value[1] === 'number') {
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
    return Object.values(_temp)
      .join(';')
      .replace(/(\r\n|\n|\r)/gm, '');
  });

  let _result = rows;
  if (showDeviceInfo) {
    const _deviceInfo = Object.entries(deviceInfo).join(';');
    _result = [_deviceInfo].concat(_result);
  }
  if (showLabel) {
    const _headers = Object.keys(_getTemplate()).join(';');
    _result = [_headers].concat(_result);
  }

  return _result.join('\n');
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
