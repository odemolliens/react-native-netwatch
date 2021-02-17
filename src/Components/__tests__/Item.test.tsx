import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Item, IProps } from '../Item';
import { RNRequest } from '../../Core/Objects/RNRequest';

describe('Item test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onPress = jest.fn();

  it('should render properly', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should render properly & press item', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('itemTouchable-73');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<Item {...props} />);
  }

  function givenProps() {
    props = {
      onPress,
      item: mockRequest,
    };
  }

  // UTILITIES

  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  const mockRequest: RNRequest = {
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
  };
});
