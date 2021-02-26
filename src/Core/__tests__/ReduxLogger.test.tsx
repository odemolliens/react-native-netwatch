import {
  reduxLoggerMiddleware,
  setMaxActions,
  setCallback,
  clear,
  getStoredActions,
  getReduxActions,
  getMaxActions,
  initCurrentId,
  getCurrentId,
} from '../ReduxLogger';
import configureMockStore from 'redux-mock-store';

const createSuccess = (response) => ({
  type: 'APP_ACTION_SUCCESS',
  response,
});

// Create a mock store
const mockStore = configureMockStore();
const store = mockStore({});
describe('enableXHRInterception', () => {
  it('should set maxActions to 5', () => {
    expect(getMaxActions()).toEqual(100); // 100 is the default value
    setMaxActions(5);
    expect(getMaxActions()).toEqual(5);
  });

  it('should init currentID to 0', () => {
    initCurrentId(); // 100 is the default value
    expect(getCurrentId()).toEqual(0);
  });

  it('should clear actions', () => {
    clear(); // 100 is the default value
    expect(getReduxActions()).toEqual([]);
  });
  it('should dispatch simple action', () => {
    clear();
    store.dispatch(createSuccess('response'));
    expect(store.getActions()).toEqual([
      {
        type: 'APP_ACTION_SUCCESS',
        response: 'response',
      },
    ]);
  });

  it('should execute callback function when action is dispatched', () => {
    clear();
    const next = jest.fn();
    const callback = jest.fn();
    setCallback(callback);

    const action = { type: 'CONNECT' };
    reduxLoggerMiddleware(store)(next)(action);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  // TODO: Fix this test startTime change every time!
  it('should dispatch Redux actions and can be retrieve with getReduxAction', () => {
    clear();
    initCurrentId();
    setMaxActions(5);
    const next = jest.fn();

    const action1 = { type: 'CONNECT1' };
    const action2 = { type: 'CONNECT2' };
    const action3 = { type: 'CONNECT3' };
    reduxLoggerMiddleware(store)(next)(action1);
    reduxLoggerMiddleware(store)(next)(action2);
    reduxLoggerMiddleware(store)(next)(action3);
    // console.log(getReduxActions());
    expect(getReduxActions()).toBe([
      { _id: 1, startTime: 1614184734739, type: 'REDUX', action: { type: 'CONNECT1' } },
      { _id: 2, startTime: 1614184734739, type: 'REDUX', action: { type: 'CONNECT2' } },
      { _id: 3, startTime: 1614184734739, type: 'REDUX', action: { type: 'CONNECT3' } },
    ]);
  });

  it('should get how many actions stored', () => {
    clear();
    const next = jest.fn();

    const action1 = { type: 'CONNECT1' };
    const action2 = { type: 'CONNECT2' };
    const action3 = { type: 'CONNECT3' };
    const action4 = { type: 'CONNECT4' };
    reduxLoggerMiddleware(store)(next)(action1);
    reduxLoggerMiddleware(store)(next)(action2);
    reduxLoggerMiddleware(store)(next)(action3);
    reduxLoggerMiddleware(store)(next)(action4);
    expect(getStoredActions()).toEqual(4);
  });

  it('should limit how many actions logged', () => {
    clear();
    setMaxActions(2);
    const next = jest.fn();

    const action1 = { type: 'CONNECT1' };
    const action2 = { type: 'CONNECT2' };
    const action3 = { type: 'CONNECT3' };
    reduxLoggerMiddleware(store)(next)(action1);
    reduxLoggerMiddleware(store)(next)(action2);
    reduxLoggerMiddleware(store)(next)(action3);

    expect(getStoredActions()).toEqual(2);
    expect(getReduxActions()[getReduxActions().length - 1].action.type).toEqual('CONNECT2');
  });

  it('should return last action at index 0 in the list', () => {
    clear();
    const next = jest.fn();

    const action1 = { type: 'CONNECT1' };
    const action2 = { type: 'CONNECT2' };
    const action3 = { type: 'CONNECT3' };
    reduxLoggerMiddleware(store)(next)(action1);
    reduxLoggerMiddleware(store)(next)(action2);
    reduxLoggerMiddleware(store)(next)(action3);

    expect(getReduxActions()[0].action.type).toEqual('CONNECT3');
  });

  it('should keep current value if maxActions is invalid', () => {
    setMaxActions(100);
    const maxActions = getMaxActions();
    expect(maxActions).toEqual(100);

    // @ts-ignore
    setMaxActions('Bad value');
    expect(maxActions).toEqual(100);
  });
});
