import * as React from 'react';
import { useState } from 'react';
import { Modal, SafeAreaView, NativeModules } from 'react-native';
import logger from './Core/LoggerSingleton';
import { Details } from './Components/Details';
import { Main } from './Components/Main';
import { Provider } from 'react-native-paper';

export interface IProps {
  onPressBack: (visible: boolean) => void;
  visible?: boolean;
  enabled?: boolean;
}

const { RNNetwatch } = NativeModules;

export function getNativeRequests() {
  RNNetwatch.getNativeRequests((response: any) => {
    console.warn('<<>> : ',  response);
  })
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
          <Main onPressBack={props.onPressBack} onPressDetail={setShowDetails} onPress={setItem} />
          {showDetails && <Details onPressBack={setShowDetails} item={item} />}
        </Modal>
      </SafeAreaView>
    </Provider>
  );
};

// For testing only
// function _getRndInteger(min: number, max: number): number {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

let isStarted: boolean = false;
const makeRequestInContinue = (): void => {
  const formData = new FormData();
  formData.append('test', 'hello');
  fetch(
    'https://postman-echo.com/post?query=some really long query that goes onto multiple lines so we can test what happens',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Special': 'dev-test',
        'X-others':
          'Another test with a very very long string just to see how it is render in the application and if it is all done',
      },
      body: JSON.stringify({ test: 'hello' }),
    }
  );

  // Request Status 200 - Specific headers
  var myHeaders = new Headers();
  myHeaders.append('x-dev', 'test');
  myHeaders.append('Authorization', 'Bearer testbearer');
  myHeaders.append(
    'Cookie',
    'Cookie_1=value; __cfduid=d6771f773b6862eec7ed068f472c9112f1612861163'
  );

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify({ test: 'hello' }),
  };

  fetch(
    'https://run.mocky.io/v3/c67ffc95-67ff-42ef-975d-c744020696da',
    requestOptions
  ).catch((error) => console.log('error', error));

  // fetch('https://postman-echo.com/post?formData', {
  //   method: 'POST',
  //   body: formData,
  // });
  // // Test long request - to see if request continue in background and correctly displayed when go back in the app
  // fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=20s').catch((e) =>
  //   console.error(e)
  // );

  // // Post method
  // fetch('https://run.mocky.io/v3/987b1858-cbc9-4911-84a7-fdea1614e224').catch((e) =>
  //   console.error(e)
  // );

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
