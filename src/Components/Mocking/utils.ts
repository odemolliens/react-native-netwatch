import RNFS from 'react-native-fs';

export const FILE_PATH = RNFS.DocumentDirectoryPath + 'Netwatch.mockResponses.35435664445664';

export const mockResponses: MockResponse[] = [];

export interface MockResponse {
  url: string;
  method?: string;
  response?: string;
  headers?: string;
  statusCode?: number;
  timeout?: number;
  active?: boolean;
  date?: number;
}

export function getMockResponses() {
  return mockResponses;
}

export function clearMockResponses() {
  mockResponses.length = 0;
  RNFS.unlink(FILE_PATH);
}

export function resetMockResponses(responses: string) {
  clearMockResponses();
  mockResponses.push(...JSON.parse(responses));
  RNFS.writeFile(FILE_PATH, responses, 'utf8');
}

export function mockRequestWithResponse(mockResponse: MockResponse) {
  let found = false;
  for (let i = 0; i < mockResponses.length; i++) {
    if (mockResponses[i].url === mockResponse.url && mockResponses[i].method === mockResponse.method) {
      mockResponses[i] = {
        ...mockResponse,
        active: true,
      };
      found = true;
      break;
    }
  }
  if (!found) {
    mockResponses.push({
      ...mockResponse,
      active: true,
    });
  }
  RNFS.writeFile(FILE_PATH, JSON.stringify(mockResponses), 'utf8');
}

let originalSend: any;

export function extractURL(url: string) {
  const urlParts = url.split('?');
  return urlParts[0];
}

// istanbul ignore next
export function setupMocks() {
  RNFS.readFile(FILE_PATH, 'utf8')
    .then((mockResponsesString: string) => {
      mockResponses.push(...(JSON.parse(mockResponsesString || '[]') as MockResponse[]));
    })
    .catch(() => console.log('No mock responses found'));
  if (originalSend) {
    console.log('mockResponses already setup');
    return;
  }
  originalSend = XMLHttpRequest.prototype.send;
  try {
    XMLHttpRequest.prototype.send = function (body: any) {
      // @ts-ignore
      const mockRequest = mockResponses.find(mock => {
        // @ts-ignore
        try {
          return (
            mock.active &&
            // @ts-ignore
            mock.url === extractURL(this._url) &&
            // @ts-ignore
            (!mock._method || (mock.method && mock._method === this._method))
          );
        } catch (e) {
          return false;
        }
      });

      if (mockRequest) {
        Object.defineProperty(this, 'response', { writable: true });
        Object.defineProperty(this, 'responseText', { writable: true });
        if (mockRequest.timeout) {
          new Promise(resolve => setTimeout(resolve, (mockRequest.timeout || 0) * 1000)).then(() => {
            this?.ontimeout?.({} as any);
          });
          return;
        }
        const originalOnReadyStateChange = this.onreadystatechange;
        this.onreadystatechange = args => {
          try {
            if (mockRequest.response && this.readyState === 4) {
              // We rewrite the response if it is defined
              // @ts-ignore
              this.responseText = mockRequest.response;
              // @ts-ignore
              this.response = mockRequest.response;
            }
            if (mockRequest.statusCode) {
              // We rewrite the status code if it is defined
              // @ts-ignore
              this.status = mockRequest.statusCode;
            }
          } catch (e) {
            console.error(e);
          }
          originalOnReadyStateChange?.apply(this, [args]);
        };
      }
      originalSend.apply(this, [body]);
    };
  } catch (e) {
    console.error(e);
  }
}
