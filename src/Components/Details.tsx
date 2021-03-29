import * as React from 'react';
import { useContext, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Share from 'react-native-share';
import { Appbar, Snackbar } from 'react-native-paper';
import RNRequest from '../Core/Objects/RNRequest';
import NRequest from '../Core/Objects/NRequest';
import ReduxAction from '../Core/Objects/ReduxAction';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../Theme';
import { ActionDetails } from './ActionDetails';
// @ts-ignore
import JSONDetails from './JSONDetails';
import {
  getGeneralElementsAsArray,
  getRequestHeadersElementsAsArray,
  getResponseHeadersElementsAsArray,
  formatSharedMessage,
} from '../Utils/helpers';
import { RequestDetails } from './RequestDetails';
import { ILog } from '../types';

export interface IProps {
  testId?: string;
  onPressBack: (showDetails: boolean) => void;
  item: ILog;
}

export const Details: React.FC<IProps> = props => {
  const theme = useContext(ThemeContext);
  const [snackBarVisibility, setSnackBarVisibility] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [showJSONResponseDetails, setShowJSONResponseDetails] = useState<boolean>(false);
  const [showJSONRequestDetails, setShowJSONRequestDetails] = useState<boolean>(false);
  const [showJSONActionDetails, setShowJSONActionDetails] = useState<boolean>(false);
  let _content = null;
  let _action: any = () => {};

  const _onShareRequest = async (item: RNRequest | NRequest): Promise<void> => {
    try {
      await Share.open({
        message: formatSharedMessage(
          getGeneralElementsAsArray(item),
          getRequestHeadersElementsAsArray(item),
          item.dataSent,
          getResponseHeadersElementsAsArray(item),
          item.response,
        ),
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const _onShareReduxAction = async (item: ReduxAction): Promise<void> => {
    const _type = item.action.type.toUpperCase();
    const _payload = JSON.stringify(item.action.payload, null, 2);
    try {
      await Share.open({
        message: `${_type}\n${_payload}`,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (showJSONActionDetails && props.item instanceof ReduxAction) {
    return (
      <JSONDetails
        title="Action details"
        onPressBack={() => setShowJSONActionDetails(false)}
        data={props.item?.action}
      />
    );
  }

  if (showJSONResponseDetails && (props.item instanceof RNRequest || props.item instanceof NRequest)) {
    return (
      <JSONDetails
        title="Response details"
        onPressBack={() => setShowJSONResponseDetails(false)}
        data={props.item?.response}
      />
    );
  }

  if (showJSONRequestDetails && (props.item instanceof RNRequest || props.item instanceof NRequest)) {
    return (
      <JSONDetails
        title="Request details"
        onPressBack={() => setShowJSONRequestDetails(false)}
        data={props.item?.dataSent}
      />
    );
  }

  if (props.item instanceof ReduxAction) {
    // props.item.action should only contains 2 elements, a type and a payload (not necessary called payload).
    // In consequence, if it's not the type, that could be the payload
    const _infos = Object.entries(props.item.action).filter(value => value[0] !== 'type');
    const _reduxAction = {
      label: (_infos.length > 0 && _infos[0][0]) || undefined,
      payload: (_infos.length > 0 && _infos[0][1]) || undefined,
    };

    _action = () => _onShareReduxAction(props.item as ReduxAction);
    _content = (
      <ActionDetails
        item={props.item}
        reduxAction={_reduxAction}
        onPressViewMore={() => setShowJSONActionDetails(true)}
      />
    );
  }

  if (props.item instanceof RNRequest || props.item instanceof NRequest) {
    _action = () => _onShareRequest(props.item as RNRequest | NRequest);
    _content = (
      <RequestDetails
        item={props.item}
        onPressViewMoreRequest={() => setShowJSONRequestDetails(true)}
        onPressViewMoreResponse={() => setShowJSONResponseDetails(true)}
        setSnackBarMessage={setSnackBarMessage}
        setSnackBarVisibility={setSnackBarVisibility}
      />
    );
  }

  // Appbar header is repeated here cause we use the absolute position in the style
  // Put this directly in the index.tsx cause that the Appbar will be added
  return (
    <View style={styles.container}>
      <Appbar.Header style={[styles.header, { backgroundColor: theme.secondaryDarkColor }]}>
        <TouchableOpacity
          style={[styles.button, { borderLeftWidth: 0 }]}
          onPress={() => props.onPressBack(false)}
          testID="buttonBackToMainScreen"
        >
          <FeatherIcon name="arrow-left" color={theme.textColorOne} size={24} />
        </TouchableOpacity>
        <Appbar.Content color={theme.primaryColor} title="Netwatch" titleStyle={{ fontSize: 18 }} />
        <TouchableOpacity
          testID="buttonShare"
          style={[styles.button, { borderLeftWidth: 0 }]}
          onPress={() => _action()}
        >
          <FeatherIcon name="download" color={theme.textColorOne} size={24} />
        </TouchableOpacity>
      </Appbar.Header>

      <ScrollView style={{ backgroundColor: theme.secondaryColor }} contentContainerStyle={styles.scrollview}>
        {_content}
      </ScrollView>
      <Snackbar
        visible={snackBarVisibility}
        onDismiss={() => setSnackBarVisibility(false)}
        duration={3000}
        style={{ backgroundColor: theme.textColorOne }}
        theme={{
          colors: {
            surface: theme.textColorFour,
          },
        }}
      >
        {snackBarMessage}
      </Snackbar>
    </View>
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

  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },

  scrollview: {
    paddingTop: 26,
    paddingBottom: 20,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: 56,
    borderLeftWidth: 1,
  },
});
