import * as React from 'react';
// NOTE: React Native Paper modal doesn't work fine - DON'T USE
// NOTE: React Native Paper ToggleButton can't allow add text in the button -> Custom Toggle Button here
import { View, StyleSheet, Modal } from 'react-native';
import { Dialog, Button, Text, RadioButton } from 'react-native-paper';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SourceType, RequestMethod, EnumFilterType, EnumSourceType } from '../types';

interface IProps {
  testId?: string;
  visible: boolean;
  onDismiss: () => void;
  source: SourceType | EnumSourceType;
  onSetSource: (value: any) => void;
  filter: RequestMethod | EnumFilterType.All;
  onSetFilter: (value: RequestMethod | EnumFilterType.All) => void;
  onPressClear: () => void;
}

// KEEP Modal around Dialog (bug with react-native paper, dialog is always in transparency)
export const Settings = (props: IProps) => {
  const [checked, setChecked] = React.useState(props.source);
  const disabledFilter = props.source === 'REDUX';

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
              <RadioButton
                value="ALL"
                status={checked === 'ALL' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('ALL')}
              />
              <Text style={styles.radioButtonText}>All Requests and Actions</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value="REDUX"
                status={checked === 'REDUX' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('REDUX')}
              />
              <Text style={styles.radioButtonText}>Redux Action</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value="RNR"
                status={checked === 'RNR' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('RNR')}
              />
              <Text style={styles.radioButtonText}>React Native Requests</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value="NR"
                status={checked === 'NR' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('NR')}
              />
              <Text style={styles.radioButtonText}>Native Requests</Text>
            </View>
          </RadioButton.Group>

          <Dialog.Title style={styles.section}>Filter</Dialog.Title>
          <View style={styles.toggleButtonGroup}>
            <Button
              disabled={disabledFilter}
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'ALL' && styles.toogleButtonStatus,
              ]}
              style={[
                styles.toggleButton,
                props.filter === 'ALL' && styles.toggleButtonOpacity,
                styles.toggleButtonLeft,
              ]}
              onPress={() => props.onSetFilter(EnumFilterType.All)}
            >
              All
            </Button>
            <Button
              disabled={disabledFilter}
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'GET' && styles.toogleButtonStatus,
              ]}
              style={[styles.toggleButton, props.filter === 'GET' && styles.toggleButtonOpacity]}
              onPress={() => props.onSetFilter('GET')}
            >
              GET
            </Button>
            <Button
              disabled={disabledFilter}
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'POST' && styles.toogleButtonStatus,
              ]}
              style={[styles.toggleButton, props.filter === 'POST' && styles.toggleButtonOpacity]}
              onPress={() => props.onSetFilter('POST')}
            >
              POST
            </Button>
            <Button
              disabled={disabledFilter}
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'PUT' && styles.toogleButtonStatus,
              ]}
              style={[styles.toggleButton, props.filter === 'PUT' && styles.toggleButtonOpacity]}
              onPress={() => props.onSetFilter('PUT')}
            >
              PUT
            </Button>
            <Button
              disabled={disabledFilter}
              labelStyle={[
                styles.toggleButtonLabel,
                props.filter === 'DELETE' && styles.toogleButtonStatus,
              ]}
              style={[
                styles.toggleButton,
                props.filter === 'DELETE' && styles.toggleButtonOpacity,
                styles.toggleButtonRight,
              ]}
              onPress={() => props.onSetFilter('DELETE')}
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
