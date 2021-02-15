import * as React from 'react';
import { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Searchbar, Surface, IconButton } from 'react-native-paper';
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

  const clearList = () => {
    logger.clear();
    setRequests(logger.getRequests());
  };

  return (
    <>
      <Appbar.Header>
        <IconButton icon="close" onPress={() => props.onPressClose(false)} />
        <Appbar.Content title="Netwatch" />
      </Appbar.Header>
      <Surface style={styles.surface}>
        <Searchbar
          style={styles.searchBar}
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

      <Settings
        visible={settingsVisible}
        onDismiss={hideDialog}
        source={source}
        onSetSource={setSource}
        filter={filter}
        onSetFilter={setFilter}
        onPressClear={clearList}
      />

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
  searchBar: {
    flex: 1,
    backgroundColor: 'gray',
  },
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
});
