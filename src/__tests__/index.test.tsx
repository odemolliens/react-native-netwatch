import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { IProps, Netwatch } from '../index';
import { Main } from '../Components/Main';
import { Modal } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

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
    givenProps(true, true);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should call setVisible', () => {
    let useStateMock: any = (visible: any) => [false, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(false, true);
    mockUseEffect();
    givenComponent();
    mockUseEffect();
    expect(setVisible).toHaveBeenCalledTimes(1);
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
    let useStateMock: any = (visible: any) => [visible, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 20);
    givenComponent();
    expect(component.find(Main)).toHaveLength(1);
    component.find(Main).invoke('onPressClose')(false);
    expect(setVisible).toHaveBeenCalledTimes(1);
  });

  it('should render properly Modal and called setVisible when back is pressed', () => {
    // Case when shake is actived
    let useStateMock: any = (visible: any) => [visible, setVisible];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 20);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(1);
    component.find(Modal).invoke('onRequestClose')();
    expect(setVisible).toHaveBeenCalledTimes(1);
  });

  it('should render properly Modal and called props.onPressClose when back is pressed', () => {
    // Case when button is actived and shake desactivated
    givenProps(true, true, 20, true, true, 'dark', onPressClose);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(1);
    component.find(Modal).invoke('onRequestClose')();
    expect(props.onPressClose).toHaveBeenCalledTimes(1);
  });

  it('should render properly Modal and called setShowDetails when back is pressed', () => {
    // Case when the Details page is visible
    let useStateMock: any = (showDetails: any) => [true, setShowDetails];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(true, true, 20, true, true, 'dark', onPressClose);
    givenComponent();
    expect(component.find(Modal)).toHaveLength(1);
    component.find(Modal).invoke('onRequestClose')();
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
