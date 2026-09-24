<p align="center">
  <img src="assets/lib_asset.png" width="60%">
</p>

[![Build Status](https://travis-ci.org/odemolliens/react-native-netwatch.svg?branch=develop)](https://travis-ci.org/odemolliens/react-native-netwatch)
![npm](https://img.shields.io/npm/v/react-native-netwatch.svg)
![GitHub](https://img.shields.io/github/license/odemolliens/react-native-netwatch.svg)

# React Native Netwatch

Network traffic logger for requests initiated from React Native JavaScript.

## Features

- Supports React Native's New Architecture (Fabric and TurboModules)
- Log network requests coming from React Native JavaScript
- Log Redux actions (optional)
- View details of each request/action
- Generate and share the list of requests/actions in Excel (XLSX) file
- Log connectivity change
- Show stats between success/warning/failure requests

## Example app

<p float="left" align="center">
  <img src="assets/ios_netwatch.gif" width="300" />
</p>

---

## Getting started

### Dependencies

Netwatch keeps native packages as peer dependencies so that the application owns a single autolinked copy. Install these packages in your React Native project:

- `@dr.pogodin/react-native-fs`
- `@react-native-clipboard/clipboard`
- `@react-native-community/netinfo`
- `react-native-paper`
- `react-native-safe-area-context`
- `react-native-share`
- `@react-native-vector-icons/feather`
- `@react-native-vector-icons/fontisto`
- `@react-native-vector-icons/material-design-icons`

#### Fonts

Netwatch only uses these icon sets:

- Fontisto
- Feather
- MaterialCommunityIcons

The scoped icon packages autolink their native resources. Refer to the
<a href='https://github.com/oblador/react-native-vector-icons/blob/master/MIGRATION.md'>React Native Vector Icons migration guide</a>
when upgrading an application which used the former monolithic package.

### Installation

```bash
yarn add react-native-netwatch
```

or

```bash
npm install react-native-netwatch
```

### New Architecture support

Version 2 supports React Native's New Architecture and is validated with React Native 0.82, React 19, Fabric, TurboModules, and Hermes on Android and iOS. React Native 0.82 or newer is required because the current filesystem TurboModule uses Codegen APIs unavailable in older releases.

Netwatch itself no longer ships a custom native module, Codegen configuration, CocoaPod, or Android package. Its peer dependencies still use standard React Native autolinking.

### Removed native sniffing and shake support

Starting with version 2, Netwatch's request-capture layer is JavaScript-only:

- only requests initiated from React Native JavaScript are tracked and displayed;
- native Android and iOS requests are no longer intercepted;
- the shake-to-open event has been removed;
- the `interceptIOS` and `disableShake` props have been removed from the public API.

There is no prop to re-enable shake handling or native request sniffing. Applications must control the UI with the `visible` and `onPressClose` props. Requests created directly by native Android or iOS code are outside Netwatch's scope and will not appear in the request list.

---

## Usage

### Using Netwatch component

If you want add Network traffic in your project, just import 'react-native-netwatch'</br>
and add the Netwatch component in the most higher position in the tree of components.</br>
For example, just after your store provider or your root component

### How to activate Netwatch

Control the `visible` prop from your application. For example, you can open Netwatch with a button:

```javascript

import { Netwatch } from 'react-native-netwatch';

const App = () => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);

  return (
    <Provider store={store}>
      <Netwatch
        enabled={true}
        visible={netwatchVisible}
        onPressClose={() => setNetwatchVisible(false)}
      />
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => setNetwatchVisible(true)}
          testID="buttonDisplayNetwatch"
        >
          <Text style={styles.textStyle}>Display Netwatch</Text>
        </TouchableHighlight>
      <AppNavigator />
    </Provider>
  );
};

export default App;
```

### Using Netwatch as Redux middleware (optional)

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
  compose(applyMiddleware(reduxLogger)),
);

export default store;

```

Example in our demo application [here](https://github.com/odemolliens/react-native-netwatch/blob/5b6d19f40d7dc98cedb665172503fed93a8b0ae8/example/src/redux/store.ts#L23)

### Show stats

You can have statistics and see how many requests are succeeded or failed. By default, the indicator is closed. If you want the percentage, just press the indactor to opened it. Press again to close.

<p float="left" align="center">
  <img src="assets/stats.png" width="300" />
  <img src="assets/stats_opened.png" width="300" />
</p>

If you have applied a filter, stats are updated for current filtered view. If you have filtered to see Redux Action, the indicator is not interactive and just show a purple indicator.

<p float="left" align="center">
  <img src="assets/stats_redux.png" width="300" />

### Add extra informations into Redux Action items (optional)

If you want, you can add extra datas in the redux items to have more visual information. Instead of just see 'redux action' as label, your own text will be displayed.
To do that, you must passed to Netwatch a props called reduxConfig. This is an object where each key correspond to a redux action in your project.
All values **must** be string.

```javascript

import { Netwatch } from 'react-native-netwatch';

const reduxConfigExample = {
  DOWNLOAD_APP_TRANSLATIONS_SUCCESS: "👨 - Extra info",
}

const App = () => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);

  return (
    <Provider store={store}>
      <Netwatch
        enabled={true}
        reduxConfig={reduxConfigExample}
      />
      <AppNavigator />
    </Provider>
  );
};

export default App;
```

You will see something like that:

<p float="left" align="center">
  <img src="assets/redux_extras_netwatch.png" width="300" />
</p>

### ⚠️ Using Netwatch with Reactotron

There is a known incompatibility between Netwatch and Reactotron. If you want to redirect the requests into Reactotron, you should set the props `useReactotron` to **true** (have to reload the app if you edit its value). To go back to netwatch revert the props to false and reload again.

At this moment, it is not possible to display requests into Netwatch and Reactotron at the same time. You **must** choose between these tools.

## Props

> **Version 2 migration:** `disableShake` and `interceptIOS` no longer exist. Netwatch does not provide replacement props for shake handling or native request sniffing. Use `visible` to open or close Netwatch from your own UI.

|    Params     |   Type   |  Default  | Mandatory ? | Description                                                  |
| :-----------: | :------: | :-------: | :---------: | :----------------------------------------------------------- |
|    enabled    | Boolean  |   true    |   **yes**   | Enabled/Disabled logger to intercept request and actions     |
|    visible    | Boolean  |   false   |     no      | Show the main screen to display intercepted requests/actions |
| onPressClose  | Function | undefined |     no      | Called when Close button is pressed in the Main screen       |
|  maxRequests  |  Number  |    100    |     no      | Maximum requests displayed                                   |
|   showStats   | Boolean  |   true    |     no      | Show stats indicator                                         |
|  reduxConfig  |  Object  |    {}     |     no      | Extra infos for Redux Action. Accept only string as vaulues  |
| useReactotron | Boolean  |   false   |     no      | Redirect requests to Reactotron instead of Netwatch          |
|     theme     |  String  |  'dark'   |     no      | Possible values are 'dark' or 'light'                        |


## Mocking Responses

Netwatch also provides a way to mock responses which is useful during testing and development.

## Using Netwatch UI for Mocking

Netwatch UI provides a user-friendly way to create, export, and import mocks directly from the mobile application.

### Creating Mocks

To create a mock:

1. Open the Netwatch UI with the control connected to its `visible` prop.
2. Tap on any HTTP request in the list.
3. Tap on the "Mock Request" button.
4. Fill in the HTTP method, URL, status code, and response body fields. (leave blank to keep the original value)
5. Tap "Save".

<p float="left" align="center">
  <img src="assets/creating.gif" width="300" />
</p>

### Exporting Mocks

To export a mock:

1. Open the Netwatch UI.
2. Navigate to the "Mock List" screen by tapping top right hamburger menu.
3. Tap export button in the navigation bar.

The mock will be copied to the clipboard in a JSON format.

<p float="left" align="center">
  <img src="assets/exporting.gif" width="300" />
</p>

### Importing Mocks

To import a mock:

1. Copy the mock JSON to your clipboard.
2. Open the Netwatch UI.
3. Navigate to the "Mocked List" screen by tapping top right hamburger menu.
4. Tap on the "Import" button.

The mock from the clipboard will be parsed and added to the list of mocked requests.

<p float="left" align="center">
  <img src="assets/importing.gif" width="300" />
</p>

## Enabling and Disabling Mocks

You can easily control which mock responses are active at any time using the Netwatch UI.

### Enabling a Mock

To enable a mock:

1. Open the Netwatch UI.
2. Navigate to the "Mock List" screen by tapping top right hamburger menu.
3. Find the mock response you want to enable.
4. Tap on the mock response. When the switch is on the right and highlighted, the mock is enabled.

### Disabling a Mock

To disable a mock:

1. Open the Netwatch UI.
2. Navigate to the "Mock List" screen by tapping top right hamburger menu.
3. Find the mock response you want to disable.
4. Tap on the mock response. When the switch is on the left and grayed out, the mock is disabled.


<p float="left" align="center">
  <img src="assets/enabling-disabling.gif" width="300" />
</p>

## Using presets for fast Mocking

Netwatch provides two ways to mock responses with presets using props:

- via clipboard (`loadMockPresetFromClipboard`)
- via the `mockPresets` prop.

### `mockPresets`

`mockPresets` is an array of `MockResponse` objects defining the mock HTTP request/response behavior.

```jsx
const mockResponses = [
  {
    method: 'GET',
    url: '/api/v1/users',
    status: 200,
    body: { message: 'Success' },
  },
];

<Netwatch mockPresets={mockResponses} enabled={true} />;
```

### `loadMockPresetFromClipboard`

Copy your mock response data to your clipboard in the correct format and set `loadMockPresetFromClipboard` to `true`.

## Advanced Mocking Examples

### Simulating Request Timeouts

Simulate request timeouts with the `timeout` field in `MockResponse`.

```jsx
const mockResponses = [
  {
    method: 'GET',
    url: '/api/v1/users',
    status: 200,
    body: { message: 'Success' },
    timeout: 5, // Simulates a delay of 5 seconds
  },
];

<Netwatch mockPresets={mockResponses} enabled={true} />;
```

### HTTP Headers Mocking

Mock HTTP headers with the `headers` field in `MockResponse`.

```jsx
const mockResponses = [
  {
    method: 'GET',
    url: '/api/v1/users',
    status: 200,
    body: { message: 'Success' },
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'CustomHeaderValue',
    },
  },
];

<Netwatch mockPresets={mockResponses} enabled={true} />;
```

### Simulating HTTP Error Statuses

Simulate HTTP error statuses such as 401, 500, and 400.

```jsx
const mockResponses = [
  {
    method: 'GET',
    url: '/api/v1/secure',
    status: 401,
    body: { message: 'Unauthorized' },
  },
  {
    method: 'POST',
    url: '/api/v1/users',
    status: 500,
    body: { message: 'Internal Server Error' },
  },
  {
    method: 'POST',
    url: '/api/v1/users',
    status: 400,
    body: { message: 'Bad Request' },
  },
];

<Netwatch mockPresets={mockResponses} enabled={true} />;
```
