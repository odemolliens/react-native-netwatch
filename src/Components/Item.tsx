import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { RNRequest } from '../Core/Objects/RNRequest';
import { NRequest } from '../Core/Objects/NRequest';
import { ReduxAction } from '../Core/Objects/ReduxAction';
import { Status } from './Status';
import { getTime } from '../Utils/helpers';
import url from 'url';
import { Text, TextSecondaryColor } from '../Components/Text';
import { useContext } from 'react';
import { ThemeContext } from '../Theme';
import { ILog } from '../types';

export const ITEM_HEIGHT = 60;
export interface IProps {
  testID?: string;
  item: ILog;
  onPress: () => void;
  color: string;
}

export const Item: React.FC<IProps> = (props: IProps) => {
  const theme = useContext(ThemeContext);
  let _line1: string = '';
  let _line2: string = '';

  if (props.item instanceof ReduxAction) {
    _line1 = 'redux action';
    _line2 = props.item.stringifiedAction;
  } else {
    if (
      (props.item instanceof RNRequest || props.item instanceof NRequest) &&
      (props.item.url || props.item.shortUrl)
    ) {
      const urlObject = props.item.shortUrl ? url.parse(props.item.shortUrl) : url.parse(props.item.url);
      _line1 = (urlObject.host !== null && urlObject?.host) || '';
      _line2 = (urlObject.path !== null && urlObject?.path) || '';
    }
  }

  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={[
        styles.container,
        { backgroundColor: theme.secondaryLightColor, borderBottomColor: theme.textColorFour },
        { backgroundColor: props.color },
      ]}
      testID={`itemTouchable-${props.item._id}`}
    >
      <Status item={props.item} />
      <View style={styles.main}>
        <View style={styles.line}>
          <TextSecondaryColor numberOfLines={1}>{_line1}</TextSecondaryColor>
          <TextSecondaryColor style={[styles.time, { color: theme.textColorThree }]}>
            {getTime(props.item.startTime)}
          </TextSecondaryColor>
        </View>
        <View style={styles.line}>
          <Text numberOfLines={1}>{_line2}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    maxHeight: ITEM_HEIGHT,
    minHeight: ITEM_HEIGHT,
    borderBottomWidth: 0.5,
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
