import * as React from 'react';
import { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Searchbar, Surface } from 'react-native-paper';
import { en as translation } from '../i18n/en';
import Item from '../Components/Item';
import logger from '../LoggerSingleton';

export const Logger = (props: any) => {
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
        <Appbar.Content title={translation.title} />
      </Appbar.Header>
      <Surface style={styles.surface}>
        <Searchbar
          placeholder={translation.placeholderSearchbar}
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
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
