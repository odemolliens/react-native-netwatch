import NetInfo from '@react-native-community/netinfo';
import { ConnectionInfo } from './Objects/ConnectionInfo';
import { NetInfoState } from '@react-native-community/netinfo/src/internal/types';

export class ConnectionLogger {
  static instance: ConnectionLogger;

  connectionEvents: ConnectionInfo[] = [];
  connectionCounter: number = 0;
  maxConnections: number = 50;
  callback: Function = () => {};

  constructor() {
    if (ConnectionLogger.instance) {
      return ConnectionLogger.instance;
    }
    ConnectionLogger.instance = this;

    NetInfo.addEventListener((state: NetInfoState) => {
      this.addEvent(
        new ConnectionInfo({
          _id: this.connectionCounter++,
          connection: state,
        }),
      );
    });
  }

  addEvent = (_action: ConnectionInfo) => {
    const _add = () => {
      this.connectionEvents = [_action].concat(this.connectionEvents);
      if (this.getConnectionEvents().length > this.maxConnections) {
        this.connectionEvents = [...this.connectionEvents.slice(0, this.getConnectionEvents().length - 1)];
      }
      this.callback(this.getConnectionEvents());
    };

    if (this.getLastConnectionEvent() === undefined) {
      return _add();
    }

    if (
      this.getLastConnectionEvent().connection?.type !== _action.connection?.type ||
      this.getLastConnectionEvent().connection?.isConnected !== _action.connection?.isConnected
    ) {
      return _add();
    }
  };

  setCallback = (_callback: Function) => (this.callback = _callback);

  resetCallback = () => (this.callback = () => {});

  clearConnectionEvents = () => (this.connectionEvents = []);

  getConnectionEvents = () => this.connectionEvents;

  getLastConnectionEvent = () => this.connectionEvents[0];
}

export default ConnectionLogger;
