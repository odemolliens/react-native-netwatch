import * as React from 'react';
import { useContext, useState } from 'react';
import { StyleSheet, View, ScrollView, Share, Alert, TouchableOpacity, Image } from 'react-native';
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
  'stringifiedAction',
  'shortUrl',
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
  const [onErrorImage, setOnErrorImage] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  let _content = null;
  let _color: string = theme.reduxColor;
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
          color={theme.primaryColor}
          size={14}
          testID="buttonCopyToClipBoard"
        />
        <Text style={[{ color: theme.primaryColor, marginLeft: 6 }]}>Copy</Text>
      </TouchableOpacity>
    );
  };

  const _renderItems = (listOfItems: Array<[string, any]>) => {
    return listOfItems
      .filter((item: Array<string>) => item.length > 1) // To be sure that item has at least two element
      .filter((item: Array<string>) => !excludedAttributes.includes(item[0]))
      .filter((item: Array<string>) => item[1] && item[1].length > 0)
      .map((item: Array<string>, index: number) => {
        return (
          <View style={styles.itemContainer} key={index}>
            {item[1].startsWith('data:image/') ? (
              _renderImage(item[1])
            ) : (
              <>
                <View style={styles.attribute}>
                  <Text style={[{ color: theme.textColorFour }]}>{item[0]}</Text>
                  {item[0] === 'url' && _copyClipbutton(_copyToClipboard, item[1], 'URL has been copied to clipboard')}
                </View>
                <Text style={[{ width: '100%' }, { color: theme.textColorOne }]}>{item[1]}</Text>
              </>
            )}
          </View>
        );
      });
  };

  const _renderErrorMessage = () => {
    return <Text>An error occur, cannot load the image</Text>;
  };

  const _renderImage = (source: string) => {
    return (
      <>
        {onErrorImage ? (
          _renderErrorMessage()
        ) : (
          <View style={{ minHeight: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: source }}
              style={{ width: '80%', height: '100%' }}
              resizeMode="contain"
              onError={() => setOnErrorImage(true)}
            />
          </View>
        )}
      </>
    );
  };

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
      <View style={{ flex: 1, width: '100%' }}>
        {/* REDUX + REDUX TAG */}
        <View style={[styles.line]}>
          <Title style={[{ marginRight: 6 }, { color: theme.textColorOne }]}>REDUX</Title>
          {reduxTag()}
        </View>

        <View style={[styles.line]}>
          <Text style={{ color: theme.textColorFour }}>Started at : </Text>
          <Text>{`${getShortDate(props.item.startTime)} - ${getTime(props.item.startTime)}`}</Text>
        </View>

        <Subheading
          style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
        >
          Content
        </Subheading>

        <View style={[styles.line]}>
          <Text style={{ color: theme.textColorFour }}>Type : </Text>
          <Text>{props.item.action.type}</Text>
        </View>

        <View style={[styles.line]}>
          {_reduxAction.label && (
            <Text style={{ color: theme.textColorFour }}>{`${_reduxAction.label
              .charAt(0)
              .toUpperCase()}${_reduxAction.label.slice(1)} :`}</Text>
          )}
          {_reduxAction.payload && <Text>{JSON.stringify(_reduxAction.payload, null, 2)}</Text>}
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
    if (_temp === EnumStatus.Success) _color = theme.successColor;
    if (_temp === EnumStatus.Warning) _color = theme.warningColor;
    if (_temp === EnumStatus.Failed) _color = theme.failedColor;
    const urlObject = url.parse(props.item.url, true);
    const hostname = urlObject.host || '';
    const _params = Object.entries(urlObject.query);

    _content = (
      <View style={{ flex: 1, width: '100%' }}>
        {/* METHOD + STATUS CODE */}
        <View style={[styles.line]}>
          <Title style={[{ marginRight: 6 }, { color: theme.textColorOne }]}>{props.item.method}</Title>
          {tag(_color, props.item.status.toString())}
        </View>

        <View style={[styles.line]}>
          <Text style={{ color: theme.textColorFour }}>Hostname : </Text>
          <Text>{hostname}</Text>
        </View>

        <View style={[styles.line]}>
          <Text style={{ color: theme.textColorFour }}>Started at : </Text>
          <Text>{`${getShortDate(props.item.startTime)} - ${getTime(props.item.startTime)}   ( ${duration(
            props.item.startTime,
            props.item.endTime,
          )}ms )`}</Text>
        </View>

        {typeof props.item.timeout === 'number' && (
          <View style={[styles.line]}>
            <Text style={{ color: theme.textColorFour }}>Timeout : </Text>
            <Text>{props.item?.timeout.toString()}</Text>
          </View>
        )}

        {_generalElements.length > 0 && (
          <>
            <Subheading
              style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
            >
              Request Info
            </Subheading>
            {_renderItems(_generalElements)}
          </>
        )}

        {_params.length > 0 && (
          <>
            <Subheading
              style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
            >
              Request Params
            </Subheading>
            {_renderItems(_params)}
          </>
        )}

        {_requestHeadersElements.length > 0 && (
          <>
            <Subheading
              style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
            >
              Request Headers
            </Subheading>
            {_renderItems(_requestHeadersElements)}
          </>
        )}

        {props.item.dataSent?.length > 0 && props.item.dataSent !== 'undefined' && props.item.dataSent !== 'null' && (
          <>
            <Subheading
              style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
            >
              Request Data
            </Subheading>
            <View style={styles.attribtuesContainer}>
              <Text>{props.item?.dataSent}</Text>
            </View>
          </>
        )}

        {_responseHeadersElements.length > 0 && (
          <>
            <Subheading
              style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
            >
              Response Headers
            </Subheading>
            {_renderItems(_responseHeadersElements)}
          </>
        )}

        {props.item?.response?.length > 0 && props.item.dataSent !== 'undefined' && props.item.dataSent !== 'null' && (
          <>
            <Subheading
              style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
            >
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
  line: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },

  attribute: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  itemContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
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
