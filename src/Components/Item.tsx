import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// @ts-ignore
import { Appbar, Searchbar, Surface, List, Divider } from 'react-native-paper';
import { Request } from '../Core/Request';
import { Status } from './Status';
import { getTime } from '../Utils/helpers';
import url from 'url';

export interface IProps {
  item: Request;
  onPress: () => void;
}

export const Item: React.FC<IProps> = ({ item, onPress }) => {
  let urlObject = url.parse(item.url);
  return (
    <TouchableOpacity onPress={() => onPress()} style={styles.listItemContainer}>
      <>
        <Status item={item}></Status>
        <View style={styles.url}>
          <View style={styles.domain}>
            <Text numberOfLines={1} style={styles.titleStyle}>{`${urlObject.host}`}</Text>
            <Text style={styles.path}>{getTime(item.endTime)}</Text>
          </View>
          <Text numberOfLines={1} style={styles.descriptionStyle}>
            {urlObject.path}
          </Text>
        </View>
      </>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#bdbdbd',
    borderBottomWidth: 0.5,
    backgroundColor: '#757575',
  },
  url: {
    flex: 1,
    paddingRight: 8,
  },
  domain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  path: {
    color: 'white',
  },
  titleStyle: {
    paddingLeft: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  descriptionStyle: {
    paddingLeft: 16,
    color: 'white',
  },
  divider: {
    backgroundColor: 'gray',
  },
});
