import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Settings, IProps } from '../Settings';
import { EnumFilterType, EnumSourceType, RequestMethod, SourceType } from '../../types';
import { RadioButton } from 'react-native-paper';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Settings test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onSetFilter = jest.fn();
  const onSetSource = jest.fn();
  const setCheckedSource = jest.fn();
  const setCheckedFilter = jest.fn();

  jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
  }));

  it('should render properly and all source radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedSource];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.All);
    givenComponent();
    const RadioButtonSource = component.find(RadioButton.Group).first();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioAllSource');
    expect(RadioButtonSource).not.toBeUndefined();
    expect(RadioButtonSource.first().prop('onValueChange')(EnumSourceType.All));
    expect(component.find(`[testID="RadioAllSource"]`).prop('value')).toBe(EnumSourceType.All);
    expect(setCheckedSource).toHaveBeenCalledTimes(1);
    expect(setCheckedSource).toHaveBeenCalledWith(EnumSourceType.All);
  });

  it('should render properly and redux source radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedSource];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.Redux);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioRedux');
    expect(component.find(`[testID="RadioRedux"]`).prop('value')).toBe(EnumSourceType.Redux);
    expect(setCheckedSource).toHaveBeenCalledTimes(1);
    expect(setCheckedSource).toHaveBeenCalledWith(EnumSourceType.Redux);
  });

  it('should render properly and react native request source radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedSource];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.ReactNativeRequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioRNR');
    expect(component.find(`[testID="RadioRNR"]`).prop('value')).toBe(EnumSourceType.ReactNativeRequest);
    expect(setCheckedSource).toHaveBeenCalledTimes(1);
    expect(setCheckedSource).toHaveBeenCalledWith(EnumSourceType.ReactNativeRequest);
  });

  it('should render properly and native request source radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedSource];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.Nativerequest);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioNR');
    expect(component.find(`[testID="RadioNR"]`).prop('value')).toBe(EnumSourceType.Nativerequest);
    expect(setCheckedSource).toHaveBeenCalledTimes(1);
    expect(setCheckedSource).toHaveBeenCalledWith(EnumSourceType.Nativerequest);
  });

  it('should render properly and all filter radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedFilter];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Get);
    givenComponent();
    const RadioButtonFilter = component.find(RadioButton.Group).last();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioAllMethod');
    expect(component.find(`[testID="RadioAllMethod"]`).prop('value')).toBe(EnumFilterType.All);
    expect(RadioButtonFilter).not.toBeUndefined();
    expect(RadioButtonFilter.prop('onValueChange')(EnumSourceType.All));
    expect(component.find(`[testID="RadioAllSource"]`).prop('value')).toBe(EnumSourceType.All);
    expect(setCheckedFilter).toHaveBeenCalledTimes(1);
    expect(setCheckedFilter).toHaveBeenCalledWith(EnumFilterType.All);
  });

  it('should render properly and GET filter radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedFilter];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.All);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioGet');
    expect(component.find(`[testID="RadioGet"]`).prop('value')).toBe(EnumFilterType.Get);
    expect(setCheckedFilter).toHaveBeenCalledTimes(1);
    expect(setCheckedFilter).toHaveBeenCalledWith(EnumFilterType.Get);
  });

  it('should render properly and POST filter radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedFilter];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Delete);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioPost');
    expect(component.find(`[testID="RadioPost"]`).prop('value')).toBe(EnumFilterType.Post);
    expect(setCheckedFilter).toHaveBeenCalledTimes(1);
    expect(setCheckedFilter).toHaveBeenCalledWith(EnumFilterType.Post);
  });

  it('should render properly and PUT filter radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedFilter];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Post);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioPut');
    expect(component.find(`[testID="RadioPut"]`).prop('value')).toBe(EnumFilterType.Put);
    expect(setCheckedFilter).toHaveBeenCalledTimes(1);
    expect(setCheckedFilter).toHaveBeenCalledWith(EnumFilterType.Put);
  });

  it('should render properly and DELETE filter radio pressed', () => {
    const useStateMock: any = (source: any) => [source, setCheckedFilter];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Put);
    givenComponent();
    expect(component).toMatchSnapshot();

    whenPressingButton('RadioDelete');
    expect(component.find(`[testID="RadioDelete"]`).prop('value')).toBe(EnumFilterType.Delete);
    expect(setCheckedFilter).toHaveBeenCalledTimes(1);
    expect(setCheckedFilter).toHaveBeenCalledWith(EnumFilterType.Delete);
  });

  it('should render properly and reset button pressed', () => {
    givenProps(EnumSourceType.Nativerequest, EnumFilterType.Put);
    givenComponent();
    expect(component).toMatchSnapshot();
    whenPressingButton('ResetButton');
    expect(component.find(`[testID="RadioAllSource"]`).prop('value')).toBe(EnumSourceType.All);
    expect(component.find(`[testID="RadioAllMethod"]`).prop('value')).toBe(EnumFilterType.All);
    expect(onSetSource).toHaveBeenCalledWith(EnumSourceType.All);
    expect(onSetFilter).toHaveBeenCalledWith(EnumFilterType.All);
  });

  // UTILITIES
  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  // GIVEN
  function givenComponent() {
    component = shallow(<Settings {...props} />);
  }

  // PROPS
  function givenProps(
    source: SourceType | EnumSourceType,
    filter: RequestMethod | EnumFilterType.All = EnumFilterType.Get,
  ) {
    props = {
      source,
      filter,
      onSetSource,
      onSetFilter,
    };
  }
});
