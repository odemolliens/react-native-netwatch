import * as React from 'react';
import { NativeModules } from 'react-native';
import { shallow, ShallowWrapper } from 'enzyme';
import { IProps, Netwatch } from '../index';
import { render, waitFor } from '@testing-library/react-native';

describe('Index test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  let useEffect;
  let mockUseEffect;
  const setVisible = jest.fn();

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

  const globalDateConstructor = Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime());
  });

  afterAll(() => {
    global.Date.now = globalDateConstructor;
  });

  it('should render properly', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should set visible true', () => {
    let useStateMock: any = (visible: any) => [false, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(false);
    mockUseEffect();
    givenComponent();
    // expect(component.find(Modal).prop('visible')).toBe(false);
    // component.setProps({visible: true})
    // Always false
    // expect(component.find(Modal).prop('visible')).toBe(false);
    // UseEffect
    mockUseEffect();
    expect(setVisible).toHaveBeenCalledTimes(1);
    // component.update()
    // Rerendered
    // expect(component.find(Modal).prop('visible')).toBe(true)
  });

  it('should set launch intercept iOS', () => {
    let useStateMock: any = (visible: any) => [false, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 50, false, true);
    givenComponent();
    expect(NativeModules.RNNetwatch.getNativeRequests).toHaveBeenCalledTimes(1);
  });

  it('should contains the main screen with flatlist', async () => {
    // @ts-ignore
    const { getByTestId } = render(<Netwatch enabled visible reduxActions={[]} />);

    waitFor(() => expect(getByTestId('mainScreen')).toBeDefined());
    expect(getByTestId('itemsList')).toBeDefined();
  });

  it('should contains the details screen', async () => {
    // @ts-ignore
    const { getByTestId } = render(<Netwatch enabled reduxActions={[]} />);
    waitFor(() => expect(getByTestId('detailsScreen')).toBeDefined());
  });

  it('should disable netwatch', async () => {
    // @ts-ignore
    const { getByTestId } = render(<Netwatch enabled={false} reduxActions={[]} />);

    waitFor(() => expect(getByTestId('mainScreen')).toBeDefined());
    expect(getByTestId('itemsList')).toBeDefined();
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
  ) {
    props = {
      visible,
      enabled,
      maxRequests,
      disableShake,
      interceptIOS,
      theme,
    };
  }
});
