import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Item, IProps } from '../Item';
import ReduxAction from '../../Core/Objects/ReduxAction';
import { RNRequest } from '../../Core/Objects/RNRequest';
import { NRequest } from '../../Core/Objects/NRequest';

describe('Item test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onPress = jest.fn();

  it('should render Request properly', () => {
    givenProps(mockRequest);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render Native Request properly', () => {
    givenProps(mockNativeRequest);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render Request properly even no URL passed in the request to avoid crash', () => {
    givenProps(mockIncompletedRequest);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render Request properly even bad URL passed in the request to avoid crash', () => {
    givenProps(mockNullURLRequest);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render Action properly', () => {
    givenProps(mockAction);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly & press item', () => {
    givenProps(mockRequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('itemTouchable-73');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<Item {...props} />);
  }

  function givenProps(mockedElement) {
    props = {
      onPress,
      item: mockedElement,
      color: 'red',
    };
  }

  // UTILITIES

  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  const mockAction: ReduxAction = new ReduxAction({
    _id: 73,
    startTime: 100,
    type: 'REDUX',
    action: { type: '__ERROR:UNDEFINED__', action: '' },
  });

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

  const mockNativeRequest: NRequest = new NRequest({
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

  //@ts-ignore
  const mockIncompletedRequest: RNRequest = new RNRequest({
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
  });

  const mockNullURLRequest: RNRequest = new RNRequest({
    _id: 73,
    url: null,
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
  });
});
