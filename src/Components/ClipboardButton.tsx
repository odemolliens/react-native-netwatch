import * as React from 'react';
import { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../Theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IProps {
  onPress: () => void;
}

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
