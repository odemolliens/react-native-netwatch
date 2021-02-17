import { ILog, LogType } from '../../types';
//@ts-ignore
// BlobFileReader is needed to read the content of the body response (it's type can be blob)
import BlobFileReader from 'react-native/Libraries/Blob/FileReader';

const fromEntries = (arr: any[]) =>
  arr.reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});

export const stringifyData = (data: any) => {
  try {
    if (data?._parts?.length) {
      return JSON.stringify(fromEntries(data?._parts), null, 2);
    }
    return JSON.stringify(JSON.parse(data), null, 2);
  } catch (e) {
    return `${data}`;
  }
};

export const getRequestBody = (dataSent: any) => {
  return stringifyData(dataSent || '');
};

export const getResponseBody = async (
  responseType: string,
  response?: Request
): Promise<string> => {
  if (!response) return '';
  const _responseBody = await (responseType !== 'blob' ? response : parseResponseBlob(response));
  return stringifyData(_responseBody || '');
};

export const parseResponseBlob = async (response: Blob) => {
  const blobReader = new BlobFileReader();
  blobReader.readAsText(response);

  return await new Promise<string>((resolve, reject) => {
    const handleError = () => reject(blobReader.error);

    blobReader.addEventListener('load', () => {
      resolve(blobReader.result);
    });
    blobReader.addEventListener('error', handleError);
    blobReader.addEventListener('abort', handleError);
  });
};

export class RNRequest implements ILog {
  _id: number = -1;
  type: LogType = 'RNR';
  startTime: number = Date.now();
  readyState: number = 0;
  url: string = '';
  method: string = '';
  status: number = -1;
  endTime: number = 0;
  timeout?: number;
  dataSent?: string;
  requestHeaders?: any;
  responseHeaders?: any;
  responseContentType?: string;
  responseSize?: number;
  responseType?: string;
  responseURL?: string;
  response?: any = '';

  constructor(attributes: any) {
    Object.assign(this, attributes);
  }
}

export default RNRequest;
