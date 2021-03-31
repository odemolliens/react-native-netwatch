import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Indicator, IProps } from '../Indicator';
import { Title } from '../Text';

describe('Indicator test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  let useEffect;
  let mockUseEffect;
  const setIsOpened = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    useEffect = jest.spyOn(React, 'useEffect');
    mockUseEffect = () => {
      useEffect.mockImplementationOnce(f => f());
    };

    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useState: jest.fn(),
    }));
  });

  describe('Tests source', () => {
    it('should render properly', () => {
      givenProps();
      givenComponent();
      expect(component).toMatchSnapshot();
    });

    it('should called setIsOpened', () => {
      const useStateMock: any = isOpened => [isOpened, setIsOpened];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      givenProps();
      mockUseEffect();
      givenComponent();
      whenPressingButton('openStatsButton');
      expect(component).toMatchSnapshot();
      expect(setIsOpened).toHaveBeenCalledTimes(1);
    });

    it('should show full indicator with many failed', () => {
      const useStateMock: any = isOpened => [true, setIsOpened];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      givenProps(5, 5, 90);
      givenComponent();
      whenPressingButton('openStatsButton');
      mockUseEffect();
      expect(component).toMatchSnapshot();
      expect(setIsOpened).toHaveBeenCalledTimes(1);
      expect(component.find(Title)).toHaveLength(1);
      expect(component.find(Title).prop('children')).toEqual('90%');
    });

    it('should show full indicator with many success', () => {
      const useStateMock: any = isOpened => [true, setIsOpened];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      givenProps(75, 20, 5);
      givenComponent();
      whenPressingButton('openStatsButton');
      mockUseEffect();
      expect(component).toMatchSnapshot();
      expect(setIsOpened).toHaveBeenCalledTimes(1);
      expect(component.find(Title)).toHaveLength(2);
      expect(component.find(Title).at(0).prop('children')).toEqual('75%');
      expect(component.find(Title).at(1).prop('children')).toEqual('20%');
      expect(component.find(Title).at(2)).toEqual({});
    });
  });

  // UTILITIES
  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  // GIVEN
  function givenComponent() {
    component = shallow(<Indicator {...props} />);
  }

  function givenProps(success: number = 34, warning: number = 33, failed: number = 33) {
    props = {
      success,
      warning,
      failed,
    };
  }
});
