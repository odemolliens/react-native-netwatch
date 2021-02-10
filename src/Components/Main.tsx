import * as React from 'react';
import { useState } from 'react';
// NOTE: React Native Paper modal doesn't work fine - DON'T USE
// NOTE: React Native Paper ToggleButton can't allow add text in the button -> Custom Toggle Button here
import { View, FlatList, StyleSheet, Modal } from 'react-native';
import {
  Dialog,
  Button,
  Appbar,
  Searchbar,
  Surface,
  IconButton,
  Text,
  RadioButton,
} from 'react-native-paper';
import Item from './Item';
import logger from '../Core/LoggerSingleton';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Main = (props: any) => {
  const [requests, setRequests] = useState(logger.getRequests());
  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState('rnr');
  const [filter, setFilter] = useState('all');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const showDialog = () => setSettingsVisible(true);
  const hideDialog = () => setSettingsVisible(false);
  const filteredRequests = requests
    .filter(
      (request) =>
        request.url.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filter === 'all' || request.method.toLowerCase() === filter)
    )
    .reverse();
  logger.setCallback(setRequests);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.onPressBack(false)} />
        <Appbar.Content title="Netwatch" />
      </Appbar.Header>
      <Surface style={styles.surface}>
        <Searchbar
          style={{ flex: 1 }}
          placeholder={'Search'}
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <IconButton
          style={{ marginRight: -8 }}
          icon={() => <Icon color="white" size={24} name="settings"></Icon>}
          size={24}
          onPress={showDialog}
        ></IconButton>
      </Surface>

      <Modal animationType="fade" transparent visible={settingsVisible}>
        <Dialog visible={settingsVisible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Dialog.Title>Settings</Dialog.Title>
            <RadioButton.Group onValueChange={(value) => setSource(value)} value={source}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <RadioButton value="rnr" />
                <Text style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>
                  React Native Requests
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <RadioButton value="nr" />
                <Text style={{ textAlignVertical: 'center', fontWeight: 'bold' }}>
                  Native Requests
                </Text>
              </View>
            </RadioButton.Group>

            <Dialog.Title>Filter</Dialog.Title>
            <View style={styles.toggleButtonGroup}>
              <Button
                labelStyle={[
                  styles.toggleButtonLabel,
                  filter === 'all' && { color: 'white', fontWeight: 'bold' },
                ]}
                style={[styles.toggleButton, filter === 'all' && { opacity: 0.5 }]}
                onPress={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                labelStyle={[
                  styles.toggleButtonLabel,
                  filter === 'get' && { color: 'white', fontWeight: 'bold' },
                ]}
                style={[styles.toggleButton, filter === 'get' && { opacity: 0.5 }]}
                onPress={() => setFilter('get')}
              >
                GET
              </Button>
              <Button
                labelStyle={[
                  styles.toggleButtonLabel,
                  filter === 'post' && { color: 'white', fontWeight: 'bold' },
                ]}
                style={[styles.toggleButton, filter === 'post' && { opacity: 0.5 }]}
                onPress={() => setFilter('post')}
              >
                POST
              </Button>
              <Button
                labelStyle={[
                  styles.toggleButtonLabel,
                  filter === 'put' && { color: 'white', fontWeight: 'bold' },
                ]}
                style={[styles.toggleButton, filter === 'put' && { opacity: 0.5 }]}
                onPress={() => setFilter('put')}
              >
                PUT
              </Button>
              <Button
                labelStyle={[
                  styles.toggleButtonLabel,
                  filter === 'delete' && { color: 'white', fontWeight: 'bold' },
                ]}
                style={[
                  styles.toggleButton,
                  filter === 'delete' && { opacity: 0.5 },
                  { borderRightWidth: 0 },
                ]}
                onPress={() => setFilter('delete')}
              >
                DEL
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Modal>

      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <FlatList
            style={styles.flatList}
            keyExtractor={(item) => item._id.toString()}
            data={filteredRequests}
            renderItem={({ item }) => (
              <Item
                item={item}
                onPress={() => {
                  props.onPress(item);
                  props.onPressDetail(true);
                }}
              />
            )}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatList: {
    marginLeft: -8,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalView: {
    width: '100%',
    height: '100%',
  },
  toggleButtonGroup: {
    minHeight: 38,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 5,
  },
  toggleButton: {
    borderRightWidth: 0.5,
    borderColor: 'white',
  },
  toggleButtonLabel: {
    color: 'white',
  },
});
