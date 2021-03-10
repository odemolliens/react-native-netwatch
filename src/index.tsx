import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, SafeAreaView, NativeModules, DeviceEventEmitter, useColorScheme } from 'react-native';
import { Details } from './Components/Details';
import { Main } from './Components/Main';
import { Provider } from 'react-native-paper';
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
  onPressClose: () => void;
  onShake?: () => void;
  visible: boolean;
  enabled?: boolean;
  shake?: boolean;
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
    setVisible(props.visible);
  }, [props.visible]);

  const handleShake = () => {
    if (props.shake && props.onShake) props.onShake();
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('NetwatchShakeEvent', handleShake);
    return () => {
      DeviceEventEmitter.removeListener('NetwatchShakeEvent', handleShake);
    };
  }, [handleShake]);

  const handleBack = () => {
    showDetails ? setShowDetails(false) : props.onPressClose();
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
    !props.visible ? stopNativeLoop() : startNativeLoop();
  }, [props.visible]);

  return (
    <Provider>
      <ThemeContext.Provider value={_theme}>
        <SafeAreaView>
          <Modal animationType="slide" visible={visible} onRequestClose={handleBack}>
            {showDetails ? (
              <Details testId="detailScreen" onPressBack={setShowDetails} item={item} />
            ) : (
              <Main
                maxRequests={props.maxRequests}
                testId="mainScreen"
                onPressClose={() => props.onPressClose()}
                onPressDetail={setShowDetails}
                onPress={setItem}
                reduxActions={reduxActions}
                rnRequests={rnRequests}
                nRequests={nRequests}
                clearAll={clearAll}
              />
            )}
          </Modal>
        </SafeAreaView>
      </ThemeContext.Provider>
    </Provider>
  );
};

Netwatch.defaultProps = {
  onShake: () => {},
  visible: false,
  enabled: true,
  shake: true,
  maxRequests: 100,
  theme: undefined,
};
