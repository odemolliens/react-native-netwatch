import * as React from 'react';
import { useState } from 'react';
import { View, FlatList, StyleSheet, Modal } from 'react-native';
import {
  Appbar,
  Searchbar,
  Surface,
  IconButton,
  Dialog,
  Paragraph,
  Button,
} from 'react-native-paper';
import Item from './Item';
import logger from '../Core/LoggerSingleton';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Settings } from '../Components/Settings';

interface IProps {
  testId?: string;
  onPress: Function;
  onPressClose: (value: boolean) => void;
  onPressDetail: (value: boolean) => void;
}

export const Main = (props: IProps) => {
  const [requests, setRequests] = useState(logger.getRequests());
  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState('rnr');
  const [filter, setFilter] = useState('all');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const showDialog = () => setSettingsVisible(true);
  const hideSettingsDialog = () => setSettingsVisible(false);
  const showDialogDelete = () => setDeleteVisible(true);
  const hideDialogDelete = () => setDeleteVisible(false);
  const hideDialogAndDelete = () => {
    clearList()
    hideDialogDelete()
  }
  const filteredRequests = requests
    .filter(
      (request) =>
        (request.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.status === parseInt(searchQuery) ||
          request.method === searchQuery) &&
        (filter === 'all' || request.method.toLowerCase() === filter)
    )
    .reverse();
  logger.setCallback(setRequests);

  const clearList = () => {
    logger.clear();
    setRequests(logger.getRequests());
  };

  return (
    <>
      <Appbar.Header style={styles.header}>
        <IconButton color="white" icon="close" onPress={() => props.onPressClose(false)} />
        <Appbar.Content title="Netwatch" />
      </Appbar.Header>
      <Surface style={styles.surface}>
        <Searchbar
          placeholderTextColor="white"
          iconColor="white"
          inputStyle={styles.searchBarInputStyle}
          style={styles.searchBar}
          placeholder={'Search'}
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <IconButton
          // style={{ marginRight: -8 }}
          icon={() => <Icon color="white" size={24} name="delete"></Icon>}
          size={24}
          onPress={showDialogDelete}
        ></IconButton>
        <IconButton
          style={{ marginRight: -8 }}
          icon={() => <Icon color="white" size={24} name="settings"></Icon>}
          size={24}
          onPress={showDialog}
        ></IconButton>
      </Surface>

      <Settings
        visible={settingsVisible}
        onDismiss={hideSettingsDialog}
        source={source}
        onSetSource={setSource}
        filter={filter}
        onSetFilter={setFilter}
        onPressClear={clearList}
      />

      <Modal animationType="fade" transparent visible={deleteVisible}>
        <Dialog visible={deleteVisible} onDismiss={hideDialogDelete}>
          <Dialog.Title>WARNING</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Do you really want clear the call list?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialogDelete}>CANCEL</Button>
            <Button onPress={hideDialogAndDelete}>OK</Button>
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
  header: {
    backgroundColor: '#212121',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#616161',
    color: 'white',
  },
  searchBarInputStyle: {
    color: 'white',
  },
  surface: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#212121',
  },
  flatList: {
    width: '100%',
    backgroundColor: '#bdbdbd',
    padding: 0,
    margin: 0,
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
});
