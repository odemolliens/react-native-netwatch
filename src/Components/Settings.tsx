import * as React from 'react';
// NOTE: React Native Paper modal doesn't work fine - DON'T USE
// NOTE: React Native Paper ToggleButton can't allow add text in the button -> Custom Toggle Button here
import { View, StyleSheet, Modal } from 'react-native';
import { Dialog, Button, Text, RadioButton } from 'react-native-paper';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IProps {
  testId?: string;
  visible: boolean;
  onDismiss: () => void;
  source: string;
  onSetSource: (value: string) => void;
  filter: string;
  onSetFilter: (value: string) => void;
  onPressClear: () => void;
}

// KEEP Modal around Dialog (bug with react-native paper, dialog is always in transparency)
export const Settings = (props: IProps) => {
  return (
    <Modal animationType="fade" transparent visible={props.visible}>
      <Dialog visible={props.visible} onDismiss={() => props.onDismiss()}>
        <View style={styles.settingsContainer}>
          <Dialog.Title style={styles.section}>Settings</Dialog.Title>
          <RadioButton.Group
            onValueChange={(value) => props.onSetSource(value)}
            value={props.source}
          >
            <View style={styles.radioButtonContainer}>
              <RadioButton value="rnr" />
              <Text style={styles.radioButtonText}>React Native Requests</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton value="nr" />
              <Text style={styles.radioButtonText}>Native Requests</Text>
            </View>
          </RadioButton.Group>

          <Dialog.Title style={styles.section}>Filter</Dialog.Title>
          <View style={styles.toggleButtonGroup}>
            <Button
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'all' && styles.toogleButtonStatus,
              ]}
              style={[
                styles.toggleButton,
                props.filter === 'all' && styles.toggleButtonOpacity,
                styles.toggleButtonLeft,
              ]}
              onPress={() => props.onSetFilter('all')}
            >
              All
            </Button>
            <Button
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'get' && styles.toogleButtonStatus,
              ]}
              style={[styles.toggleButton, props.filter === 'get' && styles.toggleButtonOpacity]}
              onPress={() => props.onSetFilter('get')}
            >
              GET
            </Button>
            <Button
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'post' && styles.toogleButtonStatus,
              ]}
              style={[styles.toggleButton, props.filter === 'post' && styles.toggleButtonOpacity]}
              onPress={() => props.onSetFilter('post')}
            >
              POST
            </Button>
            <Button
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'put' && styles.toogleButtonStatus,
              ]}
              style={[styles.toggleButton, props.filter === 'put' && styles.toggleButtonOpacity]}
              onPress={() => props.onSetFilter('put')}
            >
              PUT
            </Button>
            <Button
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'delete' && styles.toogleButtonStatus,
              ]}
              style={[
                styles.toggleButton,
                props.filter === 'delete' && styles.toggleButtonOpacity,
                styles.toggleButtonRight,
              ]}
              onPress={() => props.onSetFilter('delete')}
            >
              DEL
            </Button>
          </View>
        </View>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={() => props.onDismiss()}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Modal>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#212121',
  },
  section: {
    color: 'white',
  },
  toggleButtonGroup: {
    minHeight: 38,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    color: 'white',
  },
  toggleButton: {
    borderRightWidth: 0.5,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'white',
    borderRadius: 0,
  },
  toggleButtonLeft: {
    borderLeftWidth: 0.5,
    borderColor: 'white',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  toggleButtonRight: {
    borderLeftWidth: 0,
    borderColor: 'white',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  toggleButtonLabel: {
    padding: 0,
    color: 'white',
  },
  toogleButtonStatus: {
    color: 'white',
  },
  toggleButtonOpacity: {
    opacity: 0.5,
    backgroundColor: 'gray',
  },
  radioButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    textAlignVertical: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  actions: {
    backgroundColor: '#212121',
  },
});
