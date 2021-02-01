import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { IProps, Netwatch } from '../index';

describe('Index test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const action = jest.fn();

  it('should render properly', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly with custom action', () => {
    givenProps(action);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly & press display button', () => {
    givenProps(action);
    givenComponent();
    whenPressingButton('buttonDisplayNetwatch');
  });

  it('should render properly & press hide button', () => {
    givenProps(action);
    givenComponent();
    whenPressingButton('buttonHideNetwatch');
  });

  it('should render properly & press custom action button', () => {
    givenProps(action);
    givenComponent();
    whenPressingButton('buttonCustomAction');
    expect(action).toHaveBeenCalledTimes(1);
  });

  // UTILITIES

  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  // GIVEN
  function givenComponent() {
    component = shallow(<Netwatch {...props} />);
  }

  function givenProps(customAction?: any) {
    props = {
      customAction,
    };
  }
});
