import * as React from 'react';
import { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Searchbar, Surface, IconButton } from 'react-native-paper';
import Item from './Item';
import logger from '../Core/LoggerSingleton';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Main = (props: any) => {
  const [requests, setRequests] = useState(logger.getRequests());
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const filteredRequests = requests.filter((request) =>
    request.url.toLowerCase().includes(searchQuery.toLowerCase())
  );
  logger.setCallback(setRequests);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.onPressBack(false)} />
        <Appbar.Content title="Netwatch" />
      </Appbar.Header>
      <Surface style={styles.surface}>
        <Searchbar style={{ flex: 1 }} placeholder={'Search'} onChangeText={onChangeSearch} value={searchQuery} />
        <IconButton
          style= {{ marginRight: -8 }}
          icon={() => <Icon size={24} name="settings"></Icon>}
          size={24}
          onPress={() => console.log('test')}
        ></IconButton>
      </Surface>
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
    alignItems: 'center'
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
