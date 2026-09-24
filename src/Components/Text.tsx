import * as React from 'react';
import { useContext } from 'react';
import { StyleProp, StyleSheet, Text as RNText } from 'react-native';
import { ThemeContext } from '../Theme';

export interface IProps {
  children: string;
  style?: StyleProp<any>;
  numberOfLines?: number;
}

export const Text = (props: IProps) => {
  const theme = useContext(ThemeContext);

  return (
    <RNText style={[styles.text, { color: theme.textColorOne }, props.style]} {...props}>
      {props.children}
    </RNText>
  );
};

export const TextSecondaryColor = (props: IProps) => {
  const theme = useContext(ThemeContext);

  return (
    <RNText style={[styles.text, { color: theme.textColorTwo }, props.style]} {...props}>
      {props.children}
    </RNText>
  );
};

export const Title = (props: IProps) => {
  const theme = useContext(ThemeContext);

  return (
    <RNText style={[styles.text, styles.title, { color: theme.textColorOne }, props.style]} {...props}>
      {props.children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textBold: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
  },
});
