import * as React from 'react';
import { useCallback, useState } from 'react';
import { DeviceEventEmitter, EmitterSubscription, Modal, NativeModules, useColorScheme, View } from 'react-native';
import { Details } from './Components/Details';
import { Main } from './Components/Main';
import {
  clear as clearReduxActions,
  reduxLoggerMiddleware,
  setCallback as setReduxActionsCallback,
  setConfig as setReduxConfig,
  setMaxActions as setReduxMaxActions,
} from './Core/ReduxLogger';
import { RNLogger } from './Core/RNLogger';
import { ConnectionLogger } from './Core/ConnectionLogger';
import { RNRequest } from './Core/Objects/RNRequest';
import { ReduxAction } from './Core/Objects/ReduxAction';
import { NRequest } from './Core/Objects/NRequest';
import { ConnectionInfo } from './Core/Objects/ConnectionInfo';
import { ThemeContext, themes } from './Theme';
import { clearMockResponses, MockResponse, resetMockResponses, setupMocks } from './Components/Mocking/utils';
import { MockingNavigator } from './Components/Mocking';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';

export interface IProps {
  visible?: boolean;
  onPressClose?: () => void;
  enabled: boolean;
  disableShake?: boolean;
  interceptIOS?: boolean;
  maxRequests?: number;
  reduxConfig?: any;
  theme?: 'dark' | 'light';
  showStats?: boolean;
  useReactotron?: boolean;
  loadMockPresetFromClipboard?: boolean;
}
export const reduxLogger = reduxLoggerMiddleware;
export const _RNLogger = new RNLogger();
export const _ConnectionLogger = new ConnectionLogger();

const { RNNetwatch } = NativeModules;
let nativeLoopStarted = false;
let nativeLoop: NodeJS.Timeout;

