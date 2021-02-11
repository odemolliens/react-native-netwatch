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


jest.mock('react-native/Libraries/Blob/FileReader', () => {});