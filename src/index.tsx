import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, NativeModules, DeviceEventEmitter, useColorScheme, View } from 'react-native';
import { Details } from './Components/Details';
import { Main } from './Components/Main';
import {
  reduxLoggerMiddleware,
  setCallback as setReduxActionsCallback,
  setMaxActions as setReduxMaxActions,
  clear as clearReduxActions,
} from './Core/ReduxLogger';
import { RNLogger } from './Core/RNLogger';
import { RNRequest } from './Core/Objects/RNRequest';
import { ReduxAction } from './Core/Objects/ReduxAction';
import { NRequest } from './Core/Objects/NRequest';
import { ThemeContext, themes } from './Theme';

export interface IProps {
  visible?: boolean;
  enabled: boolean;
  disableShake?: boolean;
  maxRequests?: number;
  theme?: string;
}
export const reduxLogger = reduxLoggerMiddleware;
export const _RNLogger = new RNLogger();

const { RNNetwatch } = NativeModules;
let nativeLoopStarted = false;
let nativeLoop: NodeJS.Timeout;

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [reduxActions, setReduxActions] = useState<Array<ReduxAction>>([]);
  const [rnRequests, setRnRequests] = useState<Array<RNRequest>>([]);
  const [nRequests, setnRequests] = useState<Array<NRequest>>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [item, setItem] = useState(new ReduxAction());
  const [visible, setVisible] = useState(false);

  const colorScheme = props.theme ? props.theme : useColorScheme();
  // At this time, if it's not light, that will be dark. No other possibility
  const _theme = colorScheme === 'light' ? themes.light : themes.dark;

  useEffect(() => {
    if (props.visible !== undefined) {
      setVisible(props.visible);
    }
  }, [props.visible]);

  const handleShake = () => {
    if (!props.disableShake) setVisible(true);
  };

  useEffect(() => {
    if (!props.disableShake) DeviceEventEmitter.addListener('NetwatchShakeEvent', handleShake);
    return () => {
      DeviceEventEmitter.removeListener('NetwatchShakeEvent', handleShake);
    };
  }, [handleShake]);

  const handleBack = () => {
    showDetails ? setShowDetails(false) : setVisible(false);
  };

  const startNativeLoop = () => {
    if (props.enabled && !nativeLoopStarted) {
      nativeLoopStarted = true;
      nativeLoop = setInterval(() => {
        getNativeRequests();
      }, 3000);
    }
  };

  const stopNativeLoop = () => {
    nativeLoopStarted = false;
    clearInterval(nativeLoop);
  };

  const clearAll = () => {
    _RNLogger.clear();
    clearReduxActions();
    setReduxActions([]);
    setRnRequests([]);
    setnRequests([]);
  };

  // Extract data from shared pref and passed the result to the UI
  const getNativeRequests = (): void => {
    RNNetwatch.getNativeRequests((response: any) => {
      try {
        let _temp;
        try {
          _temp = JSON.parse(response.result);
        } catch (e) {
          _temp = response.result;
        }
        if (_temp && _temp instanceof Array && _temp.length > 0) {
          const _result = _temp.map((element: any) => {
            return new NRequest({
              _id: element._id,
              readyState: 4,
              url: element.url,
              shortUrl: element.url.slice(0, 50),
              method: element.method,
              status: element.status,
              startTime: element.startTime,
              endTime: element.endTime,
              timeout: element.timeout,
              dataSent: JSON.stringify(element.dataSent, null, 2),
              requestHeaders: element.requestHeaders,
              responseHeaders: element.responseHeaders,
              responseContentType: element.responseContentType,
              responseSize: element.responseSize,
              responseType: element.responseType,
              responseURL: element.responseURL,
              response: JSON.stringify(element.response, null, 2),
            });
          });
          setnRequests([..._result, ...nRequests]);
        }
      } catch (error) {
        console.error(error.message);
      }
    });
  };

  useEffect(() => {
    if (!props.enabled) {
      clearAll();
      stopNativeLoop();
      _RNLogger.disableXHRInterception();
      setReduxActionsCallback(() => {});
    } else {
      startNativeLoop();
      _RNLogger.enableXHRInterception();
      _RNLogger.setCallback(setRnRequests);
      setReduxMaxActions(props.maxRequests);
      setReduxActionsCallback(setReduxActions);
    }
  }, [props.enabled]);

  useEffect(() => {
    RNNetwatch.startNetwatch();
    !visible ? stopNativeLoop() : startNativeLoop();
  }, [visible]);

  return (
    <ThemeContext.Provider value={_theme}>
      <Modal animationType="slide" visible={visible} onRequestClose={handleBack}>
        <View style={{ flex: 1 }}>
          <View style={{ height: showDetails ? 0 : '100%' }}>
            <Main
              maxRequests={props.maxRequests}
              testId="mainScreen"
              onPressClose={() => setVisible(false)}
              onPressDetail={setShowDetails}
              onPress={setItem}
              reduxActions={reduxActions}
              rnRequests={rnRequests}
              nRequests={nRequests}
              clearAll={clearAll}
            />
          </View>
          <View style={{ height: showDetails ? '100%' : 0 }}>
            <Details testId="detailScreen" onPressBack={setShowDetails} item={item} />
          </View>
        </View>
      </Modal>
    </ThemeContext.Provider>
  );
};

Netwatch.defaultProps = {
  visible: false,
  enabled: true,
  disableShake: false,
  maxRequests: 100,
  theme: undefined,
};
