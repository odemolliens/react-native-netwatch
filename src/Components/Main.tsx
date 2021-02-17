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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Settings } from './Settings';
import { ILog, SourceType, RequestMethod, EnumSourceType, EnumFilterType } from '../types';
import RNRequest from '../Core/Objects/RNRequest';
import ReduxAction from '../Core/Objects/ReduxAction';

export interface IProps {
  testId?: string;
  onPress: Function;
  onPressClose: (value: boolean) => void;
  onPressDetail: (value: boolean) => void;
  visible?: boolean;
  reduxActions: ReduxAction[];
  rnRequests: RNRequest[];
  clearAll: Function;
  maxRequests?: number;
}

let reduxList: ReduxAction[] = [];
let rnList: RNRequest[] = [];
// let nList: NRequest[] = [];

export const Main = (props: IProps) => {
  const [requests, setRequests] = useState<Array<ILog>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState<SourceType | EnumSourceType>(EnumSourceType.All);
  const [filter, setFilter] = useState<RequestMethod | EnumFilterType>(EnumFilterType.All);
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
    if (source === EnumSourceType.Redux) {
      if (filter !== EnumFilterType.All) setFilter(EnumFilterType.All);
      reduxList = [...props.reduxActions];
      setRequests(reduxList);
    } else if (source === EnumSourceType.ReactNativeRequest) {
      rnList = [...props.rnRequests];
      setRequests(rnList);
    } else if (source === EnumSourceType.Nativerequest) {
      setRequests([]);
      // nList = [...props.nRequests.reverse()].slice(0, maxRequests);
      // setRequests(nList);
    } else {
      setRequests(mergeArrays(props.reduxActions, props.rnRequests).sort(compare).reverse());
    }
    return () => {};
  }, [props.rnRequests, props.reduxActions]);

  const mergeArrays = (...arrays: Array<ILog[]>) => {
    return [...arrays.flat()];
  };

  const compare = (a: ILog, b: ILog) => {
    const startTimeA = a.startTime;
    const startTimeB = b.startTime;

    let comparison = 0;
    if (startTimeA > startTimeB) {
      comparison = 1;
    } else if (startTimeA < startTimeB) {
      comparison = -1;
    }
    return comparison;
  };

  const filteredRequests = requests.slice(0, props.maxRequests).filter((request) => {
    if (filter === EnumFilterType.All) {
      if (request instanceof ReduxAction) {
        return request.action.type.toLowerCase().includes(searchQuery.toLowerCase());
      }
    }
    // TODO: Add  || request instanceof NRequest when Native request will be available
    if (request instanceof RNRequest) {
      if (filter === request.method || filter === EnumFilterType.All) {
        return (
          request.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.status === parseInt(searchQuery) ||
          request.method.toLowerCase() === searchQuery.toLowerCase()
        );
      }
    }
    return;
  });

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
          icon={() => <Icon color="white" size={24} name="delete" />}
          size={24}
          onPress={showDialogDelete}
        />
        <IconButton
          style={{ marginRight: -8 }}
          icon={() => <Icon color="white" size={24} name="settings" />}
          size={24}
          onPress={showDialog}
        />
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
            keyExtractor={(item) => `${item._id.toString()}${item.startTime}`}
            data={filteredRequests}
            renderItem={({ item }) => {
              if (item instanceof ReduxAction) {
                return <ReduxItem item={item} />;
              } else if (item instanceof RNRequest) {
                return (
                  <Item
                    item={item}
                    onPress={() => {
                      props.onPress(item);
                      props.onPressDetail(true);
                    }}
                  />
                );
              }
              return null;
            }}
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
