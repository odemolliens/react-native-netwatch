import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ReduxAction from '../Core/Objects/ReduxAction';
import { getTime } from '../Utils/helpers';
import { Status } from './Status';

export interface IProps {
  item: ReduxAction;
}

export const ReduxItem: React.FC<IProps> = ({ item }) => (
  <View style={styles.listItemContainer}>
    <Status item={item} backgroundColor="#64b5f6" text="ACT" subText="-" />
    <View style={styles.url}>
      <View style={styles.action}>
        <Text numberOfLines={1} style={styles.titleStyle}>{`${
          item.action.type.toUpperCase() || 'UNDEFINED'
        }`}</Text>
        <Text style={styles.date}>{getTime(item.startTime)}</Text>
      </View>
      <Text numberOfLines={1} style={styles.descriptionStyle}>
        Redux action
      </Text>
    </View>
  </View>
);

export default ReduxItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#bdbdbd',
    borderBottomWidth: 0.5,
    backgroundColor: '#757575',
    height: 50,
  },
  url: {
    flex: 1,
    paddingRight: 8,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
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
