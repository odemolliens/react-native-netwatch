import * as React from 'react';
import { useState } from 'react';
import { Modal, SafeAreaView, NativeModules } from 'react-native';
import logger from './Core/LoggerSingleton';
import { Details } from './Components/Details';
import { Main } from './Components/Main';
import { Provider } from 'react-native-paper';

export interface IProps {
  onPressClose: (visible: boolean) => void;
  visible?: boolean;
  enabled?: boolean;
}

const { RNNetwatch } = NativeModules;

export function startNativeListerner() {
  RNNetwatch.startNativeInterceptor(); 
}

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [item, setItem] = useState();

  if (logger.isEnabled() && !props.enabled) {
    logger.disableXHRInterception();
  }

  if (!logger.isEnabled() && props.enabled) {
    logger.enableXHRInterception();
  }

  return (
    <Provider>
      <SafeAreaView>
        <Modal animationType="slide" visible={props.visible}>
          <Main
            testId="mainScreen"
            onPressClose={props.onPressClose}
            onPressDetail={setShowDetails}
            onPress={setItem}
          />
          {showDetails && (
            <Details testId="detailScreen" onPressBack={setShowDetails} item={item} />
          )}
        </Modal>
      </SafeAreaView>
    </Provider>
  );
};
