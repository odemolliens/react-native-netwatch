import * as React from 'react';
import { useEffect } from 'react';
import { EditMockResponse } from './EditMockResponse';
import { MockList } from './MockList';
import { View } from 'react-native';
import { MockResponse } from './utils';

export function MockingNavigator(props: {
  mockResponse?: MockResponse;
  onPressBack: (showDetails: boolean) => void;
  update: boolean;
}) {
  const [showList, setShowList] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [mockResponse, setMockResponse] = React.useState<MockResponse | undefined>();
  const [update, setUpdate] = React.useState(false);

  useEffect(() => {
    setShowList(!props.mockResponse);
    setShowEdit(!!props.mockResponse);
    setMockResponse(props.mockResponse);
    setUpdate(props.update);
  }, [props.mockResponse, props.update]);

  return (
    <View style={{ flex: 1 }}>
      {showList && (
        <MockList
          onPressBack={() => props.onPressBack(false)}
          showEdit={mr => {
            setShowEdit(true);
            setMockResponse(mr);
            setUpdate(true);
          }}
        />
      )}
      {showEdit && mockResponse && (
        <EditMockResponse
          update={update}
          mockResponse={mockResponse}
          onPressBack={() => {
            setShowList(true);
            setShowEdit(false);
          }}
        />
      )}
    </View>
  );
}
