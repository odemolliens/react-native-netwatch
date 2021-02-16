import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, Subheading, Text, Surface } from 'react-native-paper';
import { Status } from './Status';
import { duration, getDate } from '../Utils/helpers';
import { Request } from '../Core/Request';
// @ts-ignore
import BlobFileReader from 'react-native/Libraries/Blob/FileReader';

interface IProps {
  testId?: string;
  onPressBack: (showDetails: boolean) => void;
  item?: Request;
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
  'responseType',
  'responseContentType',
];

const _renderItems = (listOfItems: Array<[string, any]>) => {
  return listOfItems
    .filter((item: Array<string>) => !excludedAttributes.includes(item[0]))
    .map((item: Array<string>, index: number) => {
      return (
        <View key={index} style={styles.attribtuesContainer}>
          <Text style={styles.attributes}>{item[0]}</Text>
          <Text style={styles.text}>{item[1]}</Text>
        </View>
      );
    });
};

export const Details: React.FC<IProps> = (props) => {
  if (!props.item) return <Text>Error</Text>;
  // Appbar header is repeated here cause we use the absolute position in the style
  // Put this directly in the index.tsx cause that the Appbar will be added
  const _generalElements = (props.item && Object.entries(props.item)) || null;
  const _requestHeadersElements =
    (props.item?.requestHeaders && Object.entries(props.item.requestHeaders)) || null;
  const _responseHeadersElements =
    (props.item?.responseHeaders && Object.entries(props.item.responseHeaders)) || null;

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          color='white' 
          onPress={() => props.onPressBack(false)}
          testID="buttonBackToMainScreen"
        />
        <Appbar.Content title="Netwatch" />
      </Appbar.Header>
      <Surface style={{ flexDirection: 'row' }}>
        {props.item && <Status item={props.item} />}
        <View style={styles.subHeaderContainer}>
          <Text style={styles.textSubheader}>{`${getDate(props.item.startTime)}`}</Text>
          <Text style={styles.textSubheader}>{`Duration ${duration(
            props.item.startTime,
            props.item.endTime
          )}ms`}</Text>
        </View>
      </Surface>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollview}>
          <View>
            <Subheading style={styles.subheading}>GENERAL</Subheading>
            {_generalElements && _renderItems(_generalElements)}
            <Subheading style={styles.subheading}>REQUEST HEADERS</Subheading>
            {_requestHeadersElements && _renderItems(_requestHeadersElements)}

            {props.item?.dataSent !== '' && (
              <>
                <Subheading style={styles.subheading}>REQUEST DATA</Subheading>
                <View style={styles.attribtuesContainer}>
                  <Text style={styles.text}>{props.item.dataSent}</Text>
                </View>
              </>
            )}

            <Subheading style={styles.subheading}>RESPONSE HEADERS</Subheading>
            {_responseHeadersElements && _renderItems(_responseHeadersElements)}
            {props.item?.response !== '' && (
              <>
                <Subheading style={styles.subheading}>RESPONSE BODY</Subheading>
                <View style={styles.attribtuesContainer}>
                  <Text style={styles.text}>{props.item?.response}</Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#212121',
  },
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
    top: 0,
    left: 0,
    backgroundColor: 'white',
  },
  subHeaderContainer: {
    paddingLeft: 8,
    justifyContent: 'center',
    backgroundColor: '#212121',
    width: '100%'
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
    color: 'black',
  },
  textSubheader: {
    fontSize: 16,
    color: 'white',
  },
  scrollview: {
    paddingBottom: 20,
  },
});
