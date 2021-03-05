import * as React from 'react';
import { useContext, useState } from 'react';
import { StyleSheet, View, ScrollView, Share, Alert, TouchableOpacity } from 'react-native';
import { Appbar, Subheading, Snackbar } from 'react-native-paper';
import { tag, reduxTag } from './Status';
import { getStatus, getTime, getShortDate, duration } from '../Utils/helpers';
import { EnumStatus } from '../types';
import RNRequest from '../Core/Objects/RNRequest';
import NRequest from '../Core/Objects/NRequest';
import ReduxAction from '../Core/Objects/ReduxAction';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../Theme';
import { Text, Title } from './Text';
import url from 'url';

export interface IProps {
  testId?: string;
  onPressBack: (showDetails: boolean) => void;
  item: RNRequest | NRequest | ReduxAction;
}

// These attribute will be not added in the detail's scrollview because always displayed in the other components
const excludedAttributes: Array<string> = [
  '_id',
  'type',
  'readyState',
  'method',
  'status',
  'startTime',
  'endTime',
  'dataSent',
  'requestHeaders',
  'responseHeaders',
  'response',
  'responseSize',
  'responseType',
  'responseContentType',
];

const stringifyData = (array: Array<string[]>): string => {
  const _string = '';
  const _result = array
    .filter((item: Array<string>) => !excludedAttributes.includes(item[0]))
    .map((item: Array<string>) => {
      return _string.concat(item[0], ': ', item[1], '\n');
    });
  return _result.join('\n');
};

const formatSharedMessage = (
  general: Array<string[]>,
  requestHeaders: Array<string[]>,
  postData: string,
  responseHeaders: Array<string[]>,
  bodyResponse: string,
): string => {
  const _general = stringifyData(general);
  const _requestHeaders = stringifyData(requestHeaders);
  const _responseHeaders = stringifyData(responseHeaders);
  const _report = ''.concat(
    'GENERAL\n',
    _general,
    '\n',
    'REQUEST HEADERS\n',
    _requestHeaders,
    '\n',
    'REQUEST DATA\n',
    postData,
    '\n',
    'RESPONSE HEADERS\n',
    _responseHeaders,
    '\n',
    'RESPONSE BODY\n',
    bodyResponse,
  );
  return _report;
};

