import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Main, IProps } from '../Main';
import ReduxAction from '../../Core/Objects/ReduxAction';
import { RNRequest } from '../../Core/Objects/RNRequest';

describe('Main test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onPress = jest.fn();
  const onPressClose = jest.fn();
  const onPressDetail = jest.fn();
  const clearAll = jest.fn();

  it('should render properly', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<Main {...props} />);
  }

  function givenProps() {
    props = {
      onPress,
      onPressClose,
      onPressDetail,
      reduxActions: mockActions,
      rnRequests: mockRequests,
      clearAll,
    };
  }

  const mockActions: ReduxAction[] = [
    {
      _id: 73,
      startTime: 100,
      type: 'REDUX',
      action: { type: '__ERROR:UNDEFINED__', action: '' },
    },
  ];

  const mockRequests: RNRequest[] = [
    {
      _id: 73,
      dataSent: 'dataSent',
      endTime: 1613477575757,
      method: 'GET',
      readyState: 4,
      response: 'response',
      responseContentType: 'application/json',
      responseSize: 0,
      responseType: 'blob',
      responseURL: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
      startTime: 1613477574742,
      status: 200,
      timeout: 0,
      type: 'RNR',
      url: 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9',
    },
  ];
});
