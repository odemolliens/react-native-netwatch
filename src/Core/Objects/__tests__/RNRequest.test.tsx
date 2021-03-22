import RNRequest, { getRequestBody, getResponseBody, parseResponseBlob } from '../RNRequest';
// import Blob from 'react-native/Libraries/Blob/FileReader';
import Blob from 'react-native/Libraries/Blob/Blob';

jest.mock('react-native/Libraries/Blob/Blob');

jest.mock('react-native/Libraries/Blob/FileReader', () =>
  jest.fn().mockImplementation(() => ({
    readAsText: jest.fn(),
    onload: jest.fn(),
    onabort: jest.fn(),
    onerror: jest.fn(),
  })),
);

describe('getRequestBody', () => {
  it('should return stringified data in consistent format', () => {
    mockRequestWithMethod.dataSent = '{"data":    {"a":   1   }}';
    const result = getRequestBody(mockRequestWithMethod.dataSent);
    expect(typeof result).toBe('string');
    expect(result).toMatchInlineSnapshot(`
        "{
          \\"data\\": {
            \\"a\\": 1
          }
        }"
      `);
  });

  it('should return original object as string if stringify fails', () => {
    // @ts-ignore
    mockRequestWithMethod.dataSent = { test: 1 };
    const result = getRequestBody(mockRequestWithMethod.dataSent);
    expect(typeof result).toBe('string');
    expect(result).toEqual('[object Object]');
  });

  it('should process formData', () => {
    const mockFormData = {
      _parts: [
        ['test', 'hello'],
        ['another', 'goodbye'],
      ],
    };
    // @ts-ignore
    mockRequestWithMethod.dataSent = mockFormData;
    const result = getRequestBody(mockRequestWithMethod.dataSent);
    expect(typeof result).toBe('string');
    expect(result).toMatchInlineSnapshot(`
        "{
          \\"test\\": \\"hello\\",
          \\"another\\": \\"goodbye\\"
        }"
      `);
  });
});

describe('getResponseBody', () => {
  it('should return empty string if no response', async () => {
    mockRequestWithMethod.response = undefined;
    const result = await getResponseBody(mockRequestWithMethod.response);
    expect(result).toMatchInlineSnapshot(`""`);
  });
  it('should return response directly if it is a string', async () => {
    const _data = 'response is a string';
    mockRequestWithMethod.response = _data;
    const result = await getResponseBody('string', mockRequestWithMethod.response);
    expect(result).toMatchInlineSnapshot(`"response is a string"`);
  });
});

const mockRequestWithMethod: RNRequest = {
  _id: 73,
  dataSent: 'dataSent',
  endTime: 1613477575757,
  method: 'GET',
  readyState: 4,
  response: 'response',
  responseContentType: 'application/json',
  responseSize: 0,
  responseType: 'blob',
  responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  startTime: 1613477574742,
  status: 200,
  timeout: 0,
  type: 'RNR',
  url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
};
