import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { IProps, Netwatch } from '../index';
import { Main } from '../Components/Main';
import { Modal } from 'react-native';
import { mockRequestWithResponse } from '../Components/Mocking/utils';

jest.mock('../Components/Mocking/utils');

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
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should have Netwatch with light theme', () => {
    givenProps(false, true, 50, 'light', onPressClose);
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
    const useStateMock: any = (visible: any) => [visible, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 20);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(2);
    component.find(Modal).at(0).invoke('onRequestClose')();
    expect(setVisible).toHaveBeenCalledTimes(1);
  });

  it('should render properly Modal and called props.onPressClose when back is pressed', () => {
    givenProps(true, true, 20, 'dark', onPressClose);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(2);
    component.find(Modal).at(0).invoke('onRequestClose')();
    expect(props.onPressClose).toHaveBeenCalledTimes(1);
  });

  it('should render properly Modal and called setShowDetails when back is pressed', () => {
    // Case when the Details page is visible
    const useStateMock: any = (showDetails: any) => [true, setShowDetails];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 20, 'dark', onPressClose);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(2);
    component.find(Modal).at(0).invoke('onRequestClose')();
    expect(setShowDetails).toHaveBeenCalledTimes(1);
  });

  it('should load configured request mock presets', () => {
    givenProps(false, true);
    props.mockPresets = [{ url: 'https://example.com' } as any];
    for (let effect = 0; effect < 3; effect += 1) {
      useEffect.mockImplementationOnce(() => undefined);
    }
    mockUseEffect();
    givenComponent();

    expect(mockRequestWithResponse).toHaveBeenCalledWith(props.mockPresets[0]);
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<Netwatch {...props} />);
  }

  function givenProps(
    visible: boolean = false,
    enabled: boolean = false,
    maxRequests?: number,
    theme: 'dark' | 'light' = 'dark',
    onPressClose = null,
  ) {
    props = {
      visible,
      enabled,
      maxRequests,
      theme,
      onPressClose,
    };
  }
});
