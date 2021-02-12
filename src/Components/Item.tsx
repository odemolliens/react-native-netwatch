import * as React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import { Appbar, Searchbar, Surface, List, Divider } from 'react-native-paper';
import { Request } from '../Core/Request';
import { Status } from './Status';
import url from 'url';

export interface IProps {
  item: Request;
  onPress: () => void;
}

export const Item: React.FC<IProps> = ({ item, onPress }) => {
  let urlObject = url.parse(item.url);
  return <>
    <List.Item
      onPress={() => onPress()}
      style={styles.listItemContainer}
      titleStyle={styles.titleStyle}
      descriptionStyle={styles.descriptionStyle}
      key={item._id}
      title={urlObject.host}
      description={item.url}
      descriptionNumberOfLines={1}
      left={() => <Status item={item} textColor={styles.textColor} />}
    />
    <Divider style={styles.divider} />
  </>;
};

export default Item;

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: -12,
  },
  titleStyle: {
    color: 'black',
    fontWeight: 'bold',
  },
  descriptionStyle: {
    color: 'black',
  },
  textColor: {
    color: 'black',
  },
  divider: {
    marginTop: 5,
    backgroundColor: 'lightgray',
  },
});
