import * as React from 'react';
import { useState } from 'react';
import { Modal, SafeAreaView } from 'react-native';
import logger from './Core/LoggerSingleton';
import { Details } from './Components/Details';
import { Main } from './Components/Main';
import { Provider } from 'react-native-paper';

export interface IProps {
  onPressBack: (visible: boolean) => void;
  visible?: boolean;
  enabled?: boolean;
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
            onPressBack={props.onPressBack}
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
