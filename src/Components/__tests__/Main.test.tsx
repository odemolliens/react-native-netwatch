import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Main, IProps } from '../Main';
import ReduxAction from '../../Core/Objects/ReduxAction';
import { RNRequest } from '../../Core/Objects/RNRequest';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Main test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onPress = jest.fn();
  const onPressClose = jest.fn();
  const onPressDetail = jest.fn();
  const clearAll = jest.fn();
  const setRequests = jest.fn();
  const setSearchQuery = jest.fn();
  const setSource = jest.fn();
  const setFilter = jest.fn();
  const setSettingsVisible = jest.fn();
  const setDeleteVisible = jest.fn();

  jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
  }));

  it('should render properly', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly and showSettings', () => {
    const useStateMock: any = (source: any) => [source, setSettingsVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
    whenPressingButton('showSettingsButton');
    expect(setSettingsVisible).toHaveBeenCalledTimes(1);
    expect(setSettingsVisible).toHaveBeenCalledWith(true);
  });

  it('should render properly and delete list', () => {
    const useStateMock: any = (source: any) => [source, setDeleteVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
    whenPressingButton('showSettingsButton');
    expect(setDeleteVisible).toHaveBeenCalledTimes(1);
    expect(setDeleteVisible).toHaveBeenCalledWith(true);
  });

  // UTILITIES
  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  // GIVEN
  function givenComponent() {
    component = shallow(<Main {...props} />);
  }

  function givenProps(visible: boolean = true) {
    props = {
      testId: 'MainScreen',
      onPress,
      onPressClose,
      onPressDetail,
      reduxActions: mockActions,
      rnRequests: mockRequests,
      nRequests: mockRequests,
      clearAll,
      maxRequests: 50,
    };
  }

  const mockActions: ReduxAction[] = [
    {
      _id: 73,
      startTime: 100,
      type: 'REDUX',
      action: { type: '__ERROR:UNDEFINED__', payload: '' },
    },
  ];

  const mockRequests: RNRequest[] = [
    {
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
    },
  ];
});
