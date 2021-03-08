<p align="center">
  <img src="assets/lib_asset.png" width="60%">
</p>

[![Build Status](https://travis-ci.org/imranMnts/react-native-netwatch.svg?branch=develop)](https://travis-ci.org/imranMnts/react-native-netwatch)
![npm](https://img.shields.io/npm/v/react-native-netwatch.svg)
![GitHub](https://img.shields.io/github/license/odemolliens/react-native-netwatch.svg)

# React Native Netwatch

Network traffic logger for React Native. <br/>
Includes an interface to see http traffic from RN and native side

## Features

- Log react-native networks requests on iOS and Android
- Log native networks requests on iOS and Android
- Log redux-actions on iOS and Android
- Individually view detaisl of each requests
- Export list of requests/actions in CSV
- Copy URl or response

## Screenshots

<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/odemolliens/react-native-netwatch/feat/share/.github/screens/main_screen.png" width="300" />
  <img src="https://raw.githubusercontent.com/odemolliens/react-native-netwatch/feat/share/.github/screens/main_screen_light.png" width="300" />
  <img src="https://raw.githubusercontent.com/odemolliens/react-native-netwatch/feat/share/.github/screens/details_screen.png" width="300" /> 
  <img src="https://raw.githubusercontent.com/odemolliens/react-native-netwatch/feat/share/.github/screens/rnnetwatch.gif" width="300" />
</p>

---

## Getting started

### Dependencies

Before install, you must have these dependancies in your react-native project

- @react-native-clipboard/clipboard
- react-native-fs
- react-native-paper
- react-native-share

### Installation

```bash
yarn add react-native-netwatch
```

or

```bash
npm install react-native-netwatch
```

### iOS

Inside your project, go to ios directory and execute pod install

```bash
cd ios && pod install && ..
```

### Android

---

## Usage

### Using Netwatch component

if you want add Network traffic in your project, just import 'react-native-netwatch'</br>
and add the Netwatch component in the most higher position in the tree of components.</br>
For example, just after your store provider or your root component

```javascript
'use strict';
import React, { useState } from 'react';
import { Netwatch } from 'react-native-netwatch';
import store from './redux/store';
import { Text, TouchableHighlight, StyleSheet, View } from 'react-native';

const App = () => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);

  return (
    <Provider store={store}>
      <Netwatch
        visible={netwatchVisible}
        onPressClose={() => setNetwatchVisible(false)}
        onShake={() => setNetwatchVisible(true)}
      />
      <View style={styles.container}>
        <Text style={styles.title}>react-native-netwatch</Text>
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
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 60,
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  openButton: {
    backgroundColor: '#67E8F9',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    marginBottom: 16,
  },
  textStyle: {
    color: '#111827',
    textAlign: 'center',
  },
});
```

### Using Netwatch as Redux middleware

You can add 'react-native-netwatch' as a middleware to catch Redux actions</br>
To do that, just import reduxLogger from 'react-native-netwatch'</br>

```javascript
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import appActionsReducer from './reducers/appActionsReducer';
import { reduxLogger } from 'react-native-netwatch';

const createReducer = () => (state, action) =>
  combineReducers({
    app: appActionsReducer,
  })(state, action);

const store = createStore(
  createReducer(),
  compose(applyMiddleware(reduxLogger)actionLog.enhancer),
);

export default store;

```

## Props

|   Params    |  Type   | Default | Mandatory ? | Description                                              |
| :---------: | :-----: | :-----: | :---------: | :------------------------------------------------------- |
|   visible   | Boolean |  false  |     yes     | Show the main screen                                     |
|   enabled   | Boolean |  true   |     no      | Enabled/Disabled logger to intercept request and actions |
|    shake    | Boolean |  true   |     no      | Enabled/Disabled shake gesture to open the main screen   |
| maxRequests | Number  |   100   |     no      | Maximum requests displayed                               |
|    theme    | String  | 'dark'  |     no      | Possible values are 'dark' or 'light'                    |

## Methods

#### onShake(action)

| Params |   Type   | Description                           |
| :----: | :------: | :------------------------------------ |
| action | Function | action executed when device is shaked |

#### onPressClose(action)

| Params |   Type   | Mandatory ? | Description                                          |
| :----: | :------: | :---------: | :--------------------------------------------------- |
| action | Function |     yes     | action executed when cross is pressed on main screen |
