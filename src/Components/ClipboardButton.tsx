import * as React from 'react';
import { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../Theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface IProps {
  onPress: () => void;
}

// Button use in the details screens to copy to clipboard a text. It's just a button text.
export const ClipboardButton: React.FC<IProps> = (props: IProps) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity testID="buttonCopyToClipboard" style={styles.container} onPress={props.onPress}>
      <MaterialCommunityIcons name="clipboard-arrow-left-outline" color={theme.primaryColor} size={14} />
      <Text style={[{ color: theme.primaryColor, marginLeft: 6 }]}>Copy</Text>
    </TouchableOpacity>
  );
};

export default ClipboardButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderLeftWidth: 0,
    alignItems: 'center',
  },
});
