import * as React from 'react';
import { useContext, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Subheading } from 'react-native-paper';
import {
  getTime,
  getShortDate,
  isLongText,
  addEllipsis,
  getStatus,
  duration,
  getGeneralElementsAsArray,
  getRequestHeadersElementsAsArray,
  getResponseHeadersElementsAsArray,
  excludedAttributesForExport,
} from '../Utils/helpers';
import { Text, Title } from './Text';
import { tag } from './Status';
import { ThemeContext } from '../Theme';
import { NRequest } from '../Core/Objects/NRequest';
import { RNRequest } from '../Core/Objects/RNRequest';
import { EnumStatus } from '../types';
import url from 'url';
// @ts-ignore
import JSONDetails from './JSONDetails';
import { ViewMoreButton } from './ViewMoreButton';
import Clipboard from '@react-native-clipboard/clipboard';
import ClipboardButton from './ClipboardButton';

export interface IProps {
  testId?: string;
  item: NRequest | RNRequest;
  onPressViewMoreRequest: (value: boolean) => void;
  onPressViewMoreResponse: (value: boolean) => void;
  setSnackBarMessage: (value: string) => void;
  setSnackBarVisibility: (value: boolean) => void;
}

// This component is specif to request (React-Native or Native).
// If you need the componant which handle the Redux action, see
// ActionDetails.tsx
export const RequestDetails: React.FC<IProps> = (props: IProps) => {
  const theme = useContext(ThemeContext);
  const [onErrorImage, setOnErrorImage] = useState<boolean>(false);

  let _color: string = theme.reduxColor;
  const _temp = getStatus(props.item.status);
  if (_temp === EnumStatus.Success) _color = theme.successColor;
  if (_temp === EnumStatus.Warning) _color = theme.warningColor;
  if (_temp === EnumStatus.Failed) _color = theme.failedColor;
  const urlObject = url.parse(props.item.url, true);
  const hostname = urlObject.host || '';
  const _params = Object.entries(urlObject.query);
  const _generalElements = getGeneralElementsAsArray(props.item);
  const _requestHeadersElements = getRequestHeadersElementsAsArray(props.item);
  const _responseHeadersElements = getResponseHeadersElementsAsArray(props.item);

  // The elements are generated here for _generalElements, _requestHeadersElements and _responseHeadersElements
  // There is a filter with excludedAttributesForExport to avoid duplicate elements
  // For example, status is present in the root of props.item but also in _requestHeadersElements
  // that's why status is listed in excludedAttributesForExport
  const _renderItems = (listOfItems: Array<[string, any]>) => {
    return listOfItems
      .filter((item: Array<string>) => item.length > 1) // To be sure that item has at least two element
      .filter((item: Array<string>) => !excludedAttributesForExport.includes(item[0]))
      .filter((item: Array<string>) => item[1] && item[1].length > 0)
      .map((item: Array<string>, index: number) => {
        return (
          <View style={styles.itemContainer} key={index}>
            {typeof item[1] === 'string' && item[1].startsWith('data:image/') ? (
              _renderImage(item[1])
            ) : (
              <>
                <View style={styles.attribute}>
                  <Text style={[{ color: theme.textColorFour }]}>{item[0]}</Text>
                  {item[0] === 'url' && _copyClipbutton(item[1], 'URL has been copied to clipboard')}
                </View>
                <Text style={[{ width: '100%' }, { color: theme.textColorOne }]}>{item[1]}</Text>
              </>
            )}
          </View>
        );
      });
  };

  // If an item contains a base64 image. This one will be displayed directly instead of plain text
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

  const _copyToClipboard = (text: string): void => {
    if (typeof text === 'string') Clipboard.setString(text);
  };

  const _copyClipbutton = (text: string = '', toastMessage: string = '') => {
    return (
      <ClipboardButton
        onPress={() => {
          _copyToClipboard(text);
          props.setSnackBarMessage(toastMessage);
          props.setSnackBarVisibility(true);
        }}
      />
    );
  };

  const _renderErrorMessage = () => {
    return <Text>An error occur, cannot load the image</Text>;
  };

  return (
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
            <Text>{addEllipsis(props.item?.dataSent)}</Text>
            {isLongText(props.item?.dataSent) && (
              <View style={{ alignItems: 'flex-end' }}>
                <ViewMoreButton onPress={() => props.onPressViewMoreRequest(true)} />
              </View>
            )}
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

      {props.item?.response?.length > 0 && props.item.response !== 'undefined' && props.item.response !== 'null' && (
        <>
          <Subheading
            style={[styles.subheading, { backgroundColor: theme.secondaryLightColor, color: theme.textColorOne }]}
          >
            Response Body
          </Subheading>
          <View style={{ flexDirection: 'row-reverse', paddingHorizontal: 16 }}>
            {_copyClipbutton(props.item?.response, 'Response has been copied to clipboard')}
          </View>
          <View style={styles.attribtuesContainer}>
            <Text>{addEllipsis(props.item?.response)}</Text>
            {isLongText(props.item?.response) && (
              <View style={{ alignItems: 'flex-end' }}>
                <ViewMoreButton onPress={() => props.onPressViewMoreResponse(true)} />
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default RequestDetails;

const styles = StyleSheet.create({
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

  line: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
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

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: 56,
    borderLeftWidth: 1,
  },
});
