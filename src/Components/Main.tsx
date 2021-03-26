import * as React from 'react';
import { useEffect, useContext } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import Share from 'react-native-share';
import { Appbar, Searchbar, ActivityIndicator } from 'react-native-paper';
import Item, { ITEM_HEIGHT } from './Item';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Settings } from './Settings';
import { ILog, SourceType, RequestMethod, EnumSourceType, EnumFilterType, EnumStatus } from '../types';
import RNRequest from '../Core/Objects/RNRequest';
import ReduxAction from '../Core/Objects/ReduxAction';
import NRequest from '../Core/Objects/NRequest';
import ConnectionInfo from '../Core/Objects/ConnectionInfo';
import { ThemeContext } from '../Theme';
import { xlsxWriter, formatDatas, mergeArrays, compare, getStatus } from '../Utils/helpers';
import { Indicator } from './Indicator';

export interface IProps {
  testId?: string;
  onPress: Function;
  onPressClose: (value: boolean) => void;
  onPressDetail: (value: boolean) => void;
  reduxActions: ReduxAction[];
  rnRequests: RNRequest[];
  nRequests: NRequest[];
  connections: ConnectionInfo[];
  clearAll: Function;
  maxRequests?: number;
}

interface IStats {
  success: number;
  warning: number;
  failed: number;
}

