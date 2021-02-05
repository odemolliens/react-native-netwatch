import * as React from 'react';
import { useState } from 'react';
import { Modal, StyleSheet, View, FlatList, SafeAreaView } from 'react-native';
import logger from './LoggerSingleton';
// @ts-ignore
import { Appbar, Searchbar, Surface, List } from 'react-native-paper';
import { en as translation } from './i18n/en';
import Item from './Components/Item';

// Vérifier status 302 (headers)
export interface IProps {
  onPressBack: (visible: boolean) => void;
  visible: boolean;
  enabled: boolean;
}

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [requests, setRequests] = useState(logger.getRequests());
  const [searchQuery, setSearchQuery] = useState('');
  logger.setCallback(setRequests);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const filteredRequests = requests.filter((request) =>
    request.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (logger.isEnabled() && !props.enabled) {
    logger.disableXHRInterception();
  }

  if (!logger.isEnabled() && props.enabled) {
    logger.enableXHRInterception();
  }

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal animationType="slide" visible={props.visible}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => props.onPressBack(false)} />
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
});

// For testing only

function getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let isStarted: boolean = false;
const makeRequestInContinue = (): void => {
  setInterval(() => {
    const key: number = getRndInteger(1, 4);
    let url: string = '';
    switch (key) {
      case 1:
        // Mock StatusCode 200 (delete link: https://designer.mocky.io/manage/delete/1a2d092a-42b2-4a89-a44f-267935dc13e9/BIMk8qNoP2zMvZtx6yQ3u9yGsWoK1g8HyYxO)
        url = 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9';
        break;
      case 2:
        // Mock StatusCode 302 (delete link: https://designer.mocky.io/manage/delete/7ee3fd63-f862-435f-8557-5de3e3d2fa91/4QPNsmOER7ghGDFKPWyIFvNAvGPysyYxkBi2)
        url = 'https://run.mocky.io/v3/7ee3fd63-f862-435f-8557-5de3e3d2fa91';
        break;
      case 3:
        // Mock StatusCode 400 (delete link: https://designer.mocky.io/manage/delete/d810eeaf-26ef-46fc-8e44-79c7df25d268/Rqq8qeKviPA80JI0ujlVJBZtbhRkNPBHYY2U)
        url = 'https://run.mocky.io/v3/d810eeaf-26ef-46fc-8e44-79c7df25d268';
        break;
      default:
        // Mock StatusCode 500 (delete link: https://designer.mocky.io/manage/delete/cea80db8-5848-4ef6-bb05-9c0a1d0971d0/MYZJzMDfg2GxA7jTbrXlbIK0lTzC1rU5U0Mh)
        url = 'https://run.mocky.io/v3/cea80db8-5848-4ef6-bb05-9c0a1d0971d0';
        break;
    }
    fetch(url).catch((e) => console.log(e));
  }, 2000);
};

if (__DEV__) {
  !isStarted &&
    setTimeout(() => {
      makeRequestInContinue();
    }, 2000);
  isStarted = true;
}
