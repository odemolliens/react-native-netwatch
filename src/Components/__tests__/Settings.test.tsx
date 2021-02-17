import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Settings, IProps } from '../Settings';
import { EnumFilterType, EnumSourceType, RequestMethod, SourceType } from '../../types';

describe('Settings test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onDismiss = jest.fn();
  const onPressClear = jest.fn();
  const onSetFilter = jest.fn();
  const onSetSource = jest.fn();

  it('should render properly All Item & press all radio', () => {
    givenProps(EnumSourceType.All);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioAll');
  });

  it('should render properly Redux Item & press Redux filter', () => {
    givenProps(EnumSourceType.Redux);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioRedux');
  });

  it('should render properly ReactNativeRequest Item & press ReactNativeRequest filter', () => {
    givenProps(EnumSourceType.ReactNativeRequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioRNR');
  });

  it('should render properly Nativerequest Item & press Nativerequest filter', () => {
    givenProps(EnumSourceType.Nativerequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioNR');
  });

  it('should render properly Nativerequest Item & all button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Get);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('ButtonAll');
  });

  it('should render properly Nativerequest Item & get button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.All);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('ButtonGet');
  });

  it('should render properly Nativerequest Item & post button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Delete);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('ButtonPost');
  });

  it('should render properly Nativerequest Item & put button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Post);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('ButtonPut');
  });

  it('should render properly Nativerequest Item & delete button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Put);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('ButtonDel');
  });

  it('should render properly Nativerequest Item & done button', () => {
    givenProps(EnumSourceType.Nativerequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('ButtonDone');
  });
  // UTILITIES

  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  // GIVEN
  function givenComponent() {
    component = shallow(<Settings {...props} />);
  }

  function givenProps(
    source: SourceType | EnumSourceType,
    filter: RequestMethod | EnumFilterType.All = EnumFilterType.Get,
  ) {
    props = {
      visible: true,
      onDismiss,
      source,
      filter,
      onSetSource,
      onSetFilter,
      onPressClear,
    };
  }
});
