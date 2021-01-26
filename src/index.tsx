import * as React from 'react';
import { Button, NativeModules, Text, View } from 'react-native';
import styles from './styles';

interface IProps {
  customAction?: () => void;
}

export const addOne = (input: number) => input + 1;

export const Counter = (props: IProps) => {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text>You pressed {count} times</Text>
      <Button
        onPress={() => {
          if (props.customAction) {
            props.customAction();
          }
          setCount(addOne(count));
        }}
        title="Press Me to request"
      />
    </View>
  );
};

export default NativeModules.RNNetwatch;
