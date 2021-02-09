import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, Subheading, Text, Surface } from 'react-native-paper';
import { IRequest } from '../types';
import { Status } from './Status';
import { duration, convert, getDate } from '../Utils/helpers';
// @ts-ignore
import BlobFileReader from 'react-native/Libraries/Blob/FileReader';

interface IProps {
  onPressBack: (showDetails: boolean) => void;
  item: IRequest | undefined;
}

// These attribute will be not added in the detail's scrollview because always displayed in the other components
const excludedAttributes: Array<string> = [
  '_id',
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
  'responseContentType',
];

const stringifyData = (data: any) => {
  try {
    return JSON.stringify(JSON.parse(data), null, 2);
  } catch (e) {
    return `${data}`;
  }
};

const getRequestBody = (item: any) => {
  return stringifyData(item.dataSent || '');
};

const getResponseBody = async (item: IRequest): Promise<string> => {
  const _responseBody = await (item.responseType !== 'blob'
    ? item.response
    : parseResponseBlob(item.response));
  return stringifyData(_responseBody || '');
};

const parseResponseBlob = async (response: Blob) => {
  const blobReader = new BlobFileReader();
  blobReader.readAsText(response);

  return await new Promise<string>((resolve, reject) => {
    const handleError = () => reject(blobReader.error);

    blobReader.addEventListener('load', () => {
      resolve(blobReader.result);
    });
    blobReader.addEventListener('error', handleError);
    blobReader.addEventListener('abort', handleError);
  });
};

const _items = (listOfItems: Array<[]>) => {
  return listOfItems
    .filter((item: Array<string>) => !excludedAttributes.includes(item[0]))
    .map((item: Array<string>, index: number) => {
      let _value = item[1];
      if (typeof _value !== 'string') {
        _value = stringifyData(_value);
      }

      return (
        <View key={index} style={styles.attribtuesContainer}>
          <Text style={styles.attributes}>{item[0]}</Text>
          <Text style={styles.text}>{_value}</Text>
        </View>
      );
    });
};

export const Details: React.FC<IProps> = (props) => {
  const [bodyResponse, setBodyResponse] = useState('');
  useEffect(() => {
    let _bodyResponse = '';
    (async () => {
      _bodyResponse = await getResponseBody(props.item);
      setBodyResponse(_bodyResponse);
    })();
    return () => {};
  }, []);

  // Appbar header is repeated here cause we use the absolute position in the style
  // Put this directly in the index.tsx cause that the Appbar will be added
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.onPressBack(false)} />
        <Appbar.Content title="Netwatch" />
      </Appbar.Header>
      <Surface style={{ flexDirection: 'row' }}>
        <Status item={props.item} />
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.textSubheader}>{`Started at: ${getDate(props.item?.startTime)}`}</Text>
          <Text style={styles.textSubheader}>{`Duration ${convert(
            duration(props.item.startTime, props.item.endTime)
          )}ms`}</Text>
        </View>
      </Surface>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View>
            <Subheading style={styles.subheading}>GENERAL</Subheading>
            {props.item && _items(Object.entries(props.item))}
            <Subheading style={styles.subheading}>REQUEST</Subheading>
            {props.item?.requestHeaders && _items(Object.entries(props.item?.requestHeaders))}
            <Subheading style={styles.subheading}>BODY REQUEST</Subheading>
            <View style={styles.attribtuesContainer}>
              <Text style={styles.text}>{getRequestBody(props.item)}</Text>
            </View>
            <Subheading style={styles.subheading}>RESPONSE</Subheading>
            {props.item &&
              props.item?.responseHeaders &&
              _items(Object.entries(props.item?.responseHeaders))}
            <Subheading style={styles.subheading}>BODY RESPONSE</Subheading>
            <View style={styles.attribtuesContainer}>
              <Text style={styles.text}>{bodyResponse}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
    top: 0,
    left: 0,
    backgroundColor: 'white',
  },
  subheading: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 0,
    marginTop: -1,
    backgroundColor: 'lightgray',
    color: 'black',
  },
  attribtuesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  attributes: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    fontSize: 16,
    color: 'black'
  },
  textSubheader: {
    fontSize: 16,
  },
});
