import * as React from 'react';
import { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// @ts-ignore
import JSONTree from 'react-native-json-tree';
import { ThemeContext } from '../Theme';

export interface IProps {
  onPressBack: (showJSONDetails: boolean) => void;
  data: any;
  title?: string;
}

export const JSONDetails: React.FC<IProps> = props => {
  const theme = useContext(ThemeContext);
  const [viewJSON, setViewJSON] = useState<boolean>(false);

  const _renderLabel = ([raw]: string) => <Text style={{ fontSize: 14, color: theme.base0D }}>{`${raw} : `}</Text>;

  return (
    <View style={styles.container}>
      <Appbar.Header style={[styles.header, { backgroundColor: theme.secondaryDarkColor }]}>
        <TouchableOpacity
          style={[styles.button, { borderLeftWidth: 0 }]}
          onPress={() => props.onPressBack(false)}
          testID="buttonBackToDetailsScreen"
        >
          <FeatherIcon name="arrow-left" color={theme.textColorOne} size={24} />
        </TouchableOpacity>
        <Appbar.Content color={theme.primaryColor} title={props.title || 'Netwatch'} titleStyle={{ fontSize: 18 }} />
        <TouchableOpacity
          testID="buttonSwitchJSON"
          style={[styles.button, { borderLeftWidth: 0 }]}
          onPress={() => setViewJSON(!viewJSON)}
        >
          <MaterialCommunityIcons
            name="code-json"
            color={viewJSON ? theme.primaryColor : theme.textColorOne}
            size={24}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ScrollView horizontal style={{ backgroundColor: theme.secondaryColor }}>
        <ScrollView nestedScrollEnabled style={styles.scrollview}>
          {viewJSON ? (
            <JSONTree data={JSON.parse(props.data)} labelRenderer={_renderLabel} theme={theme} invertTheme={false} />
          ) : (
            <Text style={{ color: theme.textColorOne }}>{props.data}</Text>
          )}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default JSONDetails;

const styles = StyleSheet.create({
  header: {
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
  },
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  scrollview: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: 56,
    borderLeftWidth: 1,
  },
});