export const Main = (props: IProps) => {
  const theme = useContext(ThemeContext);
  const [requests, setRequests] = React.useState<Array<ILog>>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [source, setSource] = React.useState<SourceType | EnumSourceType>(EnumSourceType.All);
  const [filter, setFilter] = React.useState<RequestMethod | EnumFilterType>(EnumFilterType.All);
  const [stats, setStats] = React.useState<IStats>({
    success: 100,
    warning: 0,
    failed: 0,
  });
  const [settingsVisible, setSettingsVisible] = React.useState(false);
  const [deleteVisible, setDeleteVisible] = React.useState<boolean>(false);
  const [loadingXLSX, setloadingXLSX] = React.useState<boolean>(false);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const hideDialogAndDelete = () => {
    clearList();
    if (deleteVisible) setDeleteVisible(false);
  };

  useEffect(() => {
    let _requests: ILog[] = [];
    if (source === EnumSourceType.Redux) {
      if (filter !== EnumFilterType.All) setFilter(EnumFilterType.All);
      _requests = props.reduxActions;
    } else if (source === EnumSourceType.ReactNativeRequest) {
      _requests = props.rnRequests;
    } else if (source === EnumSourceType.Nativerequest) {
      _requests = props.nRequests.sort(compare).reverse();
    } else {
      _requests = mergeArrays(props.reduxActions, props.rnRequests, props.nRequests, props.connections)
        .sort(compare)
        .reverse()
        .slice(0, props.maxRequests);
    }

    let _filteredRequests: ILog[] = _requests;
    if (filter !== EnumFilterType.All) {
      _filteredRequests = _requests.filter((request: ILog) => {
        return (request instanceof RNRequest || request instanceof NRequest) && filter === request.method;
      });
    }

    let _searchedRequests: ILog[] = _filteredRequests;
    if (searchQuery !== '') {
      _searchedRequests = _filteredRequests.filter((request: ILog) => {
        if (request instanceof RNRequest || request instanceof NRequest) {
          return (
            request.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.status === parseInt(searchQuery, 10) ||
            request.method.toLowerCase() === searchQuery.toLowerCase()
          );
        }

        if (request instanceof ReduxAction) {
          return JSON.stringify(request.action).toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }

    setRequests(_searchedRequests);
  }, [props.rnRequests, props.reduxActions, props.nRequests, props.connections, source, filter, searchQuery]);

  React.useEffect(() => {
    if (loadingXLSX) onShare();
  }, [loadingXLSX]);

  React.useEffect(() => {
    let _global = 0;
    let _success = 0;
    let _warning = 0;
    let _failed = 0;

    requests.map(item => {
      if (item instanceof RNRequest || item instanceof NRequest) {
        switch (getStatus(item.status)) {
          case EnumStatus.Success:
            _success++;
            break;
          case EnumStatus.Warning:
            _warning++;
            break;
          default:
            _failed++;
            break;
        }
      }
    });

    _global = _success + _warning + _failed;
    const result = {
      success: (_success * 100) / _global,
      warning: (_warning * 100) / _global,
      failed: (_failed * 100) / _global,
    };

    setStats(result);
  }, [requests]);

  const clearList = () => {
    props.clearAll();
    setRequests([]);
  };

  const onShare = async () => {
    const message = formatDatas(requests);
    if (message.length === 0) return;
    try {
      const path = await xlsxWriter(message);
      setloadingXLSX(false);
      await Share.open({
        title: 'Export calls to XLSX',
        url: `file://${path}`,
        type: 'text/csv',
        // excludedActivityTypes: []
      });
    } catch (error) {
      // if user dismiss sharing
      setloadingXLSX(false);
      console.error(error.message);
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

  const _renderItems = (_props: { item: ILog; index: number }) => {
    return (
      <Item
        testID={`${_props.index}`}
        item={_props.item}
        onPress={() => {
          props.onPress(_props.item);
          props.onPressDetail(true);
        }}
        color={theme.secondaryColor}
      />
    );
  };

  const _keyExtractor = (item: ILog) => `${item._id.toString()}${item.startTime}${item.type}`;

  const _getItemLayout = (_data: any, index: number) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });

  return (
    <>
      <Appbar.Header style={[styles.header, { backgroundColor: theme.secondaryDarkColor }]}>
        <TouchableOpacity style={[styles.button, { borderLeftWidth: 0 }]}>
          <FeatherIcon
            name="x"
            color={theme.textColorOne}
            size={24}
            onPress={() => (settingsVisible ? setSettingsVisible(false) : props.onPressClose(false))}
          />
        </TouchableOpacity>
        <Appbar.Content color={theme.primaryColor} title="Netwatch" titleStyle={{ fontSize: 18 }} />
        {loadingXLSX ? (
          <ActivityIndicator
            animating={true}
            color={theme.primaryColor}
            style={[styles.button, { borderLeftWidth: 0 }]}
          />
        ) : (
          <TouchableOpacity style={[styles.button, { borderLeftWidth: 0 }]}>
            <FeatherIcon name="download" color={theme.textColorOne} size={24} onPress={() => setloadingXLSX(true)} />
          </TouchableOpacity>
        )}
      </Appbar.Header>
      <View style={[styles.options, { backgroundColor: theme.secondaryColor }]}>
        <Searchbar
          onFocus={() => {
            setSettingsVisible(false);
          }}
          onChange={() => {
            setSettingsVisible(false);
          }}
          placeholderTextColor={theme.textColorThree}
          iconColor={theme.textColorFour}
          inputStyle={{ color: theme.textColorThree }}
          style={[styles.searchBar, { backgroundColor: theme.secondaryColor }]}
          placeholder={'Search'}
          onChangeText={onChangeSearch}
          value={searchQuery}
        />

        <TouchableOpacity
          testID="showSettingsButton"
          style={[
            styles.button,
            {
              borderLeftColor: theme.secondaryDarkColor,
              backgroundColor: settingsVisible ? theme.secondaryDarkColor : theme.secondaryColor,
            },
          ]}
          onPress={() => {
            Keyboard.dismiss();
            setSettingsVisible(!settingsVisible);
          }}
        >
          <FeatherIcon
            name="filter"
            color={
              filter !== EnumFilterType.All || source !== EnumSourceType.All ? theme.primaryColor : theme.textColorTwo
            }
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          testID="deleteListButton"
          style={[styles.button, { borderLeftColor: theme.secondaryDarkColor }]}
          onPress={onDelete}
        >
          <FeatherIcon name="trash-2" color={theme.textColorTwo} size={24} />
        </TouchableOpacity>
      </View>

      {settingsVisible ? (
        <Settings source={source} onSetSource={setSource} filter={filter} onSetFilter={setFilter} />
      ) : (
        <>
          {source === EnumSourceType.Redux ? (
            <View style={[styles.indicatorPlaceholder, { backgroundColor: theme.reduxColor }]} />
          ) : (
            <Indicator success={stats.success} warning={stats.warning} failed={stats.failed} />
          )}
          <FlatList
            testID="itemsList"
            maintainVisibleContentPosition={{
              autoscrollToTopThreshold: 10,
              minIndexForVisible: 1,
            }}
            getItemLayout={_getItemLayout}
            style={{ backgroundColor: theme.secondaryColor }}
            renderItem={_renderItems}
            keyExtractor={_keyExtractor}
            data={requests}
            initialNumToRender={20}
            maxToRenderPerBatch={30}
            updateCellsBatchingPeriod={70}
            removeClippedSubviews
          />
        </>
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
  indicatorPlaceholder: {
    height: 6,
    width: '100%',
  },
});
