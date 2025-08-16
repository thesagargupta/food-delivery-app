import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { 
  HomeScreen, 
  MenuScreen, 
  DealsScreen, 
  OrdersScreen, 
  ProfileScreen 
} from '../screens';

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

export default function TabNavigator() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Deals') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Profile') {
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
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
        }}
      />
      <Tab.Screen 
        name="Deals" 
        component={DealsScreen}
        options={{
          tabBarLabel: 'Deals',
          tabBarBadge: '🔥', // Hot deals indicator
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
