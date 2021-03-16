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

- Log network requests coming from React Native side
- Log network requests coming from the native side (iOS and Android) (optional)
- Log Redux actions (optional)
- View details of each request/action
- Export list of requests/actions in CSV
- Shake the device to display the tool

## Example app

<p float="left" align="center">
  <img src="assets/ios_netwatch.gif" width="300" />
</p>

---

## Getting started

### Dependencies

Before install, you must have these dependancies in your react-native project

- react-native-fs
- react-native-paper
- react-native-share

NOTA: Used fonts :

- Fontisto
- Feather
- MaterialCommunityIcons

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

If you want add Network traffic in your project, just import 'react-native-netwatch'</br>
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

Example in our demo application [here](https://github.com/odemolliens/react-native-netwatch/blob/5b6d19f40d7dc98cedb665172503fed93a8b0ae8/example/src/redux/store.ts#L23)

### Using Netwatch to intercept and display native requests

#### iOS

To be able to intercept requests from iOS side and display them into Netwatch</br>
You have to put in place the code below in your application

```objective-c
'Bridging-Header.h'

#import <NetwatchInterceptor.h>
```

Example in our demo application [here](https://github.com/odemolliens/react-native-netwatch/blob/5b6d19f40d7dc98cedb665172503fed93a8b0ae8/example/ios/example/example-Bridging-Header.h#L8)

```swift
'AppDelegate.swift'

let defaultSession = URLSession(configuration: .default)
if (defaultSession.configuration.protocolClasses != nil) {
    defaultSession.configuration.protocolClasses?.append(NetwatchInterceptor.self)
}
URLProtocol.registerClass(NetwatchInterceptor.self)
```

Or

```objective-c
'AppDelegate.m'

NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
if (configuration.protocolClasses != nil ) {
    configuration.protocolClasses = @[[NetwatchInterceptor class]];
}
[NSURLProtocol registerClass:[NetwatchInterceptor class]];

```

Example in our demo application [here](https://github.com/odemolliens/react-native-netwatch/blob/5b6d19f40d7dc98cedb665172503fed93a8b0ae8/example/ios/example/AppDelegate.swift#L31)

#### Android

To be able to intercept requests from Android side and display them into Netwatch</br>
You have to add to your OkHttp client Netwatch interceptor

```java
okHttpClient.addInterceptor(new NetwatchInterceptor(context));
```

Example in our demo application [here](https://github.com/odemolliens/react-native-netwatch/blob/5b6d19f40d7dc98cedb665172503fed93a8b0ae8/example/android/app/src/main/java/com/example/ExampleModule.java#L24)

## Props

|    Params    |  Type   | Default | Mandatory ? | Description                                              |
| :----------: | :-----: | :-----: | :---------: | :------------------------------------------------------- |
|   enabled    | Boolean |  true   |     yes     | Enabled/Disabled logger to intercept request and actions |
|   visible    | Boolean |  false  |     no      | Show the main screen                                     |
| disableShake | Boolean |  false  |     no      | Set to true to disable shake feature to display Netwatch |
| maxRequests  | Number  |   100   |     no      | Maximum requests displayed                               |
|    theme     | String  | 'dark'  |     no      | Possible values are 'dark' or 'light'                    |
