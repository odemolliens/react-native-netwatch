import { resolveFirstAvailableModule } from './resolveFirstAvailableModule';

const XHRInterceptor = resolveFirstAvailableModule<any>(
  [
    () => require('react-native/src/private/devsupport/devmenu/elementinspector/XHRInterceptor'),
    () => require('react-native/src/private/inspector/XHRInterceptor'),
    () => require('react-native/Libraries/Network/XHRInterceptor'),
  ],
  '[react-native-netwatch] XHRInterceptor is not available for this React Native version',
);

export default XHRInterceptor;
