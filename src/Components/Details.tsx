import * as React from 'react';
import { View, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { en as translation } from '../i18n/en';

interface IProps {
  // request: any; // WIP: Should be a request object
  onPressBack: (showDetails: boolean) => void;
}

export const Details: React.FC<IProps> = (props) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.onPressBack(false)} />
        <Appbar.Content title={translation.title} />
      </Appbar.Header>
      <Text>TEST</Text>
    </View>
  );
};
