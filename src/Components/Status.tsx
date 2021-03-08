import * as React from 'react';
import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import ReduxAction from '../Core/Objects/ReduxAction';
import RNRequest from '../Core/Objects/RNRequest';
import NRequest from '../Core/Objects/NRequest';
import { getStatus } from '../Utils/helpers';
import { ThemeContext } from '../Theme';
import { EnumStatus } from '../types';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Text } from '../Components/Text';

export interface IProps {
  item: RNRequest | ReduxAction | NRequest;
  text?: string;
  subText?: string;
  textColor?: Object;
  backgroundColor?: string;
}

export const tag = (color: string, text: string) => {
  const theme = useContext(ThemeContext);
  return (
    <View testID="statusCodeColor" style={[styles.status, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: theme.textColorOne }]}>{text}</Text>
    </View>
  );
};

export const reduxTag = () => {
  const theme = useContext(ThemeContext);
  return (
    <View
      testID="statusCodeColor"
      style={[styles.status, { backgroundColor: theme.reduxColor }, { paddingHorizontal: 8 }]}
    >
      <Fontisto name="redux" color={theme.textColorOne} size={12} />
    </View>
  );
};

export const Status: React.FC<IProps> = (props: IProps) => {
  const theme = useContext(ThemeContext);
  let _color: string = theme.textColorOne;
  let _line1: string = '';
  let _line2: string = '';

  if (props.item instanceof ReduxAction) {
    _color = theme.reduxColor;
    _line1 = 'REDUX';
  } else {
    const _temp = getStatus(props.item.status);
    if (_temp === EnumStatus.Success) _color = theme.successColor;
    if (_temp === EnumStatus.Warning) _color = theme.warningColor;
    if (_temp === EnumStatus.Failed) _color = theme.failedColor;
    _line1 = props.item.method;
    _line2 = props.item.status?.toString() || '500';
  }

  return (
    <View style={[styles.container]}>
      <Text>{_line1}</Text>
      {_line2.length > 0 ? tag(_color, _line2) : reduxTag()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 60,
    height: 60,
    padding: 6,
  },
  status: {
    justifyContent: 'center',
    fontSize: 12,
    height: 22,
    width: 30,
    borderRadius: 4,
  },

  text: {
    textAlign: 'center',
  },
});
