import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, Subheading, Text, Surface } from 'react-native-paper';
import { Status } from './Status';
import { duration, convert, getDate } from '../Utils/helpers';
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
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => props.onPressBack(false)}
          testID="buttonBackToMainScreen"
        />
        <Appbar.Content title="Netwatch" />
      </Appbar.Header>
      <Surface style={{ flexDirection: 'row' }}>
        {props.item && <Status item={props.item} />}
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.textSubheader}>{`Started at: ${getDate(props.item.startTime)}`}</Text>
          <Text style={styles.textSubheader}>{`Duration ${convert(
            duration(props.item.startTime, props.item.endTime)
          )}ms`}</Text>
        </View>
      </Surface>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollview}>
          <View>
            <Subheading style={styles.subheading}>GENERAL</Subheading>
            {props.item && _renderItems(Object.entries(props.item))}
            <Subheading style={styles.subheading}>REQUEST</Subheading>
            {props.item?.requestHeaders && _renderItems(Object.entries(props.item.requestHeaders))}
            <Subheading style={styles.subheading}>BODY REQUEST</Subheading>
            <View style={styles.attribtuesContainer}>
              <Text style={styles.text}>{props.item.dataSent}</Text>
            </View>
            <Subheading style={styles.subheading}>RESPONSE</Subheading>
            {props.item &&
              props.item?.responseHeaders &&
              _renderItems(Object.entries(props.item.responseHeaders))}
            <Subheading style={styles.subheading}>BODY RESPONSE</Subheading>
            <View style={styles.attribtuesContainer}>
              <Text style={styles.text}>{props.item.response}</Text>
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
    color: 'black',
  },
  textSubheader: {
    fontSize: 16,
  },
  scrollview: {
    paddingBottom: 20,
  },
});
