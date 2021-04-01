import * as React from 'react';
import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Subheading } from 'react-native-paper';
import { reduxTag } from './Status';
import { getTime, getShortDate, isLongText, addEllipsis } from '../Utils/helpers';
import { Text, Title } from './Text';
import { ThemeContext } from '../Theme';
import ReduxAction from '../Core/Objects/ReduxAction';
import { ViewMoreButton } from './ViewMoreButton';

export interface IProps {
  testId?: string;
  item: ReduxAction;
  reduxAction: any;
  onPressViewMore: (value: boolean) => void;
}

export const ActionDetails: React.FC<IProps> = (props: IProps) => {
  const theme = useContext(ThemeContext);

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {/* REDUX + REDUX TAG */}
      <View style={[styles.line]}>
        <Title style={[{ marginRight: 6 }, { color: theme.textColorOne }]}>REDUX</Title>
        {reduxTag()}
      </View>

      <View style={[styles.line]}>
        <Text style={{ color: theme.textColorFour }}>Started at : </Text>
        <Text>{`${getShortDate(props.item.startTime)} - ${getTime(props.item.startTime)}`}</Text>
      </View>

      <Subheading
        style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
      >
        Content
      </Subheading>

      <View style={[styles.line]}>
        <Text style={{ color: theme.textColorFour }}>Type</Text>
      </View>
      <View style={[styles.line]}>
        <Text>{props.item.action.type}</Text>
      </View>

      <View style={[styles.line]}>
        {props.reduxAction.label && (
          <Text style={{ color: theme.textColorFour }}>{`${props.reduxAction.label
            .charAt(0)
            .toUpperCase()}${props.reduxAction.label.slice(1)} :`}</Text>
        )}
      </View>
      <View style={[styles.line]}>
        <View style={[styles.attribtuesContainer, { flex: 1, paddingHorizontal: 0 }]}>
          {props.reduxAction.payload && <Text>{addEllipsis(JSON.stringify(props.reduxAction.payload, null, 2))}</Text>}
          {isLongText(addEllipsis(JSON.stringify(props.reduxAction.payload, null, 2))) && (
            <View style={{ alignItems: 'flex-end' }}>
              <ViewMoreButton onPress={() => props.onPressViewMore(true)} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ActionDetails;

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },

  subheading: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },

  attribtuesContainer: {
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
