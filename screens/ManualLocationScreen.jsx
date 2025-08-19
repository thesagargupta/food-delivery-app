import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManualLocationScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const mapRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Location suggestions
  const popularLocations = React.useMemo(() => [
    { id: '1', title: 'Use Current Location', icon: 'locate', type: 'current' },
    { id: '2', title: 'Home', icon: 'home', type: 'saved', address: 'Set your home address' },
    { id: '3', title: 'Work', icon: 'briefcase', type: 'saved', address: 'Set your work address' },
  ], []);

  // Debounced search function for dynamic suggestions
  const searchLocations = useCallback(async (searchQuery) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (searchQuery.trim() && searchQuery.length > 2) {
        setSearchLoading(true);
        try {
          // Use Location.geocodeAsync to search for places
          const results = await Location.geocodeAsync(searchQuery);
          
          // Create search suggestions from results
          const searchSuggestions = await Promise.all(
            results.slice(0, 5).map(async (result, index) => {
              try {
                // Try to get a readable address for each result
                const [address] = await Location.reverseGeocodeAsync({
                  latitude: result.latitude,
                  longitude: result.longitude,
                });
                
                const formattedAddress = address ? 
                  `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim() :
                  `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`;
                
                return {
                  id: `search_${index}`,
                  title: searchQuery,
                  address: formattedAddress,
                  latitude: result.latitude,
                  longitude: result.longitude,
                  type: 'search',
                  icon: 'location'
                };
              } catch (_error) {
                return {
                  id: `search_${index}`,
                  title: searchQuery,
                  address: `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`,
                  latitude: result.latitude,
                  longitude: result.longitude,
                  type: 'search',
                  icon: 'location'
                };
              }
            })
          );

          // Combine popular locations with search results
          setSuggestions([...popularLocations, ...searchSuggestions]);
        } catch (error) {
          console.error('Search error:', error);
          // On error, just show popular locations
          setSuggestions(popularLocations);
        } finally {
          setSearchLoading(false);
        }
      } else {
        // If search is empty or too short, show only popular locations
        setSuggestions(popularLocations);
        setSearchLoading(false);
      }
    }, 500); // 500ms delay for debouncing
  }, [popularLocations]);

  // Handle search text change
  const handleSearchChange = (text) => {
    setSearchText(text);
    setShowSuggestions(true);
    searchLocations(text);
  };

  // Initialize location
  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to show your current location on the map.',
          [
            { text: 'Grant Permission', onPress: getCurrentLocation },
            { text: 'Cancel', onPress: () => router.back() }
          ]
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(coords);
      
      const region = {
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(region);

      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync(coords);
      if (address) {
        const formattedAddress = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
        setSelectedAddress(formattedAddress);
        setSearchText(formattedAddress);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Unable to get your current location.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const searchLocation = async () => {
    if (!searchText.trim()) return;

    try {
      setLoading(true);
      const geocoded = await Location.geocodeAsync(searchText);
      
      if (geocoded.length > 0) {
        const coords = {
          latitude: geocoded[0].latitude,
          longitude: geocoded[0].longitude,
        };

        setCurrentLocation(coords);
        
        const region = {
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setMapRegion(region);

        // Animate to new location
        if (mapRef.current) {
          mapRef.current.animateToRegion(region, 1000);
        }

        // Get detailed address
        const [address] = await Location.reverseGeocodeAsync(coords);
        if (address) {
          const formattedAddress = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
          setSelectedAddress(formattedAddress);
        }
      } else {
        Alert.alert('Not Found', 'Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Unable to search for this location.');
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionPress = async (suggestion) => {
    setShowSuggestions(false);
    
    if (suggestion.type === 'current') {
      getCurrentLocation();
      return;
    }
    
    if (suggestion.type === 'search') {
      // Handle search results with coordinates
      const coords = {
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
      };
      
      setCurrentLocation(coords);
      setSearchText(suggestion.title);
      
      const region = {
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(region);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 1000);
      }
      
      // Try to get a better address for the coordinates
      try {
        const [address] = await Location.reverseGeocodeAsync(coords);
        if (address) {
          const formattedAddress = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
          setSelectedAddress(formattedAddress || suggestion.title);
        } else {
          setSelectedAddress(suggestion.title);
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        setSelectedAddress(suggestion.title);
      }
      return;
    }
    
    if (suggestion.type === 'popular') {
      try {
        const geocoded = await Location.geocodeAsync(suggestion.address);
        if (geocoded.length > 0) {
          const coords = {
            latitude: geocoded[0].latitude,
            longitude: geocoded[0].longitude,
          };
          
          setCurrentLocation(coords);
          setSearchText(suggestion.title);
          
          const region = {
            ...coords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setMapRegion(region);
          
          if (mapRef.current) {
            mapRef.current.animateToRegion(region, 1000);
          }
          
          setSelectedAddress(suggestion.title + ', ' + suggestion.address);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
  };

  // Initialize suggestions
  useEffect(() => {
    setSuggestions(popularLocations);
  }, [popularLocations]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const onMapPress = async (event) => {
    const coords = event.nativeEvent.coordinate;
    setCurrentLocation(coords);

    try {
      // Reverse geocode the tapped location
      const [address] = await Location.reverseGeocodeAsync(coords);
      if (address) {
        const formattedAddress = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
        setSelectedAddress(formattedAddress);
        setSearchText(formattedAddress);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const confirmLocation = async () => {
    if (selectedAddress && currentLocation) {
      try {
        // Save location to AsyncStorage
        const locationData = {
          address: selectedAddress,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          timestamp: Date.now()
        };
        
        await AsyncStorage.setItem('@user_location', JSON.stringify(locationData));
        
        Alert.alert(
          'Location Confirmed',
          `Your delivery location has been set to: ${selectedAddress}`,
          [
            { text: 'OK', onPress: () => router.back() }
          ]
        );
      } catch (error) {
        console.error('Error saving location:', error);
        Alert.alert('Error', 'Unable to save location. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select a location on the map.');
    }
  };

  const cardBackgroundColor = isDarkMode ? colors.gray[900] : colors.white;
  const textColor = isDarkMode ? colors.white : colors.black;
  const inputBackgroundColor = isDarkMode ? colors.gray[800] : colors.gray[100];

  if (loading && !mapRegion) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? colors.dark : colors.light }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: textColor }]}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? colors.dark : colors.light }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBackgroundColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Select Location</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: cardBackgroundColor }]}>
        <View style={[styles.searchBar, { backgroundColor: inputBackgroundColor }]}>
          <Ionicons name="search" size={20} color={colors.gray[500]} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search for area, street name..."
            placeholderTextColor={colors.gray[500]}
            value={searchText}
            onChangeText={handleSearchChange}
            onSubmitEditing={searchLocation}
            onFocus={() => setShowSuggestions(true)}
            returnKeyType="search"
          />
          {(loading || searchLoading) && <ActivityIndicator size="small" color={colors.primary} />}
        </View>
        
        {/* Suggestions */}
        {showSuggestions && (
          <View style={[styles.suggestionsContainer, { backgroundColor: cardBackgroundColor }]}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                // Add separator for search results
                const isFirstSearchResult = item.type === 'search' && 
                  (index === 0 || suggestions[index - 1].type !== 'search');
                
                return (
                  <>
                    {isFirstSearchResult && (
                      <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionHeaderText, { color: colors.gray[500] }]}>
                          Search Results
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionPress(item)}
                    >
                      <View style={[styles.suggestionIcon, { backgroundColor: isDarkMode ? colors.gray[700] : colors.gray[100] }]}>
                        <Ionicons 
                          name={item.icon} 
                          size={18} 
                          color={item.type === 'current' ? colors.primary : colors.gray[600]} 
                        />
                      </View>
                      <View style={styles.suggestionTextContainer}>
                        <Text style={[styles.suggestionTitle, { color: textColor }]}>
                          {item.title}
                        </Text>
                        {item.address && (
                          <Text style={[styles.suggestionAddress, { color: colors.gray[500] }]}>
                            {item.address}
                          </Text>
                        )}
                      </View>
                      {item.type === 'current' && (
                        <Ionicons name="locate" size={16} color={colors.primary} />
                      )}
                      {item.type === 'search' && (
                        <Ionicons name="arrow-up-left" size={16} color={colors.gray[400]} />
                      )}
                    </TouchableOpacity>
                  </>
                );
              }}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            />
          </View>
        )}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {mapRegion && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={mapRegion}
            onPress={(event) => {
              setShowSuggestions(false);
              onMapPress(event);
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            mapType={isDarkMode ? 'mutedStandard' : 'standard'}
          >
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="Selected Location"
                description={selectedAddress}
              >
                <View style={styles.customMarker}>
                  <Ionicons name="location" size={30} color={colors.primary} />
                </View>
              </Marker>
            )}
          </MapView>
        )}
        
        {/* Current Location Button */}
        <TouchableOpacity
          style={[styles.currentLocationButton, { backgroundColor: cardBackgroundColor }]}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Card */}
      <View style={[styles.bottomCard, { backgroundColor: cardBackgroundColor }]}>
        <View style={styles.handleBar} />
        
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <View style={styles.locationTextContainer}>
            <Text style={[styles.locationTitle, { color: textColor }]}>Selected Location</Text>
            <Text style={[styles.locationAddress, { color: colors.gray[600] }]}>
              {selectedAddress || 'Tap on map to select location'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: colors.primary }]}
          onPress={confirmLocation}
          disabled={!selectedAddress}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    ...typography.body,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h2,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    marginLeft: spacing.sm,
  },
  suggestionsContainer: {
    marginTop: spacing.sm,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray[200],
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionTitle: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionAddress: {
    ...typography.caption,
    fontSize: 12,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray[200],
  },
  sectionHeaderText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bottomCard: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  locationTitle: {
    ...typography.h3,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  locationAddress: {
    ...typography.body,
    lineHeight: 20,
  },
  confirmButton: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    ...typography.h3,
    fontWeight: '600',
  },
});

export default ManualLocationScreen;
