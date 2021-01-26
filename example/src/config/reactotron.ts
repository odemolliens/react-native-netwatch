import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import { NativeModules } from 'react-native';

const scriptURL = NativeModules.SourceCode.scriptURL;
const scriptHostname = scriptURL.split('://')[1].split(':')[0];

export const setup = () =>
  Reactotron.configure({
    name: 'Netwatch example',
    host: scriptHostname,
  })
    .use(reactotronRedux())
    .useReactNative()
    .connect();
