import * as React from 'react';
import { useEffect, useState } from 'react';
import { EditMockResponse } from './EditMockResponse';
import { MockList } from './MockList';
import { View } from 'react-native';
import { MockResponse } from './utils';

export function MockingNavigator(props: {
  mockResponse?: MockResponse;
  onPressBack: (showDetails: boolean) => void;
  update: boolean;
}) {
  const [showList, setShowList] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [mockResponse, setMockResponse] = useState<MockResponse | undefined>();
  const [update, setUpdate] = useState(false);

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
            setShowList(false);
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
