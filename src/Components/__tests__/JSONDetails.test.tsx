import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { JSONDetails, IProps } from '../JSONDetails';
// Need to use this lib to render child correctly
import { render } from '@testing-library/react-native';

describe('Main test suite', () => {
  let component: ShallowWrapper;
  let props: IProps;
  const onPressBack = jest.fn();

  it('should render properly without title', () => {
    givenProps(stringData);
    const { toJSON } = render(<JSONDetails {...props} />)
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render properly', () => {
    givenProps(stringData, 'JSONDetails');
    givenProps(stringData);
    const { toJSON } = render(<JSONDetails {...props} />)
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render properly and go back', () => {
    givenProps(stringData, 'JSONDetails');
    givenComponent();
    whenPressingButton('buttonBackToDetailsScreen');
    expect(props.onPressBack).toHaveBeenCalledTimes(1);
    expect(props.onPressBack).toHaveBeenCalledWith(false);
  });

  // UTILITIES
  function whenPressingButton(testId: string) {
    component.find(`[testID="${testId}"]`).simulate('press');
  }

  // GIVEN
  function givenComponent() {
    component = shallow(<JSONDetails {...props} />);
  }

  function givenProps(data: string = '{}', title?: string) {
    props = {
      onPressBack,
      data,
      title,
    };
  }
})
  
const stringData = JSON.stringify({
    "args": {
      "query": "some really long query that goes onto multiple lines so we can test what happens"
    },
    "data": {
      "test": "hello"
    },
    "files": {},
    "form": {},
    "headers": {
      "x-forwarded-proto": "https",
      "x-forwarded-port": "443",
      "host": "postman-echo.com",
      "x-amzn-trace-id": "Root=1-605871d5-7bf937ce7fd0d4c0392726bc",
      "content-length": "16",
      "content-type": "application/json",
      "accept": "*/*",
      "x-special": "dev-test",
      "if-none-match": "W/\"32e-r/l1NhNWVizxAiJazd2G/2G3rHs\"",
      "accept-language": "en-us",
      "accept-encoding": "gzip, deflate, br",
      "user-agent": "example/1 CFNetwork/1220.1 Darwin/20.3.0",
      "x-others": "Another test with a very very long string just to see how it is render in the application and if it is all done",
      "cookie": "sails.sid=s%3A9fHegW1j43POAQ8xKlXTuE7wfhWp9guw.ZM4PklZGQHdDSAeo7%2FqvaE3LjGdLyf9KcAuv6cK0hpY"
    },
    "json": {
      "test": "hello"
    },
    "url": "https://postman-echo.com/post?query=some%20really%20long%20query%20that%20goes%20onto%20multiple%20lines%20so%20we%20can%20test%20what%20happens"
  })
  