export const Netwatch: React.FC<IProps> = (props: IProps) => {
  const [reduxActions, setReduxActions] = useState<Array<ReduxAction>>([]);
  const [rnRequests, setRnRequests] = useState<Array<RNRequest>>([]);
  const [nRequests, setnRequests] = useState<Array<NRequest>>([]);
  const [connections, setConnections] = useState<Array<ConnectionInfo>>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [item, setItem] = useState(new ReduxAction());
  const [visible, setVisible] = useState(false);
  const [mockResponse, setMockResponse] = useState<MockResponse | undefined>();
  const [update, setUpdate] = useState(false);
  const [showMockNavigator, setShowMockNavigator] = useState<boolean>(false);

  let colorScheme = useColorScheme() || 'light';
  colorScheme = props.theme ? props.theme : colorScheme;

  // At this time, if it's not light, that will be dark. No other possibility
  const _theme = colorScheme === 'light' ? themes.light : themes.dark;

  // Extract data from shared pref and passed the result to the UI
  const getNativeRequests = useCallback((): void => {
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
              shortUrl: element.url.slice(0, 100),
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
  }, [nRequests]);

  React.useEffect(() => {
    if (props.visible !== undefined) {
      setVisible(props.visible);
    }
  }, [props.visible]);

  const handleShake = useCallback(() => {
    if (!props.disableShake && props.onPressClose) {
      console.warn(
        'You cannot use button and shake at the same time to avoid inconsistant state. To remove this warning, you must explicitly set props disableShake to true or remove props onPressClose.',
      );
      return;
    }

    if (!props.disableShake && props.enabled) {
      setVisible(true);
    }
  }, [props.disableShake, props.enabled, props.onPressClose]);

  React.useEffect(() => {
    let subscription: EmitterSubscription | null = null;
    if (!props.disableShake && props.enabled) {
      subscription = DeviceEventEmitter.addListener('NetwatchShakeEvent', handleShake);
    }
    return () => {
      subscription?.remove?.();
    };
  }, [handleShake, props.disableShake, props.enabled]);

  const handleBack = () => {
    if (showDetails) {
      return setShowDetails(false);
    }
    props.onPressClose ? props.onPressClose() : setVisible(false);
  };

  const startNativeLoop = useCallback(() => {
    if (props.enabled && !nativeLoopStarted) {
      nativeLoopStarted = true;
      nativeLoop = setInterval(() => {
        getNativeRequests();
      }, 1500);
    }
  }, [getNativeRequests, props.enabled]);

  const stopNativeLoop = () => {
    nativeLoopStarted = false;
    clearInterval(nativeLoop);
  };

  const clearAll = () => {
    _RNLogger.clear();
    _ConnectionLogger.clearConnectionEvents();
    clearReduxActions();
    setReduxActions([]);
    setRnRequests([]);
    setnRequests([]);
    setConnections([]);
  };

  React.useEffect(() => {
    if (!props.enabled || props.useReactotron) {
      clearMockResponses();
      clearAll();
      stopNativeLoop();
      _ConnectionLogger.resetCallback();
      setReduxActionsCallback(() => {});
    }
  }, [props.enabled, props.useReactotron]);

  React.useEffect(() => {
    if (props.enabled) {
      if (props.interceptIOS) {
        RNNetwatch.startNetwatch();
      }
      startNativeLoop();
      _RNLogger.enableXHRInterception();
      _RNLogger.setCallback(setRnRequests);
      _ConnectionLogger.setCallback(setConnections);
      if (props.reduxConfig) {
        setReduxConfig(props.reduxConfig);
      }
      setReduxMaxActions(props.maxRequests);
      setReduxActionsCallback(setReduxActions);
      if (props.loadMockPresetFromClipboard) {
        Clipboard.getString().then(responses => {
          if (responses) {
            resetMockResponses(responses);
          }
          setupMocks();
        });
      } else {
        setupMocks(); // Setup mock responses AFTER everything else in setup
      }
    }
  }, [
    props.enabled,
    props.interceptIOS,
    props.maxRequests,
    props.reduxConfig,
    startNativeLoop,
    props.loadMockPresetFromClipboard,
  ]);

  React.useEffect(() => {
    if (!visible) {
      stopNativeLoop();
      return;
    }
    startNativeLoop();
  }, [startNativeLoop, visible]);

  if (!props.enabled) {
    return null;
  }

  return (
    <ThemeContext.Provider value={_theme}>
      <PaperProvider theme={DarkTheme}>
        <Modal animationType="slide" visible={visible} onRequestClose={handleBack}>
          <View style={{ flex: 1 }}>
            <View style={{ height: showDetails ? 0 : '100%' }}>
              <Main
                maxRequests={props.maxRequests}
                testId="mainScreen"
                onPressClose={props.onPressClose || (() => setVisible(false))}
                onPressDetail={setShowDetails}
                onPress={setItem}
                reduxActions={reduxActions}
                rnRequests={rnRequests}
                nRequests={nRequests}
                connections={connections}
                clearAll={clearAll}
                showStats={props.showStats}
                onShowMocksList={() => {
                  setMockResponse(undefined);
                  setShowMockNavigator(true);
                }}
              />
            </View>
            <View style={{ height: showDetails ? '100%' : 0 }}>
              <Details
                onEditMockResponse={(mr, u) => {
                  setMockResponse(mr);
                  setUpdate(u);
                  setShowMockNavigator(true);
                }}
                testId="detailScreen"
                onPressBack={setShowDetails}
                item={item}
              />
            </View>
            <Modal
              animationType="slide"
              visible={showMockNavigator}
              statusBarTranslucent={true}
              onRequestClose={() => setShowMockNavigator(true)}
            >
              <MockingNavigator
                mockResponse={mockResponse}
                update={update}
                onPressBack={() => setShowMockNavigator(false)}
              />
            </Modal>
          </View>
        </Modal>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

Netwatch.defaultProps = {
  visible: false,
  onPressClose: undefined,
  enabled: true,
  interceptIOS: true,
  disableShake: false,
  maxRequests: 100,
  reduxConfig: {},
  theme: 'dark',
  showStats: true,
  useReactotron: false,
};
