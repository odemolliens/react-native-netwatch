import {
  clearMockResponses,
  extractURL,
  FILE_PATH,
  getMockResponses,
  mockRequestWithResponse,
  resetMockResponses,
  setupMocks,
} from '../utils';
import RNFS from 'react-native-fs';

jest.mock('react-native-fs', () => ({
  writeFile: jest.fn(),
  unlink: jest.fn(),
  readFile: jest.fn(),
}));

describe('Test utils module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    global.XMLHttpRequest = jest.fn().mockImplementation(() => ({
      prototype: {},
    }));
  });

  it('should clear and set mock responses and write to file', async () => {
    const responses = '[{"id": 1, "message": "Test response"}]';
    await resetMockResponses(responses);
    expect(getMockResponses().length).toEqual(1);
    expect(RNFS.writeFile).toHaveBeenCalledWith(FILE_PATH, responses, 'utf8');
  });

  it('should clear mock responses and delete file', () => {
    clearMockResponses();
    expect(getMockResponses().length).toEqual(0);
    expect(RNFS.unlink).toHaveBeenCalledWith(FILE_PATH);
  });

  it('should update existing mock response and write to file', async () => {
    // Given
    const existingMockResponse = {
      url: 'https://api.example.com/test',
      method: 'GET',
      response: 'Existing response',
      date: 1000,
    };
    const updatedMockResponse = {
      url: 'https://api.example.com/test',
      method: 'GET',
      response: 'Updated response',
      date: 1001,
    };
    await mockRequestWithResponse(existingMockResponse);

    // When
    await mockRequestWithResponse(updatedMockResponse);

    // Then
    expect(getMockResponses()[0]).toEqual({ ...updatedMockResponse, date: 1001 });
    expect(RNFS.writeFile).toHaveBeenCalledWith(FILE_PATH, JSON.stringify(getMockResponses()), 'utf8');
  });

  it('should add new mock response and write to file', async () => {
    // Given
    const newMockResponse = {
      url: 'https://api.example.com/test',
      method: 'GET',
      response: 'New response',
      date: 1000,
    };

    // When
    await mockRequestWithResponse(newMockResponse);

    // Then
    expect(getMockResponses()[0]).toEqual({ ...newMockResponse, date: 1000 });
    expect(RNFS.writeFile).toHaveBeenCalledWith(FILE_PATH, JSON.stringify(getMockResponses()), 'utf8');
  });

  it('should return the URL without query parameters', () => {
    // Given
    const urlWithQuery = 'https://api.example.com/test?param1=value1&param2=value2';

    // When
    const extractedURL = extractURL(urlWithQuery);

    // Then
    expect(extractedURL).toEqual('https://api.example.com/test');
  });

  it('should return the same URL when there are no query parameters', () => {
    // Given
    const urlWithoutQuery = 'https://api.example.com/test';

    // When
    const extractedURL = extractURL(urlWithoutQuery);

    // Then
    expect(extractedURL).toEqual('https://api.example.com/test');
  });

  it('should setup mock responses and XMLHttpRequest.prototype.send', async () => {
    // Given
    const mockResponseString =
      '[{"url": "https://api.example.com/test", "method": "GET", "response": "Test response"}]';
    (RNFS.readFile as jest.Mock).mockResolvedValue(mockResponseString);

    // When
    await setupMocks();

    // Then
    expect(XMLHttpRequest.prototype.send).toBeDefined();
  });
});
