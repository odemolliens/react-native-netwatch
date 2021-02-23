import * as React from 'react';
import { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { ThemeContext } from '../Theme';
import { SourceType, RequestMethod, EnumFilterType, EnumSourceType } from '../types';
import { Title } from '../Components/Text';

export interface IProps {
  testId?: string;
  onDismiss: () => void;
  source: SourceType | EnumSourceType | string;
  onSetSource: (value: any) => void;
  filter: RequestMethod | EnumFilterType.All;
  onSetFilter: (value: RequestMethod | EnumFilterType.All) => void;
  onPressClear: () => void;
}

export const Settings = (props: IProps) => {
  const theme = useContext(ThemeContext);
  const [checkedSource, setCheckedSource] = React.useState(props.source);
  const [checkedFilter, setCheckedFilter] = React.useState(props.filter);
  const disabledFilter = props.source === EnumSourceType.Redux;

  const resetFilters = () => {
    props.onSetSource(EnumSourceType.All);
    props.onSetFilter(EnumFilterType.All);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.gray900 }]}>
      <View style={{ flex: 1 }}>
        <Title style={[styles.title, { color: theme.gray50 }]}>Display:</Title>
        <RadioButton.Group onValueChange={(value) => props.onSetSource(value)} value={props.source}>
          <RadioButton.Item
            value={EnumSourceType.All}
            status={checkedSource === EnumSourceType.All ? 'checked' : 'unchecked'}
            onPress={() => setCheckedSource(EnumSourceType.All)}
            testID={'RadioAllSource'}
            label="All Requests and Actions"
            mode="android"
            style={styles.radioButton}
            labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
            color={theme.blue500}
            uncheckedColor={theme.blue500}
          />

          <RadioButton.Item
            value={EnumSourceType.Redux}
            status={checkedSource === EnumSourceType.Redux ? 'checked' : 'unchecked'}
            onPress={() => setCheckedSource(EnumSourceType.Redux)}
            testID={'RadioRedux'}
            label="Redux Action"
            mode="android"
            style={styles.radioButton}
            labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
            color={theme.blue500}
            uncheckedColor={theme.blue500}
          />

          <RadioButton.Item
            value={EnumSourceType.ReactNativeRequest}
            status={checkedSource === EnumSourceType.ReactNativeRequest ? 'checked' : 'unchecked'}
            onPress={() => setCheckedSource(EnumSourceType.ReactNativeRequest)}
            testID={'RadioRNR'}
            label="React Native Requests"
            labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
            mode="android"
            style={styles.radioButton}
            color={theme.blue500}
            uncheckedColor={theme.blue500}
          />

          <RadioButton.Item
            value={EnumSourceType.Nativerequest}
            status={checkedSource === EnumSourceType.Nativerequest ? 'checked' : 'unchecked'}
            onPress={() => setCheckedSource(EnumSourceType.Nativerequest)}
            testID={'RadioNR'}
            label="Native Requests"
            labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
            mode="android"
            style={styles.radioButton}
            color={theme.blue500}
            uncheckedColor={theme.blue500}
          />
        </RadioButton.Group>

        {!disabledFilter && (
          <>
            <Title style={[styles.title, { color: theme.gray50 }]}>Type:</Title>
            <RadioButton.Group
              onValueChange={(value) => props.onSetFilter(value)}
              value={props.filter}
            >
              <RadioButton.Item
                value={EnumFilterType.All}
                status={checkedFilter === EnumFilterType.All ? 'checked' : 'unchecked'}
                onPress={() => setCheckedFilter(EnumFilterType.All)}
                testID={'RadioAllMethod'}
                label="ALL"
                mode="android"
                style={styles.radioButton}
                labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
                color={theme.blue500}
                uncheckedColor={theme.blue500}
              />

              <RadioButton.Item
                value={EnumFilterType.Get}
                status={checkedFilter === EnumFilterType.Get ? 'checked' : 'unchecked'}
                onPress={() => setCheckedFilter(EnumFilterType.Get)}
                testID={'RadioGet'}
                label="GET"
                mode="android"
                style={styles.radioButton}
                labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
                color={theme.blue500}
                uncheckedColor={theme.blue500}
              />

              <RadioButton.Item
                value={EnumFilterType.Post}
                status={checkedFilter === EnumFilterType.Post ? 'checked' : 'unchecked'}
                onPress={() => setCheckedFilter(EnumFilterType.Post)}
                testID={'Radiopost'}
                label="POST"
                labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
                mode="android"
                style={styles.radioButton}
                color={theme.blue500}
                uncheckedColor={theme.blue500}
              />

              <RadioButton.Item
                value={EnumFilterType.Put}
                status={checkedFilter === EnumFilterType.Put ? 'checked' : 'unchecked'}
                onPress={() => setCheckedFilter(EnumFilterType.Put)}
                testID={'RadioPut'}
                label="PUT"
                labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
                mode="android"
                style={styles.radioButton}
                color={theme.blue500}
                uncheckedColor={theme.blue500}
              />

              <RadioButton.Item
                value={EnumFilterType.Delete}
                status={checkedFilter === EnumFilterType.Delete ? 'checked' : 'unchecked'}
                onPress={() => setCheckedFilter(EnumFilterType.Delete)}
                testID={'RadioDelete'}
                label="DELETE"
                labelStyle={[styles.radioButtonLabel, { color: theme.gray50 }]}
                mode="android"
                style={styles.radioButton}
                color={theme.blue500}
                uncheckedColor={theme.blue500}
              />
            </RadioButton.Group>
          </>
        )}
      </View>
      <View>
        <TouchableOpacity
          style={[styles.applyFilterButton, { backgroundColor: theme.blue500 }]}
          onPress={resetFilters}
        >
          <Title style={[{ color: theme.gray900 }]}>Reset filters</Title>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 24,
    fontSize: 16,
    paddingLeft: 24,
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row-reverse',
    height: 42,
  },
  radioButtonLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  applyFilterButton: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
    marginHorizontal: 24,
  },
});
