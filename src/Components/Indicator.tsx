import React, { useState, useRef, useEffect, useContext } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../Theme';
import { Title } from './Text';

export interface IProps {
  success: number;
  warning: number;
  failed: number;
}

// This component is a bar divided in three parts
// A part to represent success request, a part for warning and a part
// for requests failed.
// It is possible to press on the indicator to expand it and displayed
// a value in percent for each part.
export const Indicator: React.FC<IProps> = (props: IProps) => {
  const theme = useContext(ThemeContext);
  const height = useRef(new Animated.Value(6)).current;
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    Animated.timing(height, {
      toValue: isOpened ? 24 : 6,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isOpened]);

  return (
    <TouchableOpacity testID="openStatsButton" style={{ flexDirection: 'row' }} onPress={() => setIsOpened(!isOpened)}>
      <Animated.View
        key="success"
        style={{
          height,
          width: `${props.success.toString()}%`,
          backgroundColor: theme.successColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isOpened && props.success > 10 && (
          <Title style={[styles.text, { color: theme.textColorOne }]}>{`${Math.round(props.success)}%`}</Title>
        )}
      </Animated.View>
      <Animated.View
        key="warning"
        style={{
          height,
          width: `${props.warning.toString()}%`,
          backgroundColor: theme.warningColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isOpened && props.warning > 10 && (
          <Title style={[styles.text, { color: theme.textColorOne }]}>{`${Math.round(props.warning)}%`}</Title>
        )}
      </Animated.View>
      <Animated.View
        key="failure"
        style={{
          height,
          width: `${props.failed.toString()}%`,
          backgroundColor: theme.failedColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isOpened && props.failed > 10 && (
          <Title style={[styles.text, { color: theme.textColorOne }]}>{`${Math.round(props.failed)}%`}</Title>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Indicator;
