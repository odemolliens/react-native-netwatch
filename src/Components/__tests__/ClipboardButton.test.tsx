import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ClipboardButton, IProps } from '../ClipboardButton';

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
    component = shallow(<ClipboardButton {...props} />);
  }

  function givenProps(onPress: () => void) {
    props = {
      onPress,
    };
  }
});
