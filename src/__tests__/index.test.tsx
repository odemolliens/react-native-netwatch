import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { IProps, Netwatch} from '../index';

describe('Index test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;

  it('should render properly', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
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

  function givenProps(visible: boolean = false, enabled: boolean = false, maxRequests?: number) {
    props = {
      visible,
      enabled,
      onPressClose: jest.fn(),
      maxRequests,
    };
  }
});
