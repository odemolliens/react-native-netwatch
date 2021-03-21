import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Status, IProps } from '../Status';
import ReduxAction from '../../Core/Objects/ReduxAction';
import RNRequest from '../../Core/Objects/RNRequest';

describe('Status test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;

  it('should render properly redux action', () => {
    givenProps(mockAction);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly request', () => {
    givenProps(mockRequest);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly request with method', () => {
    givenProps(mockRequestWithMethod);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly request with method post and warning', () => {
    givenProps(mockRequestWithMethodPostWarning);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly request with method post and failed', () => {
    givenProps(mockRequestWithMethodPostFailed);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<Status {...props} />);
  }

  function givenProps(item: ReduxAction | RNRequest) {
    props = {
      item,
      text: 'text',
      subText: 'subText',
    };
  }

  const mockAction: ReduxAction = new ReduxAction({
    _id: 73,
    startTime: 100,
    type: 'REDUX',
    action: { type: '__ERROR:UNDEFINED__', action: '' },
  });

  const mockRequest: any = {
    _id: 73,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    readyState: 4,
    response: 'response',
    responseContentType: 'application/json',
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    timeout: 0,
    type: 'RNR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  };

  const mockRequestWithMethod: RNRequest = new RNRequest({
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
  });

  const mockRequestWithMethodPostWarning: RNRequest = new RNRequest({
    _id: 73,
    dataSent: 'dataSent',
    endTime: 1613477575757,
    method: 'POST',
    readyState: 4,
    response: 'response',
    responseContentType: 'application/json',
    responseSize: 0,
    responseType: 'blob',
    responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    startTime: 1613477574742,
    status: 302,
    timeout: 0,
    type: 'RNR',
    url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  });
});

const mockRequestWithMethodPostFailed: RNRequest = new RNRequest({
  _id: 73,
  dataSent: 'dataSent',
  endTime: 1613477575757,
  method: 'POST',
  readyState: 4,
  response: 'response',
  responseContentType: 'application/json',
  responseSize: 0,
  responseType: 'blob',
  responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
  startTime: 1613477574742,
  timeout: 0,
  type: 'RNR',
  url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
});

