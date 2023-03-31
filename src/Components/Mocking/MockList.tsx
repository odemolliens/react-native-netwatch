import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../Theme';
import { NavBar } from '../NavBar';
import { Divider } from 'react-native-paper';
import { clearMockResponses, FILE_PATH, getMockResponses, MockResponse, resetMockResponses } from './utils';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import Clipboard from '@react-native-clipboard/clipboard';

export function NavbarRightSide(props: {
  mockResponsesCopy: MockResponse[];
  setMockResponsesCopy: (mockResponsesCopy: MockResponse[]) => void;
}) {
  const theme = useContext(ThemeContext);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          Clipboard.getString().then(responses => {
            if (responses) {
              resetMockResponses(responses);
              props.setMockResponsesCopy(getMockResponses());
            }
          });
        }}
        style={[styles.button, { borderLeftWidth: 0 }]}
      >
        <FeatherIcon name="download" color={theme.textColorOne} size={24} />
      </TouchableOpacity>
      {props.mockResponsesCopy.length > 0 && (
        <TouchableOpacity
          style={[styles.button, { borderLeftWidth: 0 }]}
          onPress={() => {
            RNFS.copyFile(FILE_PATH, `${RNFS.DocumentDirectoryPath}/mocks-preset.json`)
              .then(() => {
                Share.open({
                  title: 'Export Mock preset',
                  url: `${RNFS.DocumentDirectoryPath}/mocks-preset.json`,
                  type: 'text/plain',
                  // excludedActivityTypes: []
                }).then(() => {
                  RNFS.unlink(`${RNFS.DocumentDirectoryPath}/mocks-preset.json`);
                });
              })
              .catch(console.error);
          }}
        >
          <FeatherIcon name="upload" color={theme.textColorOne} size={24} />
        </TouchableOpacity>
      )}
      <Button
        title={'Clear'}
        onPress={() => {
          clearMockResponses();
          props.setMockResponsesCopy([]);
        }}
      />
    </>
  );
}

export function MockList(props: {
  showEdit: (mockResponse: MockResponse, update: boolean) => void;
  onPressBack: () => void;
}) {
  const theme = useContext(ThemeContext);

  const [mockResponsesCopy, setMockResponsesCopy] = useState<MockResponse[]>([]);

  useEffect(() => {
    setMockResponsesCopy(getMockResponses());
  }, []);

  return (
    <View style={styles.container}>
      <NavBar
        icon="x"
        title={'Mock List'}
        onPressBack={props.onPressBack}
        rightComponent={
          <NavbarRightSide mockResponsesCopy={mockResponsesCopy} setMockResponsesCopy={setMockResponsesCopy} />
        }
      />

      <ScrollView style={{ backgroundColor: theme.secondaryColor }} contentContainerStyle={styles.scrollView}>
        {mockResponsesCopy.length === 0 && (
          <Text style={{ color: theme.textColorOne, alignSelf: 'center' }}>No mock created yet</Text>
        )}
        {mockResponsesCopy.length > 0 && (
          <>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[{ flex: 1, color: theme.textColorOne }, styles.title]}>URL</Text>
              <Text style={[styles.title, { color: theme.textColorOne }]}>Method</Text>
              <Text style={[styles.title, { color: theme.textColorOne }]} />
            </View>

            {mockResponsesCopy.map((mock, index) => (
              <TouchableOpacity key={`mock-${index}`} onPress={() => props.showEdit(mock, true)}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[{ flex: 1, color: mock.active ? theme.primaryColor : 'grey' }, styles.cell]}>
                    {mock.url}
                  </Text>
                  <Text style={[styles.cell, { color: theme.textColorOne }]}>{mock.method}</Text>
                  <View style={[styles.cell, { minWidth: 30 }]}>
                    <FeatherIcon name="arrow-right" color={theme.textColorOne} size={24} />
                  </View>
                </View>
                <Divider />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  subheading: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: 56,
    borderLeftWidth: 1,
  },
  scrollView: {
    paddingTop: 26,
    paddingBottom: 20,
  },

  title: {
    fontWeight: 'bold',
    margin: 10,
    minWidth: 50,
  },

  cell: {
    margin: 10,
    alignSelf: 'flex-start',
    minWidth: 50,
  },
});
