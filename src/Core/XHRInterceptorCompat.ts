// XHRInterceptorCompat.ts

let XHRInterceptor: any;

try {
  const module = require(
    'react-native/src/private/inspector/XHRInterceptor'
  );

  XHRInterceptor = module.default ?? module;
} catch {
  try {
    const module = require(
      'react-native/Libraries/Network/XHRInterceptor'
    );

    XHRInterceptor = module.default ?? module;
  } catch {
    throw new Error(
      '[react-native-netwatch] XHRInterceptor is not available for this React Native version'
    );
  }
}

export default XHRInterceptor;