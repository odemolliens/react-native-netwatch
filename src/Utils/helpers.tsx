import { EnumStatus } from '../types';
import RNFS from 'react-native-fs';

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
export const deleteFile = (path: any) => {
  return (
    RNFS.unlink(path)
      .then(() => {})
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch(err => {
        console.log(err.message);
      })
  );
};

// *******************************************************
// Helpers to convert the lists of calls into a CSV format
// *******************************************************

const _getTemplate = () => {
  return {
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
  };
};

export const getCSVfromArray = (array: any, showLabel: boolean = true): string => {
  const excludedAttributes = ['_id', 'readyState'];

  // Loop 1: Iterate on every requests
  let rows = array.map((_row: any) => {
    let _temp = _getTemplate();
    // Create a row as string
    Object.entries(_row)
      .filter(item => !excludedAttributes.includes(item[0]))
      .map(value => {
        try {
          if ((value[0] === 'startTime' || value[0] === 'endTime') && typeof value[1] === 'number') {
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

  let _temp = null;
  if (showLabel) {
    let _headers = Object.keys(_getTemplate()).join(';');
    _temp = [_headers].concat(rows);
  } else {
    _temp = rows;
  }

  return _temp.join('\n');
};
