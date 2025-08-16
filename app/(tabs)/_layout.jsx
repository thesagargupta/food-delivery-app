import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  HomeScreen, 
  AllMenuItemsScreen,
  DealsScreen, 
  OrdersScreen, 
  ProfileScreen 
} from '../../screens';

const Tab = createBottomTabNavigator();

const colors = {
  primary: '#FF6347', // Tomato Red
  secondary: '#FFA500', // Orange
  light: '#F5F5F5', // Light Gray
  dark: '#121212',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    800: '#1F2937',
  },
};

export default function TabLayout() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'deals') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDarkMode ? colors.gray[400] : colors.gray[500],
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.gray[800] : colors.white,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? colors.gray[600] : colors.gray[200],
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          height: 70 + insets.bottom,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: insets.bottom > 0 ? 0 : 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="index" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="menu" 
        component={AllMenuItemsScreen}
        options={{
          tabBarLabel: 'Menu',
        }}
      />
      <Tab.Screen 
        name="deals" 
        component={DealsScreen}
        options={{
          tabBarLabel: 'Deals',
          tabBarBadge: '•', // Hot deals indicator
        }}
      />
      <Tab.Screen 
        name="orders" 
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
        }}
      />
      <Tab.Screen 
        name="profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
