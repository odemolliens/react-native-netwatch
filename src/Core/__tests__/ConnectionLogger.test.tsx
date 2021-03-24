import { ConnectionLogger } from '../ConnectionLogger';
import ConnectionInfo from '../Objects/ConnectionInfo';

const logger = new ConnectionLogger();

const events = [
  new ConnectionInfo({
    _id: 1,
    type: 'CONNECT',
    startTime: Date.now(),
    connection: { type: 'wifi', isConnected: true },
  }),
  new ConnectionInfo({
    _id: 2,
    type: 'CONNECT',
    startTime: Date.now(),
    connection: { type: 'wifi', isConnected: false },
  }),
  new ConnectionInfo({
    _id: 3,
    type: 'CONNECT',
    startTime: Date.now(),
    connection: { type: '4g', isConnected: true },
  }),
  new ConnectionInfo({
    _id: 4,
    type: 'CONNECT',
    startTime: Date.now(),
    connection: { type: 'wifi', isConnected: false },
  }),
];
logger.connectionEvents = events;

describe('Connection Logger tests suite', () => {
  const globalDateConstructor = Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime());
  });

  afterAll(() => {
    global.Date.now = globalDateConstructor;
  });
  it('should get all connections events', () => {
    expect(logger.getConnectionEvents()).toEqual(events);
  });

  it('should get last connection event', () => {
    // events[0] because last entry is added on the first place
    expect(logger.getLastConnectionEvent()).toEqual(events[0]);
  });

  it('should clear connection events', () => {
    logger.clearConnectionEvents();
    expect(logger.getConnectionEvents()).toEqual([]);
  });

  it('should add an event', () => {
    logger.addEvent(
      new ConnectionInfo({
        _id: 5,
        type: 'CONNECT',
        startTime: Date.now(),
        connection: { type: 'wifi', isConnected: false },
      }),
    );
    expect(logger.getConnectionEvents()[0]._id).toEqual(5);
  });

  it('should reset callback', () => {
    const dummyFunction = () => 'Dummy';
    logger.setCallback(dummyFunction);
    expect(logger.callback()).toEqual('Dummy');
    logger.resetCallback();
    expect(logger.callback()).not.toEqual('Dummy');
  });
});
