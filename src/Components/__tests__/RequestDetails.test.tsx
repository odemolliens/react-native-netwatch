import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { RequestDetails, IProps } from '../RequestDetails';
import { RNRequest } from '../../Core/Objects/RNRequest';
import { NRequest } from '../../Core/Objects/NRequest';
import Clipboard from '@react-native-clipboard/clipboard';
import ClipboardButton from '../ClipboardButton';

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

describe('Status test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onPressViewMoreRequest = jest.fn();
  const onPressViewMoreResponse = jest.fn();
  const setSnackBarMessage = jest.fn();
  const setSnackBarVisibility = jest.fn();

  it('should render request', () => {
    givenProps(mockRequest);
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

  it('should copy to clipboard', () => {
    givenProps(mockRequest);
    givenComponent();
    component.find(ClipboardButton).first().simulate('press');
    expect(Clipboard.setString).toHaveBeenCalledTimes(1);
  });

  it('should render NRequest properly', () => {
    givenProps(mockRequestwithFailed);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly with request with headers', () => {
    givenProps(mockRequestwithWarning);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<RequestDetails {...props} />);
  }

  function givenProps(item: RNRequest) {
    props = {
      item,
      onPressViewMoreRequest,
      onPressViewMoreResponse,
      setSnackBarMessage,
      setSnackBarVisibility,
    };
  }

  const mockRequest: RNRequest = new RNRequest({
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
});
