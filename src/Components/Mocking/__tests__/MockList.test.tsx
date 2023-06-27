import React, { useState } from 'react';
import { MockList, NavbarRightSide } from '../MockList';
import { shallow, ShallowWrapper } from 'enzyme';
import { clearMockResponses, getMockResponses, resetMockResponses } from '../utils';
import { Button, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

jest.mock('react-native-fs', () => ({
  copyFile: jest.fn(),
  unlink: jest.fn(),
}));

jest.mock('react-native-share', () => ({
  open: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: (f: () => void) => f(),
}));

jest.mock('../utils', () => ({
  resetMockResponses: jest.fn(),
  getMockResponses: jest.fn(),
  clearMockResponses: jest.fn(),
}));

describe('Test Mock List Screen', () => {
  let component: ShallowWrapper;
  const setMockResponsesCopy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useState as jest.Mock).mockReturnValue([
      [
        {
          url: 'https://www.google.com',
          method: 'GET',
          headers: '',
          response: '',
          statusCode: 0,
          timeout: 0,
          active: true,
          date: 0,
        },
        {
          url: 'https://www.mendixxx.com',
          method: 'GET',
          headers: '',
          response: '',
          statusCode: 0,
          timeout: 0,
          active: false,
          date: 0,
        },
      ],
      jest.fn(),
    ]);
  });

  it('should render properly', () => {
    component = shallow(<MockList showEdit={jest.fn} onPressBack={() => jest.fn()} />);
    expect(component).toMatchSnapshot();
  });

  it('should paste content from clipboard and reset mock list', async () => {
    givenClipboardContent(
      '{"url":"https://www.google.com","method":"GET","headers":"","response":"","statusCode":0,"timeout":0,"active":true,"date":0}',
    );
    givenNavbarRightSide();
    await whenPressingPasteButton();
    thenShouldResetMockResponses();
  });

  it('should not paste anything if clipboard is empty', async () => {
    givenClipboardContent('');
    givenNavbarRightSide();
    await whenPressingPasteButton();
    thenShouldNotResetMockResponses();
  });

  it('should export mocks in a json file properly', async () => {
    givenNavbarRightSide();
    givenFileCreationSucceeds();
    givenFileExportSuccess();
    await whenPressingExportButton();
    thenMocksHasBeenExported();
  });

  it('should delete all mocks when pressing clear button', () => {
    givenNavbarRightSide();
    whenPressingClearButton();
    thenMockAreReset();
  });

  function givenClipboardContent(clipboardContent: string) {
    Clipboard.getString = jest.fn().mockResolvedValue(clipboardContent);
  }

  function givenNavbarRightSide() {
    component = shallow(
      <NavbarRightSide
        mockResponsesCopy={[
          {
            url: 'https://www.mendixxx.com',
            method: 'GET',
            headers: '',
            response: '',
            statusCode: 0,
            timeout: 0,
            active: true,
            date: 0,
          },
        ]}
        setMockResponsesCopy={setMockResponsesCopy}
      />,
    );
  }

  function givenFileCreationSucceeds() {
    (RNFS.copyFile as jest.Mock).mockResolvedValue(true);
  }

  function givenFileExportSuccess() {
    (Share.open as jest.Mock).mockResolvedValue(true);
  }

  function whenPressingExportButton() {
    component.find(TouchableOpacity).at(1).simulate('press');
  }

  function thenMocksHasBeenExported() {
    expect(RNFS.unlink).toHaveBeenCalled();
  }

  async function whenPressingPasteButton() {
    await component.find(TouchableOpacity).at(0).simulate('press');
  }

  function thenShouldResetMockResponses() {
    expect(resetMockResponses).toHaveBeenCalled();
  }

  function whenPressingClearButton() {
    component.find(Button).simulate('press');
  }

  function thenMockAreReset() {
    expect(clearMockResponses).toHaveBeenCalled();
    expect(setMockResponsesCopy).toHaveBeenCalledWith([]);
  }

  function thenShouldNotResetMockResponses() {
    expect(resetMockResponses).not.toHaveBeenCalled();
  }
});
