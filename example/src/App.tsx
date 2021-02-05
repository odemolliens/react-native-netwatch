import * as React from 'react';
import { useEffect, useState } from 'react';
import { Netwatch } from 'react-native-netwatch';
import { connect, Provider } from 'react-redux';
import store from './redux/store';
import { actionRequest } from './redux/actions/appActions';
import { Dispatch } from 'redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { Text, TouchableHighlight, StyleSheet, View } from 'react-native';

const App = () => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);
  useEffect(() => {});

  return (
    <Provider store={store}>
      <PaperProvider>
        <ConnectedComponent visible={netwatchVisible} onPressBack={setNetwatchVisible} />
        <View style={styles.container}>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              setNetwatchVisible(true);
            }}
            testID="buttonDisplayNetwatch"
          >
            <Text style={styles.textStyle}>Display Netwatch</Text>
          </TouchableHighlight>
        </View>
      </PaperProvider>
    </Provider>
  );
};

export function mapDispatchToProps(dispatch: Dispatch, props: any): any {
  return {
    ...props,
    customAction: () => dispatch(actionRequest()),
  };
}

const ConnectedComponent = connect(null, mapDispatchToProps)(Netwatch);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
