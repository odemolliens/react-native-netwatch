import React, { useState } from 'react';
import { EditMockResponse } from '../EditMockResponse';
import { getMockResponses, mockRequestWithResponse, MockResponse } from '../utils';
import { shallow, ShallowWrapper } from 'enzyme';
import { NavBar } from '../../NavBar';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: (f: () => void) => f(),
}));

describe('Test Edit Mock Response Screen', () => {
  let component: ShallowWrapper;
  const mockResponse: MockResponse = {
    url: 'https://www.google.com',
    method: 'GET',
    headers: '',
    response: '',
    statusCode: 0,
    timeout: 0,
    active: true,
  };

  it('should render properly', () => {
    givenMockResponse();
    component = shallow(<EditMockResponse mockResponse={mockResponse} onPressBack={() => {}} update={false} />);
    expect(component).toMatchSnapshot();
  });

  it('should render properly when updating mock', () => {
    givenMockResponse();
    component = shallow(<EditMockResponse mockResponse={mockResponse} onPressBack={() => {}} update={true} />);
    expect(component).toMatchSnapshot();
  });

  it('should save mock response when pressing save button', function () {
    givenMockResponse();
    component = shallow(<EditMockResponse mockResponse={mockResponse} onPressBack={() => {}} update={false} />);
    // @ts-ignore
    component.find(NavBar).props().rightComponent?.props.onPress();
    expect(getMockResponses()[0]).toEqual(expect.objectContaining(mockResponse));
  });

  function givenMockResponse() {
    (useState as jest.Mock).mockReturnValueOnce([mockResponse.url, jest.fn()]);
    (useState as jest.Mock).mockReturnValueOnce([mockResponse.method, jest.fn()]);
    (useState as jest.Mock).mockReturnValueOnce([mockResponse.headers, jest.fn()]);
    (useState as jest.Mock).mockReturnValueOnce([mockResponse.response, jest.fn()]);
    (useState as jest.Mock).mockReturnValueOnce([mockResponse.statusCode, jest.fn()]);
    (useState as jest.Mock).mockReturnValueOnce([mockResponse.active, jest.fn()]);
    (useState as jest.Mock).mockReturnValueOnce([mockResponse.timeout, jest.fn()]);
  }
});
