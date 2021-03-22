import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Details, IProps } from '../Details';
import { RNRequest } from '../../Core/Objects/RNRequest';
import { NRequest } from '../../Core/Objects/NRequest';
import { ReduxAction } from '../../Core/Objects/ReduxAction';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

describe('Details test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const back = jest.fn();
  const setShowJSONResponseDetails = jest.fn();
  const setShowJSONRequestDetails = jest.fn();
  const setShowJSONActionDetails = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: jest.fn(),
    }));
  });

  describe('Test Redux item', () => {
    it('should render Redux action properly', () => {
      givenProps(mockActionWithLongPayload);
      givenComponent();
      expect(component).toMatchSnapshot();
    });

    it('should share actions', () => {
      givenProps(mockAction);
      givenComponent();
      component.find(`[testID="buttonShare"]`).simulate('press');
      expect(Share.open).toHaveBeenCalledTimes(1);
    });

    it('should called setShowJSONActionDetails', () => {
      const useStateMock: any = (showJSONActionDetails: any) => [showJSONActionDetails, setShowJSONActionDetails];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      givenProps(mockActionWithLongPayload);
      givenComponent();
      component.find(`[testID="buttonViewMore"]`).simulate('press');
      component.update();
      expect(setShowJSONActionDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test Request item', () => {
    it('should render Request properly', () => {
      givenProps(mockNRequestWithLongBody);
      givenComponent();
      expect(component).toMatchSnapshot();
    });

    it('should copy to clipboard', () => {
      givenProps(mockRequest);
      givenComponent();
      component.find(`[testID="buttonCopyToClipboard"]`).first().simulate('press');
      expect(Clipboard.setString).toHaveBeenCalledTimes(1);
    });

    it('should share requests', () => {
      givenProps(mockRequestWithHeaders);
      givenComponent();
      component.find(`[testID="buttonShare"]`).simulate('press');
      expect(Share.open).toHaveBeenCalledTimes(1);
    });

    it('should render properly with request with headers', () => {
      givenProps(mockRequestwithWarning);
      givenComponent();
      expect(component).toMatchSnapshot();
    });

    it('should render properly with request with image', () => {
      givenProps(mockRequestwithImage);
      givenComponent();
      expect(component).toMatchSnapshot();
    });

    it('should render properly with request with image', () => {
      givenProps(mockRequestwithImageError);
      givenComponent();
      expect(component).toMatchSnapshot();
    });

    it('should render properly with request without headers & press backbutton', () => {
      givenProps(mockRequestwithFailed);
      givenComponent();
      expect(component).toMatchSnapshot();
      whenPressingButton('buttonBackToMainScreen');
      expect(back).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tests useState Action', () => {
    it('should show JSON Details screen with actions', () => {
      const useStateMock: any = (showJSONActionDetails: any) => [true, setShowJSONActionDetails];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      givenProps(mockActionWithLongPayload);
      givenComponent();
      expect(component).toMatchInlineSnapshot(`
        <JSONDetails
          data={
            Object {
              "payload": "{\\"data\\":\\"This is a test with a long payload, more than 100\\",\\"next\\":\\"characters to check if the viewmore button appears correctly.\\",\\"explain\\":\\"In fact, we need to have at least 100 characters to show this button\\",\\"and\\":\\" test if we can press the button\\"}",
              "type": "__ERROR:UNDEFINED__",
            }
          }
          onPressBack={[Function]}
          title="Response details"
        />
      `);
    });
  });

  describe('Tests useState Request', () => {
    it('should called setShowJSONResponseDetails', () => {
      const useStateMock: any = (showJSONResponseDetails: any) => [showJSONResponseDetails, setShowJSONResponseDetails];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      givenProps(mockRequestWithLongResponse);
      givenComponent();
      component.find(`[testID="buttonViewMore"]`).last().simulate('press');
      expect(setShowJSONResponseDetails).toHaveBeenCalledTimes(1);
    });

    it('should show JSON Details screen with response', () => {
      const useStateMock: any = (showJSONResponseDetails: any) => [true, setShowJSONResponseDetails];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      givenProps(mockRequestWithLongResponse);
      givenComponent();
      expect(component).toMatchInlineSnapshot(`
        <JSONDetails
          data="{\\"data\\":\\"This is a test with a long response, more than 100\\",\\"next\\":\\"characters to check if the viewmore button appears correctly.\\",\\"explain\\":\\"In fact, we need to have at least 100 characters to show this button\\",\\"and\\":\\" test if we can press the button\\"}"
          onPressBack={[Function]}
          title="Response details"
        />
      `);
    });
    it('should called setShowJSONRequestDetails', () => {
      const useStateMock: any = (showJSONRequestDetails: any) => [showJSONRequestDetails, setShowJSONRequestDetails];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      givenProps(mockNRequestWithLongBody);
      givenComponent();
      component.find(`[testID="buttonViewMore"]`).first().simulate('press');
      expect(setShowJSONRequestDetails).toHaveBeenCalledTimes(1);
    });
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<Details {...props} />);
  }

  function givenProps(item?: RNRequest | ReduxAction) {
    props = {
      testId: 'testId',
      onPressBack: back,
      item,
    };
  }

  // UTILITIES

  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  const mockAction: ReduxAction = new ReduxAction({
    _id: 73,
    startTime: 100,
    stringifiedAction: "{ type: '__ERROR:UNDEFINED__', payload: '' }",
    type: 'REDUX',
    action: { type: '__ERROR:UNDEFINED__', payload: '' },
  });

  const mockActionWithLongPayload: ReduxAction = new ReduxAction({
    _id: 73,
    startTime: 100,
    stringifiedAction: "{ type: '__ERROR:UNDEFINED__', payload: '' }",
    type: 'REDUX',
    action: {
      type: '__ERROR:UNDEFINED__',
      payload: JSON.stringify({
        data: 'This is a test with a long payload, more than 100',
        next: 'characters to check if the viewmore button appears correctly.',
        explain: 'In fact, we need to have at least 100 characters to show this button',
        and: ' test if we can press the button',
      }),
    },
  });

  const mockRequest: RNRequest = new RNRequest({
    _id: 74,
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
  });

  const mockRequestWithHeaders: RNRequest = new RNRequest({
    _id: 75,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    method: 'GET',
    readyState: 4,
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    response: 'response',
    responseContentType: 'application/json',
    responseHeaders: {
      'Content-Length': '0',
      'Content-Type': 'application/json; charset=UTF-8',
      Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
      'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
    },
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    status: 200,
    timeout: 0,
    type: 'RNR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  });

  const mockRequestwithWarning: NRequest = new NRequest({
    _id: 76,
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
    status: 301,
    timeout: 0,
    type: 'NR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  });

  const mockRequestwithFailed: NRequest = new NRequest({
    _id: 76,
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
    status: 500,
    timeout: 0,
    type: 'NR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  });

  const mockRequestwithImage: NRequest = new NRequest({
    _id: 76,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    method: 'GET',
    readyState: 4,
    response: 'response',
    responseContentType: 'application/json',
    responseSize: 0,
    responseType: 'blob',
    responseURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
    startTime: 1613477574742,
    status: 200,
    timeout: 0,
    type: 'NR',
    url:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
  });

  const mockRequestwithImageError: NRequest = new NRequest({
    _id: 76,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    method: 'GET',
    readyState: 4,
    response: 'response',
    responseContentType: 'application/json',
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'data:image/png;base64,',
    startTime: 1613477574742,
    status: 200,
    timeout: 0,
    type: 'NR',
    url: 'data:image/png;-,',
  });

  const mockNRequestWithLongBody: NRequest = new NRequest({
    _id: 75,
    dataSent: JSON.stringify({
      data: 'This is a test with a long body, more than 100',
      next: 'characters to check if the viewmore button appears correctly.',
      explain: 'In fact, we need to have at least 100 characters to show this button',
      and: ' test if we can press the button',
    }),
    endTime: 1613477575757,
    method: 'GET',
    readyState: 4,
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    response: 'response',
    responseContentType: 'application/json',
    responseHeaders: {
      'Content-Length': '0',
      'Content-Type': 'application/json; charset=UTF-8',
      Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
      'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
    },
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    status: 200,
    timeout: 0,
    type: 'RNR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  });

  const mockRequestWithLongResponse: RNRequest = new RNRequest({
    _id: 75,
    dataSent: 'body',
    endTime: 1613477575757,
    method: 'GET',
    readyState: 4,
    requestHeaders: {
      'Content-Type': 'application/json',
    },
    response: JSON.stringify({
      data: 'This is a test with a long response, more than 100',
      next: 'characters to check if the viewmore button appears correctly.',
      explain: 'In fact, we need to have at least 100 characters to show this button',
      and: ' test if we can press the button',
    }),
    responseContentType: 'application/json',
    responseHeaders: {
      'Content-Length': '0',
      'Content-Type': 'application/json; charset=UTF-8',
      Date: 'Tue, 16 Feb 2021 12:12:55 GMT',
      'Sozu-Id': '51989c0c-ebe7-4574-913d-443477875da7',
    },
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    status: 200,
    timeout: 0,
    type: 'RNR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  });
});
