import * as React from 'react';
import { StyleSheet } from 'react-native';
import { shallow } from 'enzyme';
import { Text, Title, TextSecondaryColor, IProps } from '../Text';

describe('Status test suite', () => {
  let props: IProps;

  it('should render Text properly', () => {
    givenProps('Children text', StyleSheet.create({ text: { color: 'red' } }));
    expect(shallow(<Text {...props} />)).toMatchSnapshot();
  });

  it('should render Title properly', () => {
    givenProps('Children text', StyleSheet.create({ text: { color: 'red' } }));
    expect(shallow(<Title {...props} />)).toMatchSnapshot();
  });

  it('should render Title properly', () => {
    givenProps('Children text', StyleSheet.create({ text: { color: 'red' } }));
    expect(shallow(<TextSecondaryColor {...props} />)).toMatchSnapshot();
  });

  function givenProps(children: string, style: any) {
    props = {
      children,
      style,
    };
  }
});
