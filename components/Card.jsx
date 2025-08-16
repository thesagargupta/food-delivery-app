import React from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

const Card = ({ children, title, style }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={[
      styles.card,
      { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' },
      style
    ]}>
      {title && (
        <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          {title}
        </Text>
      )}
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
});

export default Card;
