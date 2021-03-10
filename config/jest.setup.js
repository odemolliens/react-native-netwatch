import { configure } from 'enzyme';
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
    ReactNative
  );
});

jest.mock('react-native-paper');

jest.useFakeTimers();
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
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


jest.mock('react-native-device-info', () => {
  return {
    getBrand: jest.fn(),
    getBaseOsSync: jest.fn(),
    getSystemVersion: jest.fn(),
    getApiLevelSync: jest.fn(),
    getApplicationName: jest.fn(),
    getVersion: jest.fn(),
    getBuildNumber: jest.fn(),
  }
})
