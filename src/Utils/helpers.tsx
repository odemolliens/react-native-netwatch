import { EnumStatus } from '../types';
import RNFS from 'react-native-fs';
import RNRequest from '../Core/Objects/RNRequest';

export const getTime = (date: number): string => {
  // iOS need a string, Android need a number
  const _date = new Date(date);
  const _minutes = ('0' + _date.getMinutes()).slice(-2);
  const _hours = ('0' + _date.getHours()).slice(-2);
  const _seconds = ('0' + _date.getSeconds()).slice(-2);
  return `${_hours}:${_minutes}:${_seconds}`;
};

// format date -> DD/MM/YYYY
export const getShortDate = (date: number): string => {
  const _date = new Date(date);
  const _day = ('0' + _date.getDate()).slice(-2);
  const _month = ('0' + (_date.getMonth() + 1)).slice(-2);
  const _year = _date.getFullYear();

  return `${_day}/${_month}/${_year}`;
};

export const getDate = (date: number): string => new Date(date).toString();

export const getStatus = (status: number = 500): string => {
  if (status >= 200 && status < 300) return EnumStatus.Success;
  if (status >= 300 && status < 400) return EnumStatus.Warning;
  return EnumStatus.Failed;
};

export const duration = (startTime: number, endTime: number): number => endTime - startTime;

const _path = RNFS.DocumentDirectoryPath + '/export_' + makeid(8) + '.csv';
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
export const deleteFile = (path: any) => {
  return (
    RNFS.unlink(path)
      .then(() => {
        console.log('FILE DELETED');
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch(err => {
        console.log(err.message);
      })
  );
};

function makeid(length = 12) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// *******************************************************
// Helpers to convert the lists of calls into a CSV format
// *******************************************************
export const getCSVfromArray = (array: any, showLabel: boolean = true): string => {
  const _array = new RNRequest();
  const includedAttributes = [
    '_id',
    'type',
    'startTime',
    'readyState',
    'url',
    'method',
    'status',
    'endTime',
    'timeout',
    'dataSent',
    'requestHeaders',
    'responseHeaders',
    'responseContentType',
    'responseSize',
    'responseType',
    'responseURL',
    'response',
    'action',
  ];

  // Loop 1: Iterate on every requests
  let rows = array.map((_row: any) => {
    // Create a row as string
    let row = Object.entries(_row)
      .filter(item => includedAttributes.includes(item[0]))
      .map(value => {
        try {
          if (typeof value[1] === 'object') return JSON.stringify(value[1]);
          return value[1];
        } catch (error) {
          console.error(error.message);
          return;
        }
      });
    return row.join(';').replace(/(\r\n|\n|\r)/gm, '');
  });

  let _temp = null;
  if (showLabel) {
    let headers = Object.keys(_array)
      .filter((header: string) => includedAttributes.includes(header))
      .map((header: string) => header);
    _temp = [headers.join(';')].concat(rows);
  } else {
    _temp = rows;
  }

  return _temp.join('\n');
};
