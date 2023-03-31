import React from 'react';
import { NavBar } from '../NavBar';
import { shallow, ShallowWrapper } from 'enzyme';
import { TouchableOpacity } from 'react-native';

describe('Test NabBar componsnet', () => {
  let component: ShallowWrapper;

  it('should render properly', () => {
    component = shallow(<NavBar title={'title'} icon={'left'} onPressBack={() => jest.fn()} />);
    expect(component).toMatchSnapshot();
  });

  it('should go back when pressing left side', () => {
    const onPressBack = jest.fn();
    component = shallow(<NavBar title={'title'} icon={'left'} onPressBack={onPressBack} />);
    component.find(TouchableOpacity).simulate('press');
    expect(onPressBack).toHaveBeenCalled();
  });
});
