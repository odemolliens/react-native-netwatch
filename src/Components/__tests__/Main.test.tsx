import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Main, IProps } from '../Main';
import ReduxAction from '../../Core/Objects/ReduxAction';
import { RNRequest } from '../../Core/Objects/RNRequest';
import { EnumFilterType, EnumSourceType } from '../../types';
import NRequest from '../../Core/Objects/NRequest';
import { Alert } from 'react-native';
import Share from 'react-native-share';

describe('Main test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  let useEffect;
  let mockUseEffect;
  const setSource = jest.fn();
  const setFilter = jest.fn();
  const setSearchQuery = jest.fn();
  const setRequests = jest.fn();
  const setSettingsVisible = jest.fn();
  const setDeleteVisible = jest.fn();
  const setLoadingXLSX = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    useEffect = jest.spyOn(React, 'useEffect');
    mockUseEffect = () => {
      useEffect.mockImplementationOnce(f => f());
    };

    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: jest.fn(),
    }));
  });

  describe('Tests source', () => {
    it('should render properly', () => {
      component = shallow(<Main {...props} />);
      expect(component).toMatchSnapshot();
    });

    it('should run set source React native Request', () => {
      const useStateMock: any = (source: any) => [EnumSourceType.ReactNativeRequest, setSource];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setSource).toHaveBeenCalledTimes(1);
    });

    it('should run set source Redux', () => {
      const useStateMock: any = (source: any) => [EnumSourceType.Redux, setSource];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setSource).toHaveBeenCalledTimes(2);
    });

    it('should run set source Native Request', () => {
      const useStateMock: any = (source: any) => [EnumSourceType.Nativerequest, setSource];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setSource).toHaveBeenCalledTimes(1);
    });

    it('should run set source All', () => {
      const useStateMock: any = (source: any) => [EnumSourceType.All, setSource];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setSource).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tests filter', () => {
    it('should run set filter All', () => {
      const useStateMock: any = (source: any) => [EnumFilterType.All, setFilter];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setFilter).toHaveBeenCalledTimes(1);
    });

    it('should run set filter Get', () => {
      const useStateMock: any = (source: any) => [EnumFilterType.Get, setFilter];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tests search', () => {
    it('should run set search', () => {
      const useStateMock: any = (source: any) => ['200', setSearchQuery];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setSearchQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tests requests', () => {
    it('should run set requests', () => {
      const useStateMock: any = (source: any) => [[], setRequests];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setRequests).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tests share XLSX', () => {
    it('should run set loadingXLSX', () => {
      jest.spyOn(Share, 'open');
      const useStateMock: any = (loadingXLSX: any) => [true, setLoadingXLSX];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      mockUseEffect();
      givenProps();
      givenComponent();
      expect(setLoadingXLSX).toHaveBeenCalledTimes(1);
      // expect(Share.open).toHaveBeenCalledTimes(1);
    });
  });

  it('should render properly and showSettings', () => {
    const useStateMock: any = (settingsVisible: any) => [settingsVisible, setSettingsVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
    whenPressingButton('showSettingsButton');
    expect(setSettingsVisible).toHaveBeenCalledTimes(1);
    expect(setSettingsVisible).toHaveBeenCalledWith(true);
  });

  it('should render properly and delete list', () => {
    const useStateMock: any = (deleteVisible: any) => [deleteVisible, setDeleteVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    const spyAlert = jest.spyOn(Alert, 'alert');
    givenProps();
    givenComponent();
    // component = shallow(
    //   <Main reduxActions={mockActions} rnRequests={mockRNRequests} nRequests={mockNRequests} {...props} />,
    // );
    component.find(`[testID="itemsList"]`).props().keyExtractor({ _id: 73 });
    component.find(`[testID="itemsList"]`).props().getItemLayout({ _data: null, index: 73 });
    component.find(`[testID="itemsList"]`).props().renderItem({ item: mockActions[0], index: 73 });
    // expect(component.find('FlatList').prop('data')).not.toStrictEqual([])

    component.find('[testID="deleteListButton"]').simulate('press');
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    // Press cancel button
    // @ts-ignore
    spyAlert.mock.calls[0][2][0].onPress();

    component.find('[testID="deleteListButton"]').simulate('press');
    expect(Alert.alert).toHaveBeenCalledTimes(2);
    // Press ok button
    // @ts-ignore
    spyAlert.mock.calls[0][2][1].onPress();

    expect(props.clearAll).toHaveBeenCalledTimes(1);
  });

  it('should render properly and close', () => {
    // To close Netwatch, settingsVisible must be false, if not, press x will close settings screen and not Netwatch
    const useStateMock: any = (settingsVisible: any) => [false, setSettingsVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps();
    givenComponent();
    component.find('[name="x"]').simulate('press');
    expect(props.onPressClose).toHaveBeenCalledTimes(1);
    expect(props.onPressClose).toHaveBeenCalledWith(false);
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
      testId: 'mainScreen',
      onPress: jest.fn(),
      onPressClose: jest.fn(),
      onPressDetail: jest.fn(),
      reduxActions: mockActions,
      rnRequests: mockRNRequests,
      nRequests: mockNRequests,
      clearAll: jest.fn(),
      maxRequests: 50,
    };
  }
});

const mockActions: ReduxAction[] = [
  new ReduxAction({
    _id: 73,
    startTime: 100,
    type: 'REDUX',
    stringifiedAction: "{ type: '__ERROR:UNDEFINED__', payload: '' }",
    action: { type: '__ERROR:UNDEFINED__', payload: '' },
  }),
];

const mockRNRequests: RNRequest[] = [
  new RNRequest({
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
  }),
];

const mockNRequests: NRequest[] = [
  new NRequest({
    _id: 75,
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
  }),
];
