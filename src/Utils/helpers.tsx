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

const _path = RNFS.DocumentDirectoryPath + '/export.csv';
// write the file
export const csvWriter = (text = '', path = _path, encoding = 'utf8') =>
  RNFS.writeFile(path, text, encoding)
    .then(() => path)
    .catch(err => {
      console.log(err.message);
    });

// *******************************************************
// Helpers to convert the lists of calls into a CSV format
// *******************************************************

// STEP 1:
// transform an object to array
// {a: val1, b: val2 } ---> [val1, val2]
const transformObjectToArray = (object: any) => Object.values(object);

// STEP 2:
// transform nested object in a array to array
// [val1, {d: val4, e: val5 }, val3 ] ---> [val1, [val4, val5], val3]
const normalize = array =>
  array.map(element => {
    if (typeof element === 'object') {
      return normalize(transformObjectToArray(element));
    }
    if (typeof element === 'number') return element.toString(10);
    if (typeof element === 'string') return element;

    return '';
  });

// STEP 3:
// get all values in a nested array to store in the level 0 of the main array
// [val1, [val4, val5], val3] ---> [val1, val4, val5, val3]
// unlike the flat() function in Javascript vanilla, it is not necessary to know the level of nesting
const flatten = array =>
  array.reduce((acc, cur) => {
    if (Array.isArray(cur)) {
      return acc.concat(flatten(cur));
    }
    return acc.concat(cur);
  }, []);

// STEP 4:
export const getCSVfromArray = (array: any): string => {
  // report will be an array, each item corresponding to a line
  const report = array.map((object: any) => {
    return flatten(normalize(transformObjectToArray(object)));
  });
  return report.join('\n');
};
