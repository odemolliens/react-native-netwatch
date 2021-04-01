import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ViewMoreButton, IProps } from '../ViewMoreButton';

describe('Status test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onPress = jest.fn();

  it('should render properly redux action', () => {
    givenProps(onPress);
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<ViewMoreButton {...props} />);
  }

  function givenProps(onPress: () => void) {
    props = {
      onPress,
    };
  }
});
