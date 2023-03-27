import { TextInput } from 'react-native-paper';
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import * as React from 'react';
import { useCallback, useContext, useEffect } from 'react';
import { ThemeContext } from '../../Theme';
import { NavBar } from '../NavBar';
import { extractURL, mockRequestWithResponse, MockResponse } from './utils';

export function EditMockResponse(props: { mockResponse: MockResponse; onPressBack: () => void; update: boolean }) {
  const theme = useContext(ThemeContext);

  const [url, setUrl] = React.useState<string>();
  const [method, setMethod] = React.useState<string>(); // [GET, POST, PUT, PATCH, DELETE
  const [headers, setHeaders] = React.useState<string>();
  const [body, setBody] = React.useState<string>();
  const [code, setCode] = React.useState<string>();
  const [active, setActive] = React.useState<boolean>(true);
  const [to, setTo] = React.useState<string>();

  useEffect(() => {
    setUrl(props.mockResponse.url);
    setMethod(props.mockResponse.method);
    setHeaders(props.mockResponse.headers);
    setBody(props.mockResponse.response);
    setCode(props.mockResponse.statusCode?.toString());
    setTo(props.mockResponse.timeout?.toString());
    setActive(props.update ? !!props.mockResponse.active : true);
  }, [
    props.mockResponse.headers,
    props.mockResponse.method,
    props.mockResponse.response,
    props.mockResponse.statusCode,
    props.mockResponse.timeout,
    props.mockResponse.url,
    props.mockResponse.active,
    props.update,
  ]);

  const saveMockResponse = useCallback(() => {
    if (url) {
      mockRequestWithResponse({
        url: extractURL(url),
        method,
        headers,
        response: body,
        statusCode: code ? parseInt(code, 10) : 0,
        timeout: to ? parseInt(to, 10) : 0,
        active,
        date: Date.now(),
      });
    }
  }, [body, code, headers, method, to, url, active]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <NavBar
        title={'Edit Response Mock'}
        onPressBack={props.onPressBack}
        rightComponent={<Button title={'Save'} onPress={saveMockResponse} />}
      />

      <ScrollView
        keyboardDismissMode={'on-drag'}
        style={{ backgroundColor: theme.secondaryColor }}
        contentContainerStyle={styles.scrollView}
      >
        <View style={{ flex: 1, width: '100%' }}>
          <View style={{ margin: 15 }}>
            <Text style={{ color: theme.textColorOne }}>Leave blank entries to keep unchanged.</Text>
          </View>
          <View style={{ flexDirection: 'row', margin: 15 }}>
            <Text style={{ flex: 1, color: theme.textColorOne, fontSize: 14, marginBottom: 10 }}>
              Mock response active
            </Text>
            <Switch value={active} onValueChange={setActive} />
          </View>

          <TextInput mode={'flat'} style={styles.textInput} label={'URL'} onChangeText={setUrl} value={url} />
          <TextInput
            mode={'flat'}
            keyboardType={'numeric'}
            style={styles.textInput}
            label={'Response Code'}
            onChangeText={setCode}
            value={code}
          />
          <TextInput
            mode={'flat'}
            keyboardType={'numeric'}
            style={styles.textInput}
            label={'Timeout value'}
            onChangeText={setTo}
            value={to}
          />
          <TextInput
            mode={'flat'}
            style={styles.textInput}
            label={'Response Method'}
            onChangeText={setMethod}
            value={method}
          />
          <TextInput
            mode={'flat'}
            style={[styles.textInput, styles.multiLine]}
            value={headers}
            label="Headers"
            multiline
            onChangeText={setHeaders}
          />
          <TextInput
            mode={'flat'}
            style={[styles.textInput, styles.multiLine]}
            label="Body"
            multiline
            onChangeText={setBody}
            value={body}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subheading: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    width: 56,
    borderLeftWidth: 1,
  },
  scrollView: {
    paddingTop: 26,
    paddingBottom: 20,
  },
  textInput: {
    margin: 10,
  },
  multiLine: {
    height: 200,
  },
});
