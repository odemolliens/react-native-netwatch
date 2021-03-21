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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Redux item', () => {
    it('should render Redux action properly', () => {
      givenProps(mockAction);
      givenComponent();
      expect(component).toMatchSnapshot();
    });

    it('should share actions', () => {
      givenProps(mockAction);
      givenComponent();
      component.find(`[testID="buttonShare"]`).simulate('press');
      expect(Share.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test Request item', () => {
    it('should render Request properly', () => {
      givenProps(mockRequest);
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
    action: { type: '__ERROR:UNDEFINED__', action: '' },
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
    responseURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
    startTime: 1613477574742,
    status: 200,
    timeout: 0,
    type: 'NR',
    url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
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
});
