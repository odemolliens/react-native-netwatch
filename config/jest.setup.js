import { configure } from 'enzyme';
import * as React from 'react';
import * as ReactNative from 'react-native';
import { mockNativeModules } from './__mocks__/nativeModules';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.doMock('react-native', () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      ...mockNativeModules,
    },
    ReactNative,
  );
});

// jest.mock('react-native', () => {
//   return {
//     ...jest.requireActual('react-native'),
//     ...mockNativeModules,
//     // useColorScheme: jest.fn().mockReturnValue('light'),
//   };
// });

// jest.mock('react-native-paper');
jest.mock('react-native-paper', () => {
  return {
    Subheading: () => <></>,
    Appbar: {
      Header: () => <></>,
      Content: () => <></>,
    },
    RadioButton: {
      Group: () => <></>,
      Item: () => <></>,
    },
    Snackbar: () => <></>,
    Text: () => <></>,
    Icon: () => <></>,
    Searchbar: () => <></>,
    ActivityIndicator: () => <></>,
    Provider: ({ children }) => children,
  };
});

jest.useFakeTimers();
// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('react-native/Libraries/Blob/FileReader', () => {});
jest.mock('react-native-fs', () => {
  return {
    mkdir: jest.fn(),
    moveFile: jest.fn(),
    copyFile: jest.fn(),
    pathForBundle: jest.fn(),
    pathForGroup: jest.fn(),
    getFSInfo: jest.fn(),
    getAllExternalFilesDirs: jest.fn(),
    unlink: jest.fn(),
    exists: jest.fn(),
    stopDownload: jest.fn(),
    resumeDownload: jest.fn(),
    isResumable: jest.fn(),
    stopUpload: jest.fn(),
    completeHandlerIOS: jest.fn(),
    readDir: jest.fn(),
    readDirAssets: jest.fn(),
    existsAssets: jest.fn(),
    readdir: jest.fn(),
    setReadable: jest.fn(),
    stat: jest.fn(),
    readFile: jest.fn(),
    read: jest.fn(),
    readFileAssets: jest.fn(),
    hash: jest.fn(),
    copyFileAssets: jest.fn(),
    copyFileAssetsIOS: jest.fn(),
    copyAssetsVideoIOS: jest.fn(),
    writeFile: jest.fn(),
    appendFile: jest.fn(),
    write: jest.fn(),
    downloadFile: jest.fn(),
    uploadFiles: jest.fn(),
    touch: jest.fn(),
    MainBundlePath: jest.fn(),
    CachesDirectoryPath: jest.fn(),
    DocumentDirectoryPath: jest.fn(),
    ExternalDirectoryPath: jest.fn(),
    ExternalStorageDirectoryPath: jest.fn(),
    TemporaryDirectoryPath: jest.fn(),
    LibraryDirectoryPath: jest.fn(),
    PicturesDirectoryPath: jest.fn(),
  };
});

jest.mock('react-native-share', () => {
  return {
    open: jest.fn(),
  };
});

jest.mock('react-native-vector-icons', () => {
  return {
    Icon: jest.mock(),
    RNVectorIconsManager: jest.mock(),
    createIconSetFromIcoMoon: jest.fn(),
    createIconSet: jest.fn(),
  };
});

jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('react-native-vector-icons/Fontisto', () => 'Icon');

jest.mock('react-native-device-info', () => {
  return {
    getBrand: jest.fn(),
    getBaseOsSync: jest.fn(),
    getSystemVersion: jest.fn(),
    getApiLevelSync: jest.fn(),
    getApplicationName: jest.fn(),
    getVersion: jest.fn(),
    getBuildNumber: jest.fn(),
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  isConnected: {
    addEventListener: jest.fn(),
  },
  getConnectionInfo: jest.fn().mockReturnValue({ type: 'test' }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  NetInfoStateType: {
    unknown: 'unknown',
    none: 'none',
    cellular: 'cellular',
    wifi: 'wifi',
    bluetooth: 'bluetooth',
    ethernet: 'ethernet',
    wimax: 'wimax',
    vpn: 'vpn',
    other: 'other',
  },
}));
