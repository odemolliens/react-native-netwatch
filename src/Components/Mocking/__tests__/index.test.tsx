import * as React from 'react';
import { MockingNavigator } from '../index';
import { shallow, ShallowWrapper } from 'enzyme';
import { MockList } from '../MockList';
import { useState } from 'react';
import { EditMockResponse } from '../EditMockResponse';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: (f: () => void) => f(),
}));

describe('Test Mock navigator Screen', () => {
  let component: ShallowWrapper;
  const onPressBack = jest.fn();
  const setShowList = jest.fn();
  const setShowEdit = jest.fn();
  const setUpdate = jest.fn();
  const setMockResponse = jest.fn();
  const mockResponse = {
    url: 'https://www.google.com',
    method: 'GET',
    headers: '',
    response: '',
    statusCode: 0,
    timeout: 0,
    active: true,
    date: 0,
  };

  it('should render mock list properly', () => {
    givenShowMockList();
    component = shallow(<MockingNavigator onPressBack={() => jest.fn()} update={false} />);
    expect(component).toMatchSnapshot(component);
  });

  it('should render Edit mock screen properly', () => {
    givenShowEditMockResponse();
    component = shallow(<MockingNavigator mockResponse={mockResponse} onPressBack={onPressBack} update={false} />);
    expect(component).toMatchSnapshot(component);
  });

  it('should close Mock navigator when pressing cross button', () => {
    givenShowMockList();
    component = shallow(<MockingNavigator onPressBack={onPressBack} update={false} />);
    component.find(MockList).at(0).simulate('pressBack');
    expect(onPressBack).toHaveBeenCalled();
  });

  it('should show Edit Mock Response screen', function () {
    givenShowMockList();
    component = shallow(<MockingNavigator onPressBack={() => jest.fn()} update={false} />);
    component.find(MockList).at(0).props().showEdit(mockResponse, true);
    expect(setShowList).toHaveBeenCalledWith(false);
    expect(setShowEdit).toHaveBeenCalledWith(true);
    expect(setMockResponse).toHaveBeenCalledWith(mockResponse);
    expect(setUpdate).toHaveBeenCalledWith(true);
  });

  it('should show List screen when closing cross button on edit mock response screen', function () {
    givenShowEditMockResponse();
    component = shallow(<MockingNavigator onPressBack={onPressBack} update={false} />);
    component.find(EditMockResponse).simulate('pressBack');
    expect(setShowList).toHaveBeenCalledWith(true);
    expect(setShowEdit).toHaveBeenCalledWith(false);
  });

  function givenShowMockList() {
    (useState as jest.Mock).mockReturnValueOnce([true, setShowList]);
    (useState as jest.Mock).mockReturnValueOnce([false, setShowEdit]);
    (useState as jest.Mock).mockReturnValueOnce([mockResponse, setMockResponse]);
    (useState as jest.Mock).mockReturnValueOnce([false, setUpdate]);
  }

  function givenShowEditMockResponse() {
    (useState as jest.Mock).mockReturnValueOnce([false, setShowList]);
    (useState as jest.Mock).mockReturnValueOnce([true, setShowEdit]);
    (useState as jest.Mock).mockReturnValueOnce([mockResponse, setMockResponse]);
    (useState as jest.Mock).mockReturnValueOnce([false, setUpdate]);
  }
});
