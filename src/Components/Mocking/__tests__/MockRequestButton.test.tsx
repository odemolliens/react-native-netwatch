import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { MockRequestButton } from '../MockRequestButton';

describe('Test MockRequestButton', () => {
  let component: ShallowWrapper;

  it('should render properly', () => {
    component = shallow(<MockRequestButton onPress={jest.fn()} />);
    expect(component).toMatchSnapshot();
  });
});
