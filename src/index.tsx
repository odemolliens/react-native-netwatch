import * as React from 'react';
import { useState } from 'react';
import { Modal, useColorScheme, View } from 'react-native';
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
import { ConnectionInfo } from './Core/Objects/ConnectionInfo';
import { ThemeContext, themes } from './Theme';
import {
  clearMockResponses,
  mockRequestWithResponse,
  MockResponse,
  resetMockResponses,
  setupMocks,
} from './Components/Mocking/utils';
import { MockingNavigator } from './Components/Mocking';
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';

export interface IProps {
  visible?: boolean;
  onPressClose?: () => void;
  enabled: boolean;
  maxRequests?: number;
  reduxConfig?: any;
  theme?: 'dark' | 'light';
  showStats?: boolean;
  useReactotron?: boolean;
  loadMockPresetFromClipboard?: boolean;
  mockPresets?: Array<MockResponse>;
}

export const reduxLogger = reduxLoggerMiddleware;
export const _RNLogger = new RNLogger();
export const _ConnectionLogger = new ConnectionLogger();

export const Netwatch: React.FC<IProps> = (providedProps: IProps) => {
  const props = {
    ...providedProps,
    visible: providedProps.visible ?? false,
    maxRequests: providedProps.maxRequests ?? 100,
    reduxConfig: providedProps.reduxConfig ?? {},
    theme: providedProps.theme ?? ('dark' as const),
    showStats: providedProps.showStats ?? true,
    useReactotron: providedProps.useReactotron ?? false,
  };
  const [reduxActions, setReduxActions] = useState<Array<ReduxAction>>([]);
  const [rnRequests, setRnRequests] = useState<Array<RNRequest>>([]);
  const [connections, setConnections] = useState<Array<ConnectionInfo>>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [item, setItem] = useState(new ReduxAction());
  const [visible, setVisible] = useState(props.visible ?? false);
  const [mockResponse, setMockResponse] = useState<MockResponse | undefined>();
  const [update, setUpdate] = useState(false);
  const [showMockNavigator, setShowMockNavigator] = useState<boolean>(false);

  let colorScheme = useColorScheme() || 'light';
  colorScheme = props.theme ? props.theme : colorScheme;

  // At this time, if it's not light, that will be dark. No other possibility
  const _theme = colorScheme === 'light' ? themes.light : themes.dark;

  React.useEffect(() => {
    if (props.visible !== undefined) {
      setVisible(props.visible);
    }
  }, [props.visible]);

  const handleBack = () => {
    if (showDetails) {
      return setShowDetails(false);
    }
    props.onPressClose ? props.onPressClose() : setVisible(false);
  };

  const clearAll = () => {
    _RNLogger.clear();
    _ConnectionLogger.clearConnectionEvents();
    clearReduxActions();
    setReduxActions([]);
    setRnRequests([]);
    setConnections([]);
  };

  React.useEffect(() => {
    if (!props.enabled || props.useReactotron) {
      clearMockResponses();
      clearAll();
      _ConnectionLogger.resetCallback();
      setReduxActionsCallback(() => {});
    }
  }, [props.enabled, props.useReactotron]);

  React.useEffect(() => {
    if (props.enabled) {
      _RNLogger.enableXHRInterception();
      _RNLogger.setCallback(setRnRequests);
      _ConnectionLogger.setCallback(setConnections);
      if (props.reduxConfig) {
        setReduxConfig(props.reduxConfig);
      }
      setReduxMaxActions(props.maxRequests);
      setReduxActionsCallback(setReduxActions);
    }
  }, [props.enabled, props.maxRequests, props.reduxConfig, props.loadMockPresetFromClipboard]);

  React.useEffect(() => {
    if (props.enabled) {
      try {
        if (props.loadMockPresetFromClipboard) {
          Clipboard.getString().then(responses => {
            if (responses) {
              resetMockResponses(responses);
            }
          });
        } else if (Array.isArray(props.mockPresets)) {
          props.mockPresets.forEach(preset => {
            mockRequestWithResponse(preset);
          });
        }
      } catch (e) {
        console.error(e);
      }
      setupMocks();
    }
  }, [props.enabled, props.loadMockPresetFromClipboard, props.mockPresets]);

  if (!props.enabled || !visible) {
    return null;
  }

  return (
    <ThemeContext.Provider value={_theme}>
      <PaperProvider theme={MD3DarkTheme}>
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
