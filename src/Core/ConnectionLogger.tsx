import NetInfo from '@react-native-community/netinfo';
import { ConnectionInfo } from './Objects/ConnectionInfo';
import { NetInfoState } from '@react-native-community/netinfo/src/internal/types';

export class ConnectionLogger {
  static instance: ConnectionLogger;

  connectionEvents: ConnectionInfo[] = [];
  connectionCounter: number = 0;
  maxConnections: number = 50;

  constructor() {
    if (ConnectionLogger.instance) {
      return ConnectionLogger.instance;
    }
    ConnectionLogger.instance = this;

    NetInfo.addEventListener((state: NetInfoState) => {
      this.connectionEvents.push(
        new ConnectionInfo({
          _id: this.connectionCounter++,
          connection: state,
        }),
      );
    });
  }

  clearConnectionEvents = () => (this.connectionEvents = []);

  getConnectionEvents = () => this.connectionEvents;

  getLastConnectionEvent = () => this.connectionEvents[this.connectionEvents.length - 1];
}

export default ConnectionLogger;
