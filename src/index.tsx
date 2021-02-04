import * as React from 'react';
import { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableHighlight, View, FlatList } from 'react-native';
import logger from './LoggerSingleton';

export interface IProps {
  customAction?: () => void;
}

setInterval(() => {
  fetch('http://reactnative.dev/movies.json')
    .then((response) => response.json())
    .then((data) => console.log(data));
}, 2000);

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);
  const [netwatchEnabled, setNetwatchEnabled] = useState(true);
  const [requests, setRequests] = useState(logger.getRequests());
  logger.setCallback(setRequests)

  // Start NetWatcher
  useEffect(() => {
    if (netwatchEnabled) logger.enableXHRInterception();
    // Else stop watcher (and clean requests ?)
  }, [netwatchEnabled]);

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" visible={netwatchVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>

            {/* {props.customAction && (
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={() => {
                  props.customAction?.();
                  setRequests(logger.getRequests());
                }}
                testID="buttonCustomAction"
              >
                <Text style={styles.textStyle}>Request</Text>
              </TouchableHighlight>
            )} */}

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setNetwatchVisible(!netwatchVisible);
              }}
              testID="buttonHideNetwatch"
            >
              <Text style={styles.textStyle}>Hide Netwatch</Text>
            </TouchableHighlight>

            <FlatList
              keyExtractor={(item) => item._id.toString()}
              data={requests}
              renderItem={({ item }) => (
                <TouchableHighlight onPress={() => () => {}}>
                  <View style={{ flexDirection: 'row', backgroundColor: 'lightgray' }}>
                    <Text>{item._id}</Text>
                    <Text>{item.url}</Text>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setNetwatchVisible(true);
        }}
        testID="buttonDisplayNetwatch"
      >
        <Text style={styles.textStyle}>Display Netwatch</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    height: '100%',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
