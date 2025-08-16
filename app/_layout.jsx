import React, { useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Animated, View, StyleSheet } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from "../contexts/AuthContext";

// Keep native splash visible until we hide it after our animation
SplashScreen.preventAutoHideAsync().catch(() => {});

function AppStack() {
  // Register both routes; hide headers globally via screen options
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="cart" options={{ title: "Cart" }} />
      <Stack.Screen name="allMenuItems" options={{ title: "All Menu Items" }} />
      <Stack.Screen name="restaurant-menu" options={{ title: "Restaurant Menu" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  // Animated values for a punchy logo animation
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const run = async () => {
      try {
        // sequence: fade in + pop, small bounce, settle
        await new Promise((res) => {
          Animated.sequence([
            Animated.parallel([
              Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
              Animated.timing(scale, { toValue: 1.08, duration: 350, useNativeDriver: true }),
              Animated.timing(translateY, { toValue: 0, duration: 350, useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(scale, { toValue: 0.96, duration: 160, useNativeDriver: true }),
            ]),
            Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }),
          ]).start(() => res());
        });

        // keep the splash visible a tick so the transition feels polished
        await new Promise((r) => setTimeout(r, 220));

        try {
          await SplashScreen.hideAsync();
        } catch (_e) {
          // ignore
        }
        setIsReady(true);
      } catch (_e) {
        setIsReady(true);
      }
    };
    run();
  }, [opacity, scale, translateY]);

  if (!isReady) {
    return (
      <View style={styles.splashContainer} pointerEvents="none">
        <Animated.Image
          source={require('../assets/images/icon.png')}
          style={[
            styles.logo,
            {
              transform: [{ scale }, { translateY }],
              opacity,
            },
          ]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppStack />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBF8', // warm background similar to brand (adjust as needed)
  },
  logo: {
    width: 140,
    height: 140,
  },
});
