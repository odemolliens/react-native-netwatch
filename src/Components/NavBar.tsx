import { Appbar } from 'react-native-paper';
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as React from 'react';
import { ReactNode, useContext } from 'react';
import { ThemeContext } from '../Theme';

export function NavBar(props: {
  title: string;
  rightComponent?: ReactNode;
  icon?: string;
  onPressBack: (showDetails: boolean) => void;
}) {
  const theme = useContext(ThemeContext);

  return (
    <Appbar.Header style={[styles.header, { backgroundColor: theme.secondaryDarkColor }]}>
      <TouchableOpacity
        style={[styles.button, { borderLeftWidth: 0 }]}
        onPress={() => props.onPressBack(false)}
        testID="buttonBackToMainScreen"
      >
        <FeatherIcon name={props.icon || 'arrow-left'} color={theme.textColorOne} size={24} />
      </TouchableOpacity>
      <Appbar.Content color={theme.primaryColor} title={props.title} titleStyle={{ fontSize: 18 }} />
      {props.rightComponent}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    height: Platform.OS === 'ios' ? 60 : 100,
  },

  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: 56,
    borderLeftWidth: 1,
  },
});
