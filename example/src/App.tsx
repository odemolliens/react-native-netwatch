import * as React from 'react';
import { useState } from 'react';
import { Netwatch, startNativeListerner } from 'react-native-netwatch';
import { connect, Provider } from 'react-redux';
import store from './redux/store';
import { actionRequest } from './redux/actions/appActions';
import { Dispatch } from 'redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { Text, TouchableHighlight, StyleSheet, View, NativeModules } from 'react-native';

const { ExampleModule } = NativeModules;

// FIXME: RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks (iOS)

const App = () => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);
  const [netwatchEnabled, setNetwatchEnabled] = useState(true);

  return (
    <Provider store={store}>
      <PaperProvider>
        <ConnectedComponent enabled={netwatchEnabled} visible={netwatchVisible} onPressBack={setNetwatchVisible} />
        <View style={styles.container}>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              startNativeListerner();
            }}
            testID="buttonDisplayNetwatch"
          >
            <Text style={styles.textStyle}>Display Netwatch</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.enableButton}
            onPress={() => {
              ExampleModule.fetchSomething('https://reqres.in/api/users?page=2');
            }}
            testID="buttonDisabledNetwatch"
          >
            <Text style={styles.textStyle}>{netwatchEnabled ? 'Disabled Netwatch' : 'Enabled Netwatch'}</Text>
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
    marginBottom: 16,
  },
  enableButton: {
    backgroundColor: '#349EEB',
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
