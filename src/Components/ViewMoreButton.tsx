import * as React from 'react';
import { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../Theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface IProps {
  onPress: () => void;
}

// Button use in the details screens to go in the JSON tree view. It's just a button text.
export const ViewMoreButton: React.FC<IProps> = (props: IProps) => {
  const theme = useContext(ThemeContext);

  return (
    <TouchableOpacity
      testID="buttonViewMore"
      style={styles.container}
      onPress={() => {
        props.onPress();
      }}
    >
      <Text style={[{ color: theme.primaryColor, marginRight: 6 }]}>View more</Text>
      <MaterialCommunityIcons
        name="more"
        color={theme.primaryColor}
        size={14}
        style={{ transform: [{ rotateY: '180deg' }] }}
      />
    </TouchableOpacity>
  );
};

export default ViewMoreButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderLeftWidth: 0,
    alignItems: 'center',
  },
});
