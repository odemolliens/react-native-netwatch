import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ActionDetails, IProps } from '../ActionDetails';
import ReduxAction from '../../Core/Objects/ReduxAction';
import ViewMoreButton from '../ViewMoreButton';

describe('Status test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onPressViewMore = jest.fn();

  it('should render properly redux action', () => {
    givenProps(mockAction, {
      label: '__ERROR:UNDEFINED__',
      payload:
        'This is a very long payload to be sure that we have more than 100 characters to explore all the branches present in this component',
    });
    givenComponent();
    expect(component).toMatchSnapshot();
  });

  it('should execute props.onPressViewMore', () => {
    givenProps(mockAction, {
      label: '__ERROR:UNDEFINED__',
      payload:
        'This is a very long payload to be sure that we have more than 100 characters to explore all the branches present in this component',
    });
    givenComponent();
    component.find(ViewMoreButton).simulate('press');
    expect(component).toMatchSnapshot();
  });

  // GIVEN
  function givenComponent() {
    component = shallow(<ActionDetails {...props} />);
  }

  function givenProps(item: ReduxAction, reduxAction) {
    props = {
      item,
      reduxAction,
      onPressViewMore,
    };
  }

  const mockAction: ReduxAction = new ReduxAction({
    _id: 73,
    startTime: 100,
    type: 'REDUX',
    stringifiedAction: "{ type: '__ERROR:UNDEFINED__', action: '' }",
    action: { type: '__ERROR:UNDEFINED__', action: '' },
  });
});
