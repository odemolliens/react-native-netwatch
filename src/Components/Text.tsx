import * as React from 'react';
import { useContext } from 'react';
import { StyleProp, StyleSheet } from 'react-native';
import { Text as RNPText } from 'react-native-paper';
import { ThemeContext } from '../Theme';

export interface IProps {
  children: string;
  style?: StyleProp<any>;
  numberOfLines?: number;
}

export const Text = (props: IProps) => {
  const theme = useContext(ThemeContext);

  return (
    <RNPText style={[styles.text, { color: theme.textColorOne }, props.style]} {...props}>
      {props.children}
    </RNPText>
  );
};

export const TextSecondaryColor = (props: IProps) => {
  const theme = useContext(ThemeContext);

  return (
    <RNPText style={[styles.text, { color: theme.textColorTwo }, props.style]} {...props}>
      {props.children}
    </RNPText>
  );
};

export const Title = (props: IProps) => {
  const theme = useContext(ThemeContext);

  return (
    <RNPText style={[styles.text, styles.text, { color: theme.textColorOne }, props.style]} {...props}>
      {props.children}
    </RNPText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
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
