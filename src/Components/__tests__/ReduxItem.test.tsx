import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ReduxItem, IProps } from '../ReduxItem';
import ReduxAction from '../../Core/Objects/ReduxAction';

describe('ReduxItem test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;

  it('should render properly', () => {
    givenProps();
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<ReduxItem {...props} />);
  }

  function givenProps() {
    props = {
      item: mockAction,
    };
  }

  const mockAction: ReduxAction = {
    _id: 73,
    startTime: 100,
    type: 'REDUX',
    action: { type: '__ERROR:UNDEFINED__', action: '' },
  };
});
