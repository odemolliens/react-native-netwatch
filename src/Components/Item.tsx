import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
// @ts-ignore
import { Appbar, Searchbar, Surface, List } from 'react-native-paper';
import { IRequest } from '../types';

interface IPropsLeft {
  item: IRequest;
}

const Left: React.FC<IPropsLeft> = (props: IPropsLeft) => {
  const _formatDate = (date: string, id: number): string => {
    const _date = new Date(date);
    // Using fr-Fr to get time on 24h (not AM/PM)
    return `${_date.toLocaleTimeString('fr-FR')}:${id}`;
  };

  const _setColor = (status: number): string => {
    if (status >= 200 && status < 300) return 'green';
    if (status >= 300 && status < 400) return 'orange';
    return 'red';
  };
  const _color = _setColor(props.item.status || 500);

  return (
    <View style={styles.leftContainer}>
      <View style={[styles.statusIndicator, { backgroundColor: _color }]} />
      <View style={styles.textLeftContainer}>
        <Text style={styles.methodText}>{props.item.method}</Text>
        <Text style={[styles.statusText, { color: _color }]}>{props.item.status}</Text>
        <Text style={styles.dateText}>
          {props.item.responseHeaders &&
            _formatDate(props.item.responseHeaders.Date, props.item._id)}
        </Text>
      </View>
    </View>
  );
};

interface IProps {
  item: IRequest;
  onPress: () => void;
}

const Item: React.FC<IProps> = ({ item, onPress }) => (
  <List.Item
    onPress={() => onPress()}
    style={styles.listItemContainer}
    key={item._id}
    title={item.url}
    left={() => <Left item={item} />}
  />
);

export default Item;

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: -12,
  },
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
