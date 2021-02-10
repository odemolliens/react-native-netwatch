import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { IRequest } from '../types';
import { setColor, identifier } from '../Utils/helpers';

interface IProps {
  item: IRequest;
  textColor?: Object;
}

export const Status: React.FC<IProps> = (props: IProps) => {
  const _color = setColor(props.item.status || 500);

  return (
    <View style={styles.leftContainer}>
      <View style={[styles.statusIndicator, { backgroundColor: _color }]} />
      <View style={styles.textLeftContainer}>
        <Text style={[styles.methodText, props.textColor]}>{props.item.method}</Text>
        <Text style={[styles.statusText, { color: _color }]}>{props.item.status}</Text>
        <Text style={[styles.dateText, props.textColor]}>
          {props.item.responseHeaders && identifier(props.item.startTime, props.item._id)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftContainer: {
    flexDirection: 'row',
    width: 90,
  },
  statusIndicator: {
    height: 64,
    width: 6,
  },
  textLeftContainer: {
    justifyContent: 'space-between',
    alignContent: 'center',
    width: 80,
    paddingVertical: 3,
  },
  methodText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    textAlign: 'center',
    fontSize: 12,
  },
});
