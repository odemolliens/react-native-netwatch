// @ts-nocheck
import * as React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  StyleSheet,
  Share,
  Alert,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
} from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import Item from './Item';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Settings } from './Settings';
import { ILog, SourceType, RequestMethod, EnumSourceType, EnumFilterType } from '../types';
import RNRequest from '../Core/Objects/RNRequest';
import ReduxAction from '../Core/Objects/ReduxAction';
import NRequest from '../Core/Objects/NRequest';
import { getTime, Base64 } from '../Utils/helpers';
import { ThemeContext } from '../Theme';

const x: number = 0;
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

let _positionFlatList = 0;

export const Main = (props: IProps) => {
  const theme = useContext(ThemeContext);
  const refFlatList = useRef(null);
  const [flatListLastOffset, setFlatListLastOffset] = useState<number>(0);
  const [requests, setRequests] = useState<Array<ILog>>([]);
  const [reduxActions, setReduxActions] = useState<Array<ReduxAction>>([]);
  const [rnRequests, setRNRequests] = useState<Array<RNRequest>>([]);
  const [nRequests, setNRequests] = useState<Array<NRequest>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState<SourceType | EnumSourceType>(EnumSourceType.All);
  const [filter, setFilter] = useState<RequestMethod | EnumFilterType>(EnumFilterType.All);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const hideSettingsDialog = () => setSettingsVisible(false);
  const hideDialogAndDelete = () => {
    // clearList();
    setDeleteVisible(false);
  };

  useEffect(() => {
    if (source === EnumSourceType.Redux) {
      if (filter !== EnumFilterType.All) setFilter(EnumFilterType.All);
      const _mergedArrays: Array<ReduxAction> = _removeDuplicate(reduxActions, props.reduxActions);
      setReduxActions(
        _mergedArrays
          .filter((item) => item.type === EnumSourceType.Redux)
          .sort(compare)
          .reverse()
          .slice(0, props.maxRequests - 1 || 99),
      );
    } else if (source === EnumSourceType.ReactNativeRequest) {
      const _mergedArrays: Array<RNRequest> = _removeDuplicate(rnRequests, props.rnRequests);
      setRNRequests(
        _mergedArrays
          .filter((item) => item.type === EnumSourceType.ReactNativeRequest)
          .sort(compare)
          .reverse()
          .slice(0, props.maxRequests - 1 || 99),
      );
    } else if (source === EnumSourceType.Nativerequest) {
      const _mergedArrays: Array<RNRequest> = _removeDuplicate(nRequests, props.nRequests);
      setNRequests(
        _mergedArrays
          .filter((item) => item.type === EnumSourceType.Nativerequest)
          .sort(compare)
          .reverse()
          .slice(0, props.maxRequests - 1 || 99),
      );
    } else {
      const _mergedNewItems = mergeArrays(props.reduxActions, props.rnRequests, props.nRequests);
      const _mergedArrays: Array<ILog> = _removeDuplicate(requests, _mergedNewItems);
      setRequests(
        _mergedArrays
          .sort(compare)
          .reverse()
          .slice(0, props.maxRequests - 1 || 99),
      );
    }

    // TODO: Keep the same color after update for each items
    // TODO: We can add many items during one loop -> we must set the offset to handle that
    // TODO: What if we filtering -> scroll to 0 ?
    if (_positionFlatList > 55) {
      setFlatListLastOffset(_positionFlatList + 60 * 1);
    }
  }, [props.rnRequests, props.reduxActions, props.nRequests, source, filter]);

  useEffect(() => {
    refFlatList?.current?.scrollToOffset({
      animated: false,
      offset: flatListLastOffset,
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

  const _removeDuplicate = (target: ILog[], source: ILog[]): Array<ILog> => {
    const _mergedArrays = mergeArrays(target, source);
    return [...new Set(_mergedArrays)];
  };

  const filteredRequests = (): Array<ILog> => {
    if (source === EnumSourceType.Redux) {
      return reduxActions.filter((item) =>
        JSON.stringify(item.action).toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (source === EnumSourceType.ReactNativeRequest) {
      return rnRequests.filter((item) => filterMethod(item) && searchFilter(item));
    }

    if (source === EnumSourceType.Nativerequest) {
      return nRequests.filter((item) => filterMethod(item) && searchFilter(item));
    }

    if (source === EnumSourceType.All) {
      return requests.filter((item) => {
        if (item instanceof RNRequest || item instanceof NRequest) {
          return filterMethod(item) && searchFilter(item);
        }
        if (item instanceof ReduxAction && filter === EnumFilterType.All) {
          return JSON.stringify(item.action).toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }
  };

  const filterMethod = (item: RNRequest | NRequest): boolean => {
    return item.method === filter || filter === EnumFilterType.All;
  };

  const searchFilter = (item: RNRequest | NRequest): boolean => {
    return (
      item.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status === parseInt(searchQuery) ||
      item.method.toLowerCase() === searchQuery.toLowerCase()
    );
  };

  const clearList = () => {
    props.clearAll();
    setRequests([]);
  };

  const formatSharedMessage = (array: Array<ILog>): string => {
    const _string = '';
    const _report = array.map((item) => {
      Object.values(item).map((text) => {
        if (typeof text === 'string') {
          _string.concat(text, ',');
        } else {
          try {
            _string.concat(text.toString());
          } catch (e) {
            console.error(e);
          }
        }
      });

      // if (item instanceof RNRequest) {
      //   return _string.concat(
      //     getTime(item.startTime),
      //     ' ',
      //     item.method,
      //     ' : ',
      //     item.status.toString(),
      //     ' - ',
      //     item.url
      //   );
      // }

      // if (item instanceof ReduxAction) {
      //   return _string.concat(item.startTime.toString(), ' ', item.action.type, '\n');
      // }
      // return '';
    });
    return _report.join('\n');
  };

  const onShare = async (): Promise<void> => {
    try {
      await Share.share({
        url: `data:text/html;base64,${Base64.btoa('123')}`,
        // message: formatSharedMessage(requests),
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

  const _renderItems = ({ item, index }) => {
    const _color = index % 2 ? theme.gray700 : theme.gray800;
    return (
      <Item
        testID={`${index}`}
        item={item}
        onPress={() => {
          props.onPress(item);
          props.onPressDetail(true);
        }}
        color={_color}
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
            onPress={() =>
              settingsVisible ? setSettingsVisible(false) : props.onPressClose(false)
            }
          />
        </TouchableOpacity>
        <Appbar.Content color={theme.blue500} title="Netwatch" titleStyle={{ fontSize: 18 }} />
        <TouchableOpacity style={[styles.button, { borderLeftWidth: 0 }]}>
          <FeatherIcon name="download" color={theme.white} size={24} onPress={onShare} />
        </TouchableOpacity>
      </Appbar.Header>
      <View style={[styles.options, { backgroundColor: theme.gray800 }]}>
        <Searchbar
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
          onPress={() => setSettingsVisible(!settingsVisible)}
        >
          <FeatherIcon
            name="filter"
            color={
              filter !== EnumFilterType.All || source !== EnumSourceType.All
                ? theme.blue500
                : theme.gray300
            }
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
          style={{ backgroundColor: theme.gray800 }}
          renderItem={_renderItems}
          keyExtractor={(item) => `${item._id.toString()}${item.startTime}${item.type}`}
          // initialScrollIndex = {this.state.initialScrollIndex}
          onScroll={(event: NativeScrollEvent) => {
            _positionFlatList = event.nativeEvent.contentOffset.y;
          }}
          // Fixed Height getItemLayout
          // 60 is the height of the items
          getItemLayout={(data, index) => {
            return { length: 60, offset: 60 * index, index };
          }}
          scrollEventThrottle={5}
          initialListSize={16} // listview optimization
          pageSize={10} // listview optimization
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
