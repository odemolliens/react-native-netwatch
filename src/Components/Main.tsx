import * as React from 'react';
import { useState, useEffect } from 'react';
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
import ReduxItem from './ReduxItem';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Settings } from '../Components/Settings';
import { ILog, SourceType, RequestMethod } from '../types';
import { _RNLogger } from '../index';
import RNRequest from '../Core/Objects/RNRequest';
import ReduxAction from '../Core/Objects/ReduxAction';

const maxRequests: number = 20;

interface IProps {
  testId?: string;
  onPress: Function;
  onPressClose: (value: boolean) => void;
  onPressDetail: (value: boolean) => void;
  visible?: boolean;
  reduxActions: ReduxAction[];
  rnRequests: RNRequest[];
  clearAll: Function;
}

export const Main = (props: IProps) => {
  const [requests, setRequests] = useState<Array<ILog>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState<SourceType>('ALL');
  const [filter, setFilter] = useState<RequestMethod | 'ALL'>('ALL');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const showDialog = () => setSettingsVisible(true);
  const hideSettingsDialog = () => setSettingsVisible(false);
  const showDialogDelete = () => setDeleteVisible(true);
  const hideDialogDelete = () => setDeleteVisible(false);
  const hideDialogAndDelete = () => {
    clearList();
    hideDialogDelete();
  };

  useEffect(() => {
    if (source === 'REDUX') {
      setRequests(props.reduxActions.slice(0, maxRequests));
    } else if (source === 'RNR') {
      setRequests(props.rnRequests.slice(0, maxRequests));
    } else if (source === 'NR') {
      // setRequests(nRequests.reverse().slice(0, maxRequests));
    } else {
      setRequests([...props.reduxActions, ...props.rnRequests].slice(0, maxRequests));
      // setRequests([...props.rnRequests, ...props.reduxActions, ...props.nRequests].reverse().slice(0, maxRequests));
    }
    return () => {};
  }, [props.rnRequests, props.reduxActions]);

  const filteredRequests = requests
    .filter((element) => source === 'ALL' || element.type === source)
    .filter(
      (request) =>
        request.type === 'REDUX' ||
        (request.type !== 'REDUX' &&
          (request.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.status === parseInt(searchQuery) ||
            request.method === searchQuery) &&
          (filter === 'ALL' || request.method.toLowerCase() === filter))
    )
    .reverse();

  const clearList = () => {
    props.clearAll();
    setRequests([]);
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
            keyExtractor={(item) => `${item._id.toString()}${item.date}`}
            data={filteredRequests}
            renderItem={({ item }) =>
              item.type === 'RNR' || item.type === 'NR' ? (
                <Item
                  item={item}
                  onPress={() => {
                    props.onPress(item);
                    props.onPressDetail(true);
                  }}
                />
              ) : (
                <ReduxItem item={item} />
              )
            }
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
