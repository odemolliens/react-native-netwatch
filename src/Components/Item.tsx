import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { RNRequest } from '../Core/Objects/RNRequest';
import { ReduxAction } from '../Core/Objects/ReduxAction';
import { Status } from './Status';
import { getTime } from '../Utils/helpers';
import url from 'url';
import { Text, TextSecondaryColor } from '../Components/Text';
import { useContext } from 'react';
import { ThemeContext } from '../Theme';
import { EnumSourceType } from '../types';

export const ITEM_HEIGHT = 60;
export interface IProps {
  item: RNRequest | ReduxAction;
  onPress: () => void;
  color: string;
}

export const Item: React.FC<IProps> = (props: IProps) => { 
  const theme = useContext(ThemeContext);
  let _line1: string = '';
  let _line2: string = '';
  
  if (props.item instanceof ReduxAction || props.item.type === EnumSourceType.Redux) {
    _line1 = 'redux action'
    _line2 = JSON.stringify(props.item.action)
  } else {
    const urlObject = url.parse(props.item.url);
    _line1 = urlObject.host || '';
    _line2 = urlObject.path || '';
  }

  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={[styles.container, { backgroundColor: theme.gray700 }, { backgroundColor: props.color}]}
      testID={`itemTouchable-${props.item._id}`}
    >
      <Status item={props.item} />
      <View style={styles.main}>
        <View style={styles.line}>
          <TextSecondaryColor numberOfLines={1}>{_line1}</TextSecondaryColor>
          <TextSecondaryColor style={[styles.time, {color: theme.gray400}]}>{getTime(props.item.startTime)}</TextSecondaryColor>
        </View>
        <View style={styles.line}>
          <Text numberOfLines={1}>
            {_line2}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
  },
  time: {
    fontSize: 10,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
