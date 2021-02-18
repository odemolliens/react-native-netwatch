import * as React from 'react';
// NOTE: React Native Paper modal doesn't work fine - DON'T USE
// NOTE: React Native Paper ToggleButton can't allow add text in the button -> Custom Toggle Button here
import { View, StyleSheet, Modal } from 'react-native';
import { Dialog, Button, Text, RadioButton } from 'react-native-paper';
import { SourceType, RequestMethod, EnumFilterType, EnumSourceType } from '../types';

export interface IProps {
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
                value={EnumSourceType.All}
                status={checked === EnumSourceType.All ? 'checked' : 'unchecked'}
                onPress={() => setChecked(EnumSourceType.All)}
                testID={'RadioAll'}
              />
              <Text style={styles.radioButtonText}>All Requests and Actions</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value={EnumSourceType.Redux}
                status={checked === EnumSourceType.Redux ? 'checked' : 'unchecked'}
                onPress={() => setChecked(EnumSourceType.Redux)}
                testID={'RadioRedux'}
              />
              <Text style={styles.radioButtonText}>Redux Action</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value={EnumSourceType.ReactNativeRequest}
                status={checked === EnumSourceType.ReactNativeRequest ? 'checked' : 'unchecked'}
                onPress={() => setChecked(EnumSourceType.ReactNativeRequest)}
                testID={'RadioRNR'}
              />
              <Text style={styles.radioButtonText}>React Native Requests</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value={EnumSourceType.Nativerequest}
                status={checked === EnumSourceType.Nativerequest ? 'checked' : 'unchecked'}
                onPress={() => setChecked(EnumSourceType.Nativerequest)}
                testID={'RadioNR'}
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
              testID={'ButtonAll'}
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
              testID={'ButtonGet'}
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
              testID={'ButtonPost'}
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
              testID={'ButtonPut'}
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
              testID={'ButtonDel'}
            >
              DEL
            </Button>
          </View>
        </View>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={() => props.onDismiss()} testID={'ButtonDone'}>
            Done
          </Button>
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
