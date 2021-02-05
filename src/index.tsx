import * as React from 'react';
import { useState } from 'react';
import { Modal, SafeAreaView } from 'react-native';
import logger from './LoggerSingleton';
import { Details } from './Components/Details';
import { Logger } from './Components/Logger';

export interface IProps {
  onPressBack: (visible: boolean) => void;
  visible: boolean;
  enabled: boolean;
}

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [item, setItem] = useState(undefined);

  if (logger.isEnabled() && !props.enabled) {
    logger.disableXHRInterception();
  }

  if (!logger.isEnabled() && props.enabled) {
    logger.enableXHRInterception();
  }

  return (
    <SafeAreaView>
      <Modal animationType="slide" visible={props.visible}>
        {showDetails ? (
          <Details onPressBack={setShowDetails} item={item} />
        ) : (
          <Logger
            onPressBack={props.onPressBack}
            onPressDetail={setShowDetails}
            onPress={setItem}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

// For testing only
function _getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let isStarted: boolean = false;
const makeRequestInContinue = (): void => {
  // Test long request - to see if request continue in background and correctly displayed when go back in the app
  fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=20s').catch((e) =>
    console.error(e)
  );

  // setInterval(() => {
  //   const key: number = _getRndInteger(1, 4);
  //   let url: string = '';
  //   switch (key) {
  //     case 1:
  //       // Mock StatusCode 200
  //       // (delete link: https://designer.mocky.io/manage/delete/1a2d092a-42b2-4a89-a44f-267935dc13e9/BIMk8qNoP2zMvZtx6yQ3u9yGsWoK1g8HyYxO)
  //       url = 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9';
  //       break;
  //     case 2:
  //       // Mock StatusCode 302
  //       // (delete link: https://designer.mocky.io/manage/delete/7ee3fd63-f862-435f-8557-5de3e3d2fa91/4QPNsmOER7ghGDFKPWyIFvNAvGPysyYxkBi2)
  //       url = 'https://run.mocky.io/v3/7ee3fd63-f862-435f-8557-5de3e3d2fa91';
  //       break;
  //     case 3:
  //       // Mock StatusCode 400
  //       // (delete link: https://designer.mocky.io/manage/delete/d810eeaf-26ef-46fc-8e44-79c7df25d268/Rqq8qeKviPA80JI0ujlVJBZtbhRkNPBHYY2U)
  //       url = 'https://run.mocky.io/v3/d810eeaf-26ef-46fc-8e44-79c7df25d268';
  //       break;
  //     default:
  //       // Mock StatusCode 500
  //       // (delete link: https://designer.mocky.io/manage/delete/cea80db8-5848-4ef6-bb05-9c0a1d0971d0/MYZJzMDfg2GxA7jTbrXlbIK0lTzC1rU5U0Mh)
  //       url = 'https://run.mocky.io/v3/cea80db8-5848-4ef6-bb05-9c0a1d0971d0';
  //       break;
  //   }
  //   console.log(url);
  //   fetch(url).catch(e => console.log(e));
  // }, 2000);
};

if (__DEV__) {
  !isStarted &&
    setTimeout(() => {
      makeRequestInContinue();
    }, 2000);
  isStarted = true;
}
