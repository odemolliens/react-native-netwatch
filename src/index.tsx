import * as React from 'react';
import { useState, useEffect } from 'react';
import { Modal, SafeAreaView, NativeModules, Platform } from 'react-native';
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
  onPressClose: (visible: boolean) => void;
  visible?: boolean;
  enabled?: boolean;
  maxRequests?: number;
}
export const reduxLogger = reduxLoggerMiddleware;
export const _RNLogger = new RNLogger();

const { RNNetwatch } = NativeModules;
const MAX_REQUESTS: number = 50;
let nativeLoopStarted = false;
let nativeLoop: NodeJS.Timeout;

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [reduxActions, setReduxActions] = useState<Array<ReduxAction>>([]);
  const [rnRequests, setRnRequests] = useState<Array<RNRequest>>([]);
  const [nRequests, setnRequests] = useState<Array<NRequest>>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [item, setItem] = useState();

  const startNativeLoop = () => {
    if (!nativeLoopStarted && Platform.OS === 'android') {
      nativeLoopStarted = true;
      nativeLoop = setInterval(() => {
        getNativeRequestsAndroid();
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
  const getNativeRequestsAndroid = (): void => {
    RNNetwatch.getNativeRequests((response: any) => {
      try {
        let _temp = JSON.parse(response.result);
        if (_temp && _temp instanceof Array && _temp.length > 0) {
          const _result = _temp.map((item: any) => {
            return new NRequest({
              _id: item._id,
              readyState: 4,
              url: item.url,
              method: item.method,
              status: item.status,
              startTime: item.startTime,
              endTime: item.endTime,
              timeout: item.timeout,
              dataSent: JSON.stringify(item.dataSent, null, 2),
              requestHeaders: item.requestHeaders,
              responseHeaders: item.responseHeaders,
              responseContentType: item.responseContentType,
              responseSize: item.responseSize,
              responseType: item.responseType,
              responseURL: item.responseURL,
              response: JSON.stringify(item.response, null, 2),
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
      setReduxMaxActions(props.maxRequests || MAX_REQUESTS);
      setReduxActionsCallback(setReduxActions);
    }
  }, [props.enabled]);

  useEffect(() => {
    !props.visible ? stopNativeLoop() : startNativeLoop();
  }, [props.visible]);

  return (
    <Provider>
      <ThemeContext.Provider value={themes.dark}>
        <SafeAreaView>
          <Modal animationType="slide" visible={props.visible}>
            <Main
              maxRequests={props.maxRequests || MAX_REQUESTS}
              testId="mainScreen"
              visible={props.visible}
              onPressClose={props.onPressClose}
              onPressDetail={setShowDetails}
              onPress={setItem}
              reduxActions={reduxActions}
              rnRequests={rnRequests}
              nRequests={nRequests}
              clearAll={clearAll}
            />
            {showDetails && (
              <Details testId="detailScreen" onPressBack={setShowDetails} item={item} />
            )}
          </Modal>
        </SafeAreaView>
      </ThemeContext.Provider>
    </Provider>
  );
};
