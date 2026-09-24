# Changelog

### 2.0.0

New Architecture support and breaking changes:

- Add support for React Native's New Architecture; validated with React Native 0.82, React 19, Fabric, TurboModules, and Hermes on Android and iOS
- Remove native Android and iOS request interception; Netwatch now tracks React Native JavaScript requests only
- Remove the shake-to-open event and the `disableShake` prop; there is no replacement prop, so applications must control Netwatch with `visible`
- Remove the `interceptIOS` prop; native Android and iOS requests can no longer be enabled or sniffed through props
- Remove the native module, Codegen configuration, CocoaPod, Android package, and native example code
- Remove the Native Requests source and model from the UI
- Remove the example's direct OkHttp dependencies and obsolete Flipper setup
- Remove `react-native-launch-arguments` and the `loadMockPresetFromInputParameters` prop
- Remove `react-native-device-info`; exports now use React Native platform information
- Replace `react-native-fs` with the New Architecture-compatible `@dr.pogodin/react-native-fs`
- Move native packages to constrained peer dependencies and update NetInfo, Paper, Share, Clipboard, and Safe Area Context
- Replace the legacy monolithic `react-native-vector-icons` package with the three scoped icon packages Netwatch uses
- Fix [CVE-2023-30533](https://nvd.nist.gov/vuln/detail/CVE-2023-30533), reported in [issue #223](https://github.com/odemolliens/react-native-netwatch/issues/223), by upgrading SheetJS `xlsx` from the vulnerable npm release to version 0.20.3 from the official SheetJS CDN

### Version 1.2.8

News
- Fix #94: Remove deprecated method EventEmitter.removeListener
- Update dependencies according to Snyk reports

### Version 1.2.7

News
- Fix #89 #54: Be able to intercept http request on some projects
- Update `@react-native-clipboard/clipboard`

### Version 1.2.6

News
- Support RN 0.64.1 and inlineRequires
- Update sample/example app

### Version 1.2.5

News
- Fix issue linked to `react-native-json-tree` which appeared when the app use `inlineRequires` mode

### Version 1.2.4

News
- Fix close event not responding well

### Version 1.2.3

News
- Some bugfixes and code improvements

### Version 1.2.2

News
- Show stats between success/warning/failure requests
- Log connectivity change
- Can customize redux action to view them easily on Netwatch

New props:
- `showStats`: to display/hide stats indicator
- `reduxConfig`: to customize redux cells on Netwatch

### Version 1.1.0

News
- Add an item when the connection status change
- Display json responses as a json tree in detail page
- Netwatch can be displayed via:
    - The shake event (per default)
    - `visible` props, to display/hide via an external button .eg

New props:
- `visible`: to display/hide Netwatch without the shake event
- `onPressClose`: action which will be called when the user will press the exit button

### Version 1.0.3

Improvements
- Use okhttp version from app side via `okhttpVersion` key (android)
- Some bugfixes

### Version 1.0.0
- Library created
