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

export const ITEM_HEIGHT = 60;
export interface IProps {
  testID?: string;
  item: RNRequest | NRequest | ReduxAction;
  onPress: () => void;
  color: string;
}

export const Item: React.FC<IProps> = (props: IProps) => {
  const theme = useContext(ThemeContext);
  let _line1: string = '';
  let _line2: string = '';

  if (props.item instanceof ReduxAction) {
    _line1 = 'redux action';
    _line2 = JSON.stringify(props.item.action);
  } else {
    if ((props.item instanceof RNRequest || props.item instanceof NRequest) && props.item.url) {
      const urlObject = url.parse(props.item.url);
      _line1 = (urlObject.host !== null && urlObject?.host) || '';
      _line2 = (urlObject.path !== null && urlObject?.path) || '';
    }
  }

  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={[styles.container, { backgroundColor: theme.secondaryLightColor }, { backgroundColor: props.color }]}
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
