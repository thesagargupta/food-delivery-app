import React from 'react';
import { View, StatusBar, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeScreen = ({ 
  children, 
  style, 
  backgroundColor, 
  includeTop = true, 
  includeBottom = false // Don't include bottom by default to avoid tab bar conflicts
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const defaultBackgroundColor = backgroundColor || (isDarkMode ? '#121212' : '#F5F5F5');

  return (
    <View style={[{ flex: 1, backgroundColor: defaultBackgroundColor }, style]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={{ 
        flex: 1,
        paddingTop: includeTop ? insets.top : 0,
        paddingBottom: includeBottom ? insets.bottom : 0,
      }}>
        {children}
      </View>
    </View>
  );
};

export default SafeScreen;
