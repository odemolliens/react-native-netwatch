import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { IProps, Netwatch } from '../index';
import { Main } from '../Components/Main';
import { Modal } from 'react-native';
import NRequest from '../Core/Objects/NRequest';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import RCTDeviceEventEmitter from 'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter';

jest.mock('../Components/Mocking/utils');
jest.mock('react-native-launch-arguments', () => ({
  value: jest.fn(),
}));

/**
 * Mock the NativeEventEmitter as a normal JS EventEmitter.
 */
class NativeEventEmitter extends EventEmitter {
  constructor() {
    super(RCTDeviceEventEmitter.sharedSubscriber);
  }
}

describe('Index test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  let useEffect;
  let mockUseEffect;
  const setVisible = jest.fn();
  const onPressClose = jest.fn();
  const setShowDetails = jest.fn();

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
      useState: jest.fn().mockReturnValue([{ value: {} }, jest.fn()]),
    }));
  });

  const globalDateConstructor = Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime());
  });

  afterAll(() => {
    global.Date.now = globalDateConstructor;
  });

  it('should render properly', () => {
    givenProps(true, true);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should call setVisible true', () => {
    const useStateMock: any = (visible: any) => [false, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true);
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    givenComponent();
    expect(setVisible).toHaveBeenCalledTimes(1);
    expect(setVisible).toHaveBeenCalledWith(true);
  });

  it('should call setVisible false', () => {
    const useStateMock: any = (visible: any) => [true, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(false, true);
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    givenComponent();
    expect(setVisible).toHaveBeenCalledTimes(1);
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it('should have Netwatch disabled', () => {
    givenProps(false, false);
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    mockUseEffect();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should have Netwatch warning if not disabledShake but onPressClose', () => {
    jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
    const nativeEmitter = new NativeEventEmitter();
    mockUseEffect();
    givenProps(false, true, 50, false, true, 'dark', onPressClose);
    mockUseEffect();
    givenComponent();
    // @ts-ignore
    nativeEmitter.emit('NetwatchShakeEvent');
    mockUseEffect();
    expect(component).toMatchSnapshot();
  });

  it('should have Netwatch with light theme', () => {
    givenProps(false, true, 50, true, true, 'light', onPressClose);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should contains the main screen with flatlist - style={{ height: "100%"}}', () => {
    givenProps(true, true);
    mockUseEffect();
    mockUseEffect();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should contains the details screen - style={{ height: "100%"}}', () => {
    const useStateMock: any = (showDetails: any) => [true, setShowDetails];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true);
    givenComponent();
    mockUseEffect();
    expect(component).toMatchSnapshot();
  });

  it('should disable netwatch', async () => {
    givenProps(false, false);
    givenComponent();
    expect(component).toEqual({});
  });

  it('should render properly visible and enabled', () => {
    givenProps(true, true);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly visible, enabled and maxRequest', () => {
    givenProps(true, true, 20);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly Main component and close main component called setVisible', () => {
    const useStateMock: any = (visible: any) => [visible, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 20);
    givenComponent();
    expect(component.find(Main)).toHaveLength(1);
    component.find(Main).invoke('onPressClose')(false);
    expect(setVisible).toHaveBeenCalledTimes(1);
  });

  it('should render properly Modal and called setVisible when back is pressed', () => {
    // Case when shake is actived
    const useStateMock: any = (visible: any) => [visible, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 20);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(2);
    component.find(Modal).at(0).invoke('onRequestClose')();
    expect(setVisible).toHaveBeenCalledTimes(1);
  });

  it('should render properly Modal and called props.onPressClose when back is pressed', () => {
    // Case when button is actived and shake desactivated
    givenProps(true, true, 20, true, true, 'dark', onPressClose);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(2);
    component.find(Modal).at(0).invoke('onRequestClose')();
    expect(props.onPressClose).toHaveBeenCalledTimes(1);
  });

  it('should render properly Modal and called setShowDetails when back is pressed', () => {
    // Case when the Details page is visible
    const useStateMock: any = (showDetails: any) => [true, setShowDetails];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 20, true, true, 'dark', onPressClose);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(2);
    component.find(Modal).at(0).invoke('onRequestClose')();
    expect(setShowDetails).toHaveBeenCalledTimes(1);
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<Netwatch {...props} />);
  }

  function givenProps(
    visible: boolean = false,
    enabled: boolean = false,
    maxRequests?: number,
    disableShake: boolean = false,
    interceptIOS: boolean = true,
    theme: 'dark' | 'light' = 'dark',
    onPressClose = null,
  ) {
    props = {
      visible,
      enabled,
      maxRequests,
      disableShake,
      interceptIOS,
      theme,
      onPressClose,
    };
  }
});

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
