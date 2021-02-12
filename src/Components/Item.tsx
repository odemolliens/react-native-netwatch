import * as React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import { Appbar, Searchbar, Surface, List } from 'react-native-paper';
import { Request } from '../Core/Request';
import { Status } from './Status';

export interface IProps {
  item: Request;
  onPress: () => void;
}

export const Item: React.FC<IProps> = ({ item, onPress }) => (
  <List.Item
    onPress={() => onPress()}
    style={styles.listItemContainer}
    titleStyle={styles.titleStyle}
    key={item._id}
    title={item.url}
    left={() => <Status item={item} textColor={styles.textColor} />}
  />
);

export default Item;

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: -12,
  },
  titleStyle: {
    color: 'black',
  },
  textColor: {
    color: 'black',
  },
});
