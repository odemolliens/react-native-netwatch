export const mockNativeModules: any = {
  Alert: {
    alert: jest.fn(),
  },
  Animated: {
    ...jest.requireActual('react-native/Libraries/Animated/src/Animated'),
    createAnimatedComponent: jest.fn(),
    loop: () => ({
      start: jest.fn(),
    }),
    timing: jest.fn().mockReturnValue({ start: jest.fn() }),
    start: jest.fn(),
    spring: jest.fn().mockReturnValue({ start: jest.fn() }),
    Value: (value: any) => ({
      interpolate: () => value,
      setValue: (styles: any) => styles,
    }),
  },
  LayoutAnimation: {
    configureNext: jest.fn(),
    Presets: {
      easeInEaseOut: {},
    },
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => new Promise((resolve: any) => resolve(true))),
    openSettings: jest.fn(),
    addEventListener: jest.fn(),
    getInitialURL: jest.fn(() => Promise.resolve()),
    removeEventListener: jest.fn(),
    sendIntent: jest.fn(),
  },
  NativeDeviceInfo: {
    getConstants() {
      return {
        Dimensions: {
          window: {
            fontScale: 2,
            height: 1334,
            scale: 2,
            width: 750,
          },
          screen: {
            fontScale: 2,
            height: 1334,
            scale: 2,
            width: 750,
          },
        },
      };
    },
  },
  NativeModules: {
    AWSMqtt: {
      setupAWSMQTT: jest.fn(),
      connectToAWSMQTT: jest.fn(),
      unsubscribeAllTopics: jest.fn(),
      disconnect: jest.fn(),
      generateCSR: jest.fn(),
      publishToAWSMQTT: jest.fn(),
      subscribeFromAwsMqtt: jest.fn(),
    },
    Override: { great: 'success' },
    SourceCode: { scriptURL: 'scriptURL://scriptURL:scriptURL' },
    ReanimatedModule: {
      configureProps: jest.fn(),
    },
    RNPermissions: {
      Direction: jest.fn(),
    },
    RNGestureHandlerModule: {
      Direction: jest.fn(),
    },
    RNFetchBlob: {
      DocumentDir: '',
      CacheDir: '',
      PictureDir: '',
      MusicDir: '',
      MovieDir: '',
      DownloadDir: '',
      DCIMDir: '',
      SDCardDir: '',
      SDCardApplicationDir: '',
      MainBundleDir: '',
      LibraryDir: '',
    },
    ViewData: {
      dataForService: (fn: any) =>
        fn({ error: null, data: { service: 'service', data: [{ items: [] }] } }),
    },
    UrlRouter: {
      openUri: jest.fn(),
    },
    SharedPreferences: {
      getAllKeys: jest.fn(),
    },
    RNCGeolocation: {
      getCoordinates: jest.fn(),
    },
    RNLocalize: {
      initialConstants: jest.fn(),
    },
    BridgeApiManager: {
      cleanProductsDetails: jest.fn(),
    },
    BridgeAppManager: {
      logInCrashlitics: jest.fn(),
      logInInstabug: jest.fn(),
      logScreenInCrashlitics: jest.fn(),
      logScreenInInstabug: jest.fn(),
    },
    PlatformConstants: jest.fn(),
    RNCNetInfo: jest.fn(),
    FileReaderModule: jest.fn(),
    StatusDataEmitter: jest.fn(),
    BridgeDataManager: {
      addNewPublicWifi: jest.fn(),
      dataForService: jest.fn(),
      displaySettingsPanel: jest.fn(),
    },
    BridgeUserDataManager: jest.fn(),
    RNFirebase: {
      apps: {
        name: 'example',
      },
    },
  },
  NativeEventEmitter: () => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }),
  Platform: {
    OS: 'ios',
    Version: '13.0.0',
    select: (value: any) => ({
      android: value,
      ios: value,
    }),
  },
  PushNotificationIOS: {
    requestPermissions: () => ({ alert: true, badge: true, sound: true }),
  },
  StyleSheet: {
    create: (style: any) => style,
    compose: jest.fn(),
    flatten: () => ({}),
  },
  requireNativeComponent: jest.fn().mockReturnValue({}),
};
