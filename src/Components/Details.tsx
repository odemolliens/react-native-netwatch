import * as React from 'react';
import { View, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { en as translation } from '../i18n/en';
import { IRequest } from '../types';

interface IProps {
  // request: any; // WIP: Should be a request object
  onPressBack: (showDetails: boolean) => void;
  item: IRequest | undefined;
}

export const Details: React.FC<IProps> = (props) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.onPressBack(false)} />
        <Appbar.Content title={translation.title} />
      </Appbar.Header>
      {props.item && <Text>{props.item && props.item.status}</Text>}
    </View>
  );
};
