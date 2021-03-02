import * as React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, FlatList, Share, Keyboard } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import Item from './Item';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Settings } from './Settings';
import { ILog, SourceType, RequestMethod, EnumSourceType, EnumFilterType } from '../types';
import RNRequest from '../Core/Objects/RNRequest';
import ReduxAction from '../Core/Objects/ReduxAction';
import NRequest from '../Core/Objects/NRequest';
import { ThemeContext } from '../Theme';

export interface IProps {
  testId?: string;
  onPress: Function;
  onPressClose: (value: boolean) => void;
  onPressDetail: (value: boolean) => void;
  visible?: boolean;
  reduxActions: ReduxAction[];
  rnRequests: RNRequest[];
  nRequests: NRequest[];
  clearAll: Function;
  maxRequests?: number;
}

const _positionFlatList = 0;

export const Main = (props: IProps) => {
  const theme = useContext(ThemeContext);
  const refFlatList = useRef<FlatList<any>>(null);
  const [flatListLastOffset, setFlatListLastOffset] = useState<number>(0);
  const [requests, setRequests] = useState<Array<ILog>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [source, setSource] = useState<SourceType | EnumSourceType>(EnumSourceType.All);
  const [filter, setFilter] = useState<RequestMethod | EnumFilterType>(EnumFilterType.All);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const hideDialogAndDelete = () => {
    clearList();
    if (deleteVisible) setDeleteVisible(false);
  };

  useEffect(() => {
    if (source === EnumSourceType.Redux) {
      if (filter !== EnumFilterType.All) setFilter(EnumFilterType.All);
      setRequests(props.reduxActions);
    } else if (source === EnumSourceType.ReactNativeRequest) {
      setRequests(props.rnRequests);
    } else if (source === EnumSourceType.Nativerequest) {
      setRequests(props.nRequests.sort(compare).reverse());
    } else {
      setRequests(mergeArrays(props.reduxActions, props.rnRequests, props.nRequests).sort(compare).reverse());
    }

    // TODO: Keep the same color after update for each items
    // TODO: We can add many items during one loop -> we must set the offset to handle that
    // TODO: What if we filtering -> scroll to 0 ?
    if (_positionFlatList > 55) {
      setFlatListLastOffset(_positionFlatList);
    }
  }, [props.rnRequests, props.reduxActions, props.nRequests, source, filter]);

  useEffect(() => {
    refFlatList?.current?.scrollToOffset({
      animated: false,
      offset: flatListLastOffset + 60 * 1,
    });
  }, [flatListLastOffset]);

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

  const filteredRequests = (): Array<any> =>
    requests.slice(0, props.maxRequests).filter(request => {
      if (filter === EnumFilterType.All) {
        if (request instanceof ReduxAction) {
          return JSON.stringify(request.action).toLowerCase().includes(searchQuery.toLowerCase());
        }
      }
      if (request instanceof RNRequest || request instanceof NRequest) {
        if (request.type === EnumSourceType.ReactNativeRequest) {
          if (filter === request.method || filter === EnumFilterType.All) {
            return (
              request.type === EnumSourceType.ReactNativeRequest &&
              (request.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.status === parseInt(searchQuery, 10) ||
                request.method.toLowerCase() === searchQuery.toLowerCase())
            );
          }
        } else {
          if (filter === request.method || filter === EnumFilterType.All) {
            return (
              request.type === EnumSourceType.Nativerequest &&
              (request.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.status === parseInt(searchQuery, 10) ||
                request.method.toLowerCase() === searchQuery.toLowerCase())
            );
          }
        }
      }
      return false;
    });

  const clearList = () => {
    props.clearAll();
    setRequests([]);
  };

  const formatSharedMessage = (array: Array<ILog>): string => {
    const _report = array.map(item => {
      return Object.values(item).flat().join(';');
    });
    return _report.join('\n');
  };

  const onShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: formatSharedMessage(requests),
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const onDelete = () => {
    Alert.alert('Warning', 'Do you really want clear the call list?', [
      {
        text: 'Cancel',
        onPress: () => setDeleteVisible(false),
        style: 'cancel',
      },
      { text: 'OK', onPress: hideDialogAndDelete },
    ]);
  };

  const _renderItems = (_props: { item: ReduxAction | RNRequest | NRequest; index: number }) => {
    return (
      <Item
        testID={`${_props.index}`}
        item={_props.item}
        onPress={() => {
          props.onPress(_props.item);
          props.onPressDetail(true);
        }}
        color={theme.gray800}
      />
    );
  };

  return (
    <>
      <Appbar.Header style={[styles.header, { backgroundColor: theme.gray900 }]}>
        <TouchableOpacity style={[styles.button, { borderLeftWidth: 0 }]}>
          <FeatherIcon
            name="x"
            color={theme.white}
            size={24}
            onPress={() => (settingsVisible ? setSettingsVisible(false) : props.onPressClose(false))}
          />
        </TouchableOpacity>
        <Appbar.Content color={theme.blue500} title="Netwatch" titleStyle={{ fontSize: 18 }} />
        <TouchableOpacity style={[styles.button, { borderLeftWidth: 0 }]}>
          <FeatherIcon name="download" color={theme.white} size={24} onPress={onShare} />
        </TouchableOpacity>
      </Appbar.Header>
      <View style={[styles.options, { backgroundColor: theme.gray800 }]}>
        <Searchbar
          onFocus={() => {
            setSettingsVisible(false);
          }}
          onChange={() => {
            setSettingsVisible(false);
          }}
          placeholderTextColor={theme.gray400}
          iconColor={theme.gray500}
          inputStyle={{ color: theme.gray400 }}
          style={[styles.searchBar, { backgroundColor: theme.gray800 }]}
          placeholder={'Search'}
          onChangeText={onChangeSearch}
          value={searchQuery}
        />

        <TouchableOpacity
          testID="showDetailsButton"
          style={[
            styles.button,
            {
              borderLeftColor: theme.gray900,
              backgroundColor: settingsVisible ? theme.gray900 : theme.gray800,
            },
          ]}
          onPress={() => {
            Keyboard.dismiss();
            setSettingsVisible(!settingsVisible);
          }}
        >
          <FeatherIcon
            name="filter"
            color={filter !== EnumFilterType.All || source !== EnumSourceType.All ? theme.blue500 : theme.gray300}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          testID="deleteListButton"
          style={[styles.button, { borderLeftColor: theme.gray900 }]}
          onPress={onDelete}
        >
          <FeatherIcon name="trash-2" color={theme.gray300} size={24} />
        </TouchableOpacity>
      </View>

      {settingsVisible ? (
        <Settings source={source} onSetSource={setSource} filter={filter} onSetFilter={setFilter} />
      ) : (
        <FlatList
          ref={refFlatList}
          maintainVisibleContentPosition={{
            autoscrollToTopThreshold: 10,
            minIndexForVisible: 1,
          }}
          style={{ backgroundColor: theme.gray800 }}
          renderItem={_renderItems}
          keyExtractor={item => `${item._id.toString()}${item.startTime}${item.type}`}
          data={filteredRequests()}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
  },
  options: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: 56,
    borderLeftWidth: 1,
  },
});
