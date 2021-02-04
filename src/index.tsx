import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import logger from './LoggerSingleton';
// @ts-ignore
import { Appbar, Searchbar, Surface, List } from 'react-native-paper';
import { en as translation } from './i18n/en';
import Item from './Components/Item';

export interface IProps {
  customAction?: () => void;
}

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [netwatchVisible, setNetwatchVisible] = useState(false);
  const [netwatchEnabled, setNetwatchEnabled] = useState(true);
  const [requests, setRequests] = useState(logger.getRequests());
  const [searchQuery, setSearchQuery] = useState('');
  logger.setCallback(setRequests);

  // Start NetWatcher
  useEffect(() => {
    if (netwatchEnabled) logger.enableXHRInterception();
    // Else stop watcher (and clean requests ?)
  }, [netwatchEnabled]);

  const _goBack = () => setNetwatchVisible(!netwatchVisible);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const filteredRequests = requests.filter((request) =>
    request.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal animationType="slide" visible={netwatchVisible}>
        <Appbar.Header>
          <Appbar.BackAction onPress={_goBack} />
          <Appbar.Content title={translation.title} />
        </Appbar.Header>
        <Surface style={{ padding: 16 }}>
          <Searchbar
            placeholder={translation.placeholderSearchbar}
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
        </Surface>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              style={{ marginLeft: -8, width: '100%' }}
              keyExtractor={(item) => item._id.toString()}
              data={filteredRequests}
              renderItem={({ item }) => <Item item={item} />}
            />
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setNetwatchVisible(true);
        }}
        testID="buttonDisplayNetwatch"
      >
        <Text style={styles.textStyle}>Display Netwatch</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// For testing only
const formData = new FormData();
formData.append('test', 'hello');
const makeRequest = () => {
  fetch(
    'https://postman-echo.com/post?query=some really long query that goes onto multiple lines so we can test what happens',
    {
      method: 'POST',
      body: JSON.stringify({ test: 'hello' }),
    }
  );
  fetch('https://postman-echo.com/post?formData', {
    method: 'POST',
    body: formData,
  });
  fetch('https://httpstat.us/302');
  fetch('https://httpstat.us/400');
  fetch('https://httpstat.us/500');
  // Non JSON response
  fetch('https://postman-echo.com/stream/2');
  // Test requests that fail
  // fetch('https://failingrequest');
};

if (__DEV__) {
  setTimeout(() => {
    makeRequest();
  }, 2000);
}
