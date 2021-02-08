import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, Subheading, Text, Surface } from 'react-native-paper';
import { IRequest } from '../types';
import { Status } from './Status';
import { duration, convert, getDate } from '../Utils/helpers';

interface IProps {
  // request: any; // WIP: Should be a request object
  onPressBack: (showDetails: boolean) => void;
  item: IRequest | undefined;
}

const _items = (listOfItems: Array<[]>) => {
  return listOfItems.map((item: Array<string>, index: number) => {
    return (
      <View key={index} style={styles.attribtuesContainer}>
        <Text style={styles.attributes}>{item[0]}</Text>
        <Text style={styles.text}>{item[1]}</Text>
      </View>
    );
  });
};

export const Details: React.FC<IProps> = (props) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => props.onPressBack(false)} />
        <Appbar.Content title="Netwatch" />
      </Appbar.Header>
      <Surface style={{ flexDirection: 'row' }}>
        <Status item={props.item} />
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.text}>{`Started at: ${getDate(props.item?.startTime)}`}</Text>
          <Text style={styles.text}>{`Duration ${convert(
            duration(props.item.startTime, props.item.endTime)
          )}ms`}</Text>
        </View>
      </Surface>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View>
            <Subheading style={styles.subheading}>GENERAL</Subheading>
            {props.item && (
              <>
                <View style={styles.attribtuesContainer}>
                  <Text style={styles.attributes}>Internal Request ID</Text>
                  <Text style={styles.text}>{props.item._id}</Text>
                </View>
                <View style={styles.attribtuesContainer}>
                  <Text style={styles.attributes}>URL</Text>
                  <Text style={styles.text}>{props.item.url}</Text>
                </View>
              </>
            )}
            <Subheading style={styles.subheading}>RESPONSE</Subheading>
            {props.item &&
              props.item?.responseHeaders &&
              _items(Object.entries(props.item?.responseHeaders))}
            <Subheading style={styles.subheading}>REQUEST</Subheading>
            {props.item?.requestHeaders && _items(Object.entries(props.item?.requestHeaders))}
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
  },
  attribtuesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  attributes: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
});
