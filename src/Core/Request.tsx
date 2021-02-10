import { IRequest } from '../types';
//@ts-ignore
import BlobFileReader from 'react-native/Libraries/Blob/FileReader';

export const stringifyData = (data: any) => {
  try {
    return JSON.stringify(JSON.parse(data), null, 2);
  } catch (e) {
    return `${data}`;
  }
};

export const getRequestBody = (dataSent: any) => {
  return stringifyData(dataSent || '');
};

export const getResponseBody = async (responseType: string, response?: IRequest): Promise<string> => {
  if (!response) return '';
  const _responseBody = await (responseType !== 'blob'
    ? response
    : parseResponseBlob(response));
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

export class Request implements IRequest {
  _id: number = -1;
  readyState: number = 0;
  url: string = '';
  method: string = '';
  status: number = -1;
  startTime: number = Date.now();
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

export default Request;
