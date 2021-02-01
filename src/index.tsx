import * as React from 'react';
import { Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { useState } from 'react';

export interface IProps {
  customAction?: () => void;
}

export const Netwatch = (props: IProps) => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" visible={netwatchVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>

            {props.customAction && (
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={() => {
                  props.customAction?.();
                }}
              >
                <Text style={styles.textStyle}>Request</Text>
              </TouchableHighlight>
            )}

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setNetwatchVisible(!netwatchVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Netwatch</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setNetwatchVisible(true);
        }}
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
