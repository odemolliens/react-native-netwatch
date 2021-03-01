import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, SafeAreaView, NativeModules, DeviceEventEmitter } from 'react-native';
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

export interface IProps {
  onPressClose: (visible: boolean) => void;
  visible?: boolean;
  enabled?: boolean;
  maxRequests?: number;
}

const { RNNetwatch } = NativeModules;

export function getNativeRequests() {
  RNNetwatch.getNativeRequests((response: any) => {
    console.warn('<<>> : ', response);
  });
}

export const reduxLogger = reduxLoggerMiddleware;
export const _RNLogger = new RNLogger();
const MAX_REQUESTS: number = 15;

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [reduxActions, setReduxActions] = useState<Array<ReduxAction>>([]);
  const [rnRequests, setRnRequests] = useState<Array<RNRequest>>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [item, setItem] = useState();

  if (props.enabled) {
    _RNLogger.enableXHRInterception();
    _RNLogger.setCallback(setRnRequests);
    setReduxMaxActions(props.maxRequests || MAX_REQUESTS);
    setReduxActionsCallback(setReduxActions);
  } else {
    _RNLogger.disableXHRInterception();
    _RNLogger.clear();
    setReduxActionsCallback(() => {});
  }

  const clearAll = () => {
    _RNLogger.clear();
    clearReduxActions();
    setReduxActions([]);
    setRnRequests([]);
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('NetwatchShakeEvent', () => {
      console.warn('<<>> DEVICE SHAKE: ');
    });
  }, []);

  return (
    <Provider>
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
            clearAll={clearAll}
          />
          {showDetails && (
            <Details testId="detailScreen" onPressBack={setShowDetails} item={item} />
          )}
        </Modal>
      </SafeAreaView>
    </Provider>
  );
};