export const Details: React.FC<IProps> = props => {
  const theme = useContext(ThemeContext);
  const [snackBarVisibility, setSnackBarVisibility] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  let _content = null;
  let _color: string = theme.violet700;
  let _action: any = () => {};

  const _onShareRequest = async (
    general: Array<string[]>,
    requestHeaders: Array<string[]>,
    postData: string = '',
    responseHeaders: Array<string[]>,
    bodyResponse: string = '',
  ): Promise<void> => {
    try {
      await Share.share({
        message: formatSharedMessage(general, requestHeaders, postData, responseHeaders, bodyResponse),
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const _onShareReduxAction = async (item: ReduxAction): Promise<void> => {
    const _type = item.action.type.toUpperCase();
    const _payload = JSON.stringify(item.action.payload, null, 2);
    try {
      await Share.share({
        message: `${_type}\n${_payload}`,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const _copyToClipboard = (text: string): void => {
    if (typeof text === 'string') Clipboard.setString(text);
  };

  const _copyClipbutton = (onPress: Function, text: string = '', toastMessage: string = '') => {
    return (
      <TouchableOpacity
        testID="buttonCopyToClipboard"
        style={[{ flexDirection: 'row', borderLeftWidth: 0, alignItems: 'center' }]}
        onPress={() => {
          onPress(text);
          setSnackBarMessage(toastMessage);
          setSnackBarVisibility(true);
        }}
      >
        <MaterialCommunityIcons
          name="clipboard-arrow-left-outline"
          color={theme.blue500}
          size={14}
          testID="buttonCopyToClipBoard"
        />
        <Text style={[{ color: theme.blue500, marginLeft: 6 }]}>Copy</Text>
      </TouchableOpacity>
    );
  };

  const _renderItems = (listOfItems: Array<[string, any]>) => {
    return listOfItems
      .filter((item: Array<string>) => !excludedAttributes.includes(item[0]))
      .filter((item: Array<string>) => item[1] && item[1].length > 0)
      .map((item: Array<string>, index: number) => (
        <View style={{ paddingHorizontal: 16 }} key={index}>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={[{ color: theme.gray500 }]}>{item[0]}</Text>
            {item[0] === 'url' && _copyClipbutton(_copyToClipboard, item[1], 'URL has been copied to clipboard')}
          </View>
          <Text style={[{ width: '100%', marginBottom: 10 }, { color: theme.gray50 }]}>{item[1]}</Text>
        </View>
      ));
  };

  if (props.item instanceof ReduxAction) {
    _action = () => _onShareReduxAction(props.item as ReduxAction);
    _content = (
      <View style={{ flex: 1, width: '100%' }}>
        {/* REDUX + REDUX TAG */}
        <View style={[styles.line]}>
          <Title style={[{ marginRight: 6 }, { color: theme.gray50 }]}>REDUX</Title>
          {reduxTag()}
        </View>

        <View style={[styles.line]}>
          <Text style={{ color: theme.gray500 }}>Started at : </Text>
          <Text>{`${getShortDate(props.item.startTime)} - ${getTime(props.item.startTime)}`}</Text>
        </View>

        <Subheading style={[styles.subheading, { backgroundColor: theme.gray700, color: theme.gray50 }]}>
          Content
        </Subheading>

        <View style={[styles.line]}>
          <Text style={{ color: theme.gray500 }}>Type : </Text>
          <Text>{props.item.action.type}</Text>
        </View>

        <View style={[styles.line]}>
          <Text style={{ color: theme.gray500 }}>Payload : </Text>
          <Text>{JSON.stringify(props.item.action?.payload, null, 2)}</Text>
        </View>
      </View>
    );
  }

  if (props.item instanceof RNRequest || props.item instanceof NRequest) {
    const _generalElements = (props.item && Object.entries(props.item)) || [];
    const _requestHeadersElements = (props.item?.requestHeaders && Object.entries(props.item.requestHeaders)) || [];
    const _responseHeadersElements = (props.item?.responseHeaders && Object.entries(props.item.responseHeaders)) || [];
    _action = () => {
      if (props.item instanceof RNRequest || props.item instanceof NRequest) {
        _onShareRequest(
          _generalElements,
          _requestHeadersElements,
          props.item.dataSent,
          _responseHeadersElements,
          props.item.response,
        );
      }
    };

    const _temp = getStatus(props.item.status);
    if (_temp === EnumStatus.Success) _color = theme.green700;
    if (_temp === EnumStatus.Warning) _color = theme.orange700;
    if (_temp === EnumStatus.Failed) _color = theme.red700;
    const urlObject = url.parse(props.item.url);
    const hostname = urlObject.host || '';

    _content = (
      <View style={{ flex: 1, width: '100%' }}>
        {/* METHOD + STATUS CODE */}
        <View style={[styles.line]}>
          <Title style={[{ marginRight: 6 }, { color: theme.gray50 }]}>{props.item.method}</Title>
          {tag(_color, props.item.status.toString())}
        </View>

        <View style={[styles.line]}>
          <Text style={{ color: theme.gray500 }}>Hostname : </Text>
          <Text>{hostname}</Text>
        </View>

        <View style={[styles.line]}>
          <Text style={{ color: theme.gray500 }}>Started at : </Text>
          <Text>{`${getShortDate(props.item.startTime)} - ${getTime(props.item.startTime)}   ( ${duration(
            props.item.startTime,
            props.item.endTime,
          )}ms )`}</Text>
        </View>

        {_generalElements.length > 0 && (
          <>
            <Subheading style={[styles.subheading, { backgroundColor: theme.gray700, color: theme.gray50 }]}>
              Request Info
            </Subheading>
            {_renderItems(_generalElements)}
          </>
        )}

        {_requestHeadersElements.length > 0 && (
          <>
            <Subheading style={[styles.subheading, { backgroundColor: theme.gray700, color: theme.gray50 }]}>
              Request Headers
            </Subheading>
            {_renderItems(_requestHeadersElements)}
          </>
        )}

        {props.item.dataSent?.length > 0 && (
          <>
            <Subheading style={[styles.subheading, { backgroundColor: theme.gray700, color: theme.gray50 }]}>
              Request Data
            </Subheading>
            <View style={styles.attribtuesContainer}>
              <Text>{props.item?.dataSent}</Text>
            </View>
          </>
        )}

        {_responseHeadersElements.length > 0 && (
          <>
            <Subheading style={[styles.subheading, { backgroundColor: theme.gray700, color: theme.gray50 }]}>
              Response Headers
            </Subheading>
            {_renderItems(_responseHeadersElements)}
          </>
        )}

        {props.item?.response?.length > 0 && (
          <>
            <Subheading style={[styles.subheading, { backgroundColor: theme.gray700, color: theme.gray50 }]}>
              Response Body
            </Subheading>
            <View style={{ flexDirection: 'row-reverse', paddingHorizontal: 16 }}>
              {_copyClipbutton(_copyToClipboard, props.item?.response, 'Response has been copied to clipboard')}
            </View>
            <View style={styles.attribtuesContainer}>
              <Text>{props.item?.response}</Text>
            </View>
          </>
        )}
      </View>
    );
  }

  // Appbar header is repeated here cause we use the absolute position in the style
  // Put this directly in the index.tsx cause that the Appbar will be added
  return (
    <View style={styles.container}>
      <Appbar.Header style={[styles.header, { backgroundColor: theme.gray900 }]}>
        <TouchableOpacity
          style={[styles.button, { borderLeftWidth: 0 }]}
          onPress={() => props.onPressBack(false)}
          testID="buttonBackToMainScreen"
        >
          <FeatherIcon name="arrow-left" color={theme.white} size={24} />
        </TouchableOpacity>
        <Appbar.Content color={theme.blue500} title="Netwatch" titleStyle={{ fontSize: 18 }} />
        <TouchableOpacity
          testID="buttonShare"
          style={[styles.button, { borderLeftWidth: 0 }]}
          onPress={() => _action()}
        >
          <FeatherIcon name="download" color={theme.white} size={24} />
        </TouchableOpacity>
      </Appbar.Header>

      <ScrollView style={{ backgroundColor: theme.gray800 }} contentContainerStyle={styles.scrollview}>
        {_content}
      </ScrollView>
      <Snackbar
        visible={snackBarVisibility}
        onDismiss={() => setSnackBarVisibility(false)}
        duration={3000}
        style={{ backgroundColor: theme.gray50 }}
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
  line: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },

  statusCode: {
    marginLeft: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },

  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  subheading: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
  attribtuesContainer: {
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
