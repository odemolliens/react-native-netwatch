import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Settings, IProps } from '../Settings';
import { EnumFilterType, EnumSourceType, RequestMethod, SourceType } from '../../types';

describe('Settings test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onSetFilter = jest.fn();
  const onSetSource = jest.fn();

  it('should render properly All Item & press all radio', () => {
    givenProps(EnumSourceType.All);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioAllSource');
    expect(component.find(`[testID="RadioAllSource"]`).prop('value')).toBe(EnumSourceType.All);
  });

  it('should render properly Redux Item & press Redux filter', () => {
    givenProps(EnumSourceType.Redux);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioRedux');
    expect(component.find(`[testID="RadioRedux"]`).prop('value')).toBe(EnumSourceType.Redux);
  });

  it('should render properly ReactNativeRequest Item & press ReactNativeRequest filter', () => {
    givenProps(EnumSourceType.ReactNativeRequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioRNR');
    expect(component.find(`[testID="RadioRNR"]`).prop('value')).toBe(
      EnumSourceType.ReactNativeRequest
    );
  });

  it('should render properly Nativerequest Item & press Nativerequest filter', () => {
    givenProps(EnumSourceType.Nativerequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioNR');
    expect(component.find(`[testID="RadioNR"]`).prop('value')).toBe(EnumSourceType.Nativerequest);
  });

  it('should render properly Nativerequest Item & all button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Get);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioAllMethod');
    expect(component.find(`[testID="RadioAllMethod"]`).prop('value')).toBe(EnumFilterType.All);
  });

  it('should render properly Nativerequest Item & get button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.All);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioGet');
    expect(component.find(`[testID="RadioGet"]`).prop('value')).toBe(EnumFilterType.Get);
  });

  it('should render properly Nativerequest Item & post button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Delete);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioPost');
    expect(component.find(`[testID="RadioPost"]`).prop('value')).toBe(EnumFilterType.Post);
  });

  it('should render properly Nativerequest Item & put button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Post);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioPut');
    expect(component.find(`[testID="RadioPut"]`).prop('value')).toBe(EnumFilterType.Put);
  });

  it('should render properly Nativerequest Item & delete button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Put);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioDelete');
    expect(component.find(`[testID="RadioDelete"]`).prop('value')).toBe(EnumFilterType.Delete);
  });

  it('should render properly Nativerequest Item & reset button', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Put);
    givenComponent();
    expect(component).toMatchSnapshot();
    whenPressingButton('ResetButton');
    expect(component.find(`[testID="RadioAllSource"]`).prop('value')).toBe(EnumSourceType.All);
    expect(component.find(`[testID="RadioAllMethod"]`).prop('value')).toBe(EnumFilterType.All);
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
    filter: RequestMethod | EnumFilterType.All = EnumFilterType.Get
  ) {
    props = {
      source,
      filter,
      onSetSource,
      onSetFilter,
    };
  }
});
