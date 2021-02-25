import NRequest from '../NRequest';

describe('NRequest', () => {
  it('should return a NRequest', () => {
    const _NRequest = new NRequest(mockRequestWithMethod)
    expect(_NRequest).toBeInstanceOf(NRequest);
  });

  it('should NOT return a NRequest', () => {
    // Cause we don't use NRequest constructor explicitly
    expect(mockRequestWithMethod).not.toBeInstanceOf(NRequest);
  });
});

const mockRequestWithMethod: NRequest = {
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
