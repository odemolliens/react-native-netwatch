import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { IProps, Netwatch } from '../index';
import { render, act, waitFor } from '@testing-library/react-native';
import { create } from 'react-test-renderer';

describe('Index test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;

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

  test('it updates content on successful call', async () => {
    let root;
    await act(async () => {
      root = render(<Netwatch enabled />);
    });
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
