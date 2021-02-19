import React, { useState } from 'react';
import { Netwatch } from 'react-native-netwatch';
import { connect, Provider } from 'react-redux';
import store from './redux/store';
import { Dispatch } from 'redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { Text, TouchableHighlight, StyleSheet, View, NativeModules } from 'react-native';
import { makeRequestInContinue } from './utils/requestGenerator';

const { ExampleModule } = NativeModules;

// FIXME: RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks (iOS)

const App = () => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);
  const [netwatchEnabled, setNetwatchEnabled] = useState(true);

  return (
    <Provider store={store}>
      <PaperProvider>
        <ConnectedComponent enabled={netwatchEnabled} visible={netwatchVisible} onPressClose={setNetwatchVisible} />
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
          <TouchableHighlight
            style={styles.enableButton}
            onPress={() => {
              setNetwatchEnabled(!netwatchEnabled);
            }}
            testID="buttonDisabledNetwatch"
          >
            <Text style={styles.textStyle}>{netwatchEnabled ? 'Disabled Netwatch' : 'Enabled Netwatch'}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.enableButton}
            onPress={() => {
              ExampleModule.fetchSomething('https://reqres.in/api/users?page=2');
            }}
            testID="buttonSendNativeRequest"
          >
            <Text style={styles.textStyle}>Send a Native request</Text>
          </TouchableHighlight>
          <ConnectedButton />
        </View>
      </PaperProvider>
    </Provider>
  );
};

const Button = (props: any) => (
  <TouchableHighlight
    style={styles.enableButton}
    onPress={() => {
      props.customAction({ type: 'todos/todoAdded', payload: 'Learn about actions' });
    }}
    testID="buttonDispatchAction"
  >
    <Text style={styles.textStyle}>Dispatch Action</Text>
  </TouchableHighlight>
);

export function mapDispatchToProps(dispatch: Dispatch, props: any): any {
  return {
    ...props,
    customAction: (action: any) => dispatch(action),
  };
}

const ConnectedButton = connect(null, mapDispatchToProps)(Button);
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
    marginBottom: 16,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

if (__DEV__) {
  let isStarted: boolean = false;
  !isStarted &&
    setTimeout(() => {
      makeRequestInContinue();
    }, 2000);
  isStarted = true;
}
