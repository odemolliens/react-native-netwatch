import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Details, IProps } from '../Details';
import { RNRequest } from '../../Core/Objects/RNRequest';

describe('Details test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const back = jest.fn();

  it('should render properly', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly with request without headers & press backbutton', () => {
    givenProps(mockRequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('buttonBackToMainScreen');
    expect(back).toHaveBeenCalledTimes(1);
  });

  it('should render properly with request with headers', () => {
    givenProps(mockRequestWithHeaders);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<Details {...props} />);
  }

  function givenProps(item?: RNRequest) {
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

  const mockRequest: RNRequest = {
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

  const mockRequestWithHeaders: RNRequest = {
    _id: 73,
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
  };
});
