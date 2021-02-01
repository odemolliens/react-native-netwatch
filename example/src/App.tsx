import React, { useEffect } from 'react';
import { Netwatch } from 'react-native-netwatch';
import { connect, Provider } from 'react-redux';
import store from './redux/store';
import { actionRequest } from './redux/actions/appActions';
import { Dispatch } from 'redux';

const App = () => {
  useEffect(() => {});

  return (
    <Provider store={store}>
      <ConnectedComponent />
    </Provider>
  );
};

export function mapDispatchToProps(dispatch: Dispatch, props: any): any {
  return {
    ...props,
    customAction: () => dispatch(actionRequest()),
  };
}

const ConnectedComponent = connect(null, mapDispatchToProps)(Netwatch);

export default App;
