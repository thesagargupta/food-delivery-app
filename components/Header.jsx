import React from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

const Header = ({ title }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={[styles.header, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
      <Text style={[styles.headerText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Header;
