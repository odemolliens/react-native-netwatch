import { ILog, LogType } from '../../types';
import { NetInfoState } from '@react-native-community/netinfo/src/internal/types';

export class ConnectionInfo implements ILog {
  _id: number = -1;
  type: LogType = 'CONNECT';
  startTime: number = Date.now();
  connection: NetInfoState | null = null;

  constructor(attributes?: any) {
    Object.assign(this, attributes);
  }
}

export default ConnectionInfo;
