import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { RNRequest } from '../Core/Objects/RNRequest';
import { setColor } from '../Utils/helpers';

export interface IProps {
  item: RNRequest;
  text?: string;
  subText?: string;
  textColor?: Object;
  backgroundColor?: string;
}

export const Status: React.FC<IProps> = (props: IProps) => {
  const _color = setColor(props.item.status);

  return (
    <View style={[styles.leftContainer, { backgroundColor: props.backgroundColor || _color }]}>
      <Text testID="statusMethod" style={[styles.methodText, props.textColor]}>
        {props.item.method || props.text}
      </Text>
      <Text testID="statusCode" style={[styles.statusText]}>
        {props.item.status || props.subText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  leftContainer: {
    justifyContent: 'space-around',
    width: 50,
    height: 50,
  },
  methodText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#212121',
  },
});
