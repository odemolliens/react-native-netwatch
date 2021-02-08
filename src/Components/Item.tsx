import * as React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import { Appbar, Searchbar, Surface, List } from 'react-native-paper';
import { IRequest } from '../types';
import { Status } from './Status';

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
    left={() => <Status item={item} />}
  />
);

export default Item;

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: -12,
  },
});
