import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';

const colors = {
  primary: '#FF6347',
  secondary: '#4CAF50',
  light: '#F0F0F0',
  dark: '#121212',
  white: '#FFFFFF',
  black: '#000000',
  red: '#D32F2F',
  gray: { 100: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 800: '#1F2937' },
};
const spacing = { sm: 8, md: 16, lg: 24, xl: 32 };
const typography = {
  h1: { fontSize: 28, fontWeight: 'bold' },
  h2: { fontSize: 22, fontWeight: 'bold' },
  body: { fontSize: 16 },
  caption: { fontSize: 12 },
};

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setMarker({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      // Reverse geocode
      let geo = await Location.reverseGeocodeAsync(loc.coords);
      if (geo && geo.length > 0) {
        const addr = `${geo[0].name || ''}, ${geo[0].street || ''}, ${geo[0].city || ''}, ${geo[0].region || ''}, ${geo[0].country || ''}`;
        setAddress(addr);
      }
    } catch (e) {
      setErrorMsg('Could not fetch location');
    }
    setLoading(false);
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    // Reverse geocode new marker
    try {
      let geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geo && geo.length > 0) {
        const addr = `${geo[0].name || ''}, ${geo[0].street || ''}, ${geo[0].city || ''}, ${geo[0].region || ''}, ${geo[0].country || ''}`;
        setAddress(addr);
      }
    } catch {
      setAddress('');
    }
  };

  const handleMarkerDragEnd = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    // Reverse geocode new marker
    try {
      let geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geo && geo.length > 0) {
        const addr = `${geo[0].name || ''}, ${geo[0].street || ''}, ${geo[0].city || ''}, ${geo[0].region || ''}, ${geo[0].country || ''}`;
        setAddress(addr);
      }
    } catch {
      setAddress('');
    }
  };

  const handleSaveAddress = () => {
    // Save address logic here (could be to backend or local)
    router.replace('/orders');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Location</Text>
      </View>
      <Text style={styles.sectionTitle}>Confirm Your Address</Text>
      <TouchableOpacity style={styles.locateButton} onPress={getLocation} disabled={loading}>
        <Ionicons name="location" size={20} color={colors.white} />
        <Text style={styles.locateButtonText}>{loading ? 'Locating...' : 'Use Current Location'}</Text>
      </TouchableOpacity>
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          region={region}
          onPress={handleMapPress}
        >
          {marker && (
            <Marker
              coordinate={marker}
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </MapView>
      )}
      <TextInput
        style={styles.addressInput}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address manually if needed"
        placeholderTextColor={colors.gray[500]}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress} disabled={!address}>
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerBack: { paddingRight: spacing.md },
  headerTitle: { ...typography.h2, fontSize: 20 },
  sectionTitle: {
    ...typography.h2,
    fontSize: 18,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  locateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: spacing.md,
    margin: spacing.md,
    justifyContent: 'center',
  },
  locateButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  errorText: { color: colors.red, textAlign: 'center', marginTop: spacing.md },
  map: {
    width: Dimensions.get('window').width - spacing.md * 2,
    height: 250,
    marginHorizontal: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  addressInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray[300],
    margin: spacing.md,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 60,
    color: colors.black,
  },
  saveButton: {
    backgroundColor: colors.primary,
    margin: spacing.md,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    opacity: 1,
  },
  saveButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});
