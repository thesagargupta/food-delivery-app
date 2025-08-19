import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    FlatList,
    Animated,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { colors, spacing, typography } from '../styles';

const categories = [
    { id: '1', title: 'Offers', icon: 'pricetag', color: '#FF6B35' },
    { id: '2', title: 'Pizza', icon: 'pizza', color: '#FF8C42' },
    { id: '3', title: 'Burgers', icon: 'fast-food', color: '#FF6B6B' },
    { id: '4', title: 'Healthy', icon: 'leaf', color: '#4ECDC4' },
    { id: '5', title: 'Desserts', icon: 'ice-cream', color: '#96CEB4' },
];

const popularRestaurants = [
    {
        id: '1',
        name: 'The Pizza Place',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80',
        rating: 4.5,
        deliveryTime: '25-30 min',
        cuisine: 'Pizza, Italian',
    },
    {
        id: '2',
        name: 'Burger Queen',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
        rating: 4.3,
        deliveryTime: '20-25 min',
        cuisine: 'Burgers, Fast Food',
    },
    {
        id: '3',
        name: 'Wok & Roll',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80',
        rating: 4.8,
        deliveryTime: '30-35 min',
        cuisine: 'Asian, Noodles',
    },
];

const deals = [
    {
        id: '1',
        title: '50% OFF',
        subtitle: 'On your first order',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
    },
    {
        id: '2',
        title: 'Free Delivery',
        subtitle: 'On orders above ₹99',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80',
    }
]


function HomeScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
    const insets = useSafeAreaInsets();
    // Made-with-love banner state + animation
    const [bannerVisible, setBannerVisible] = useState(true);
    const bannerAnim = useRef(new Animated.Value(0)).current;

    // Location state
    const [currentLocation, setCurrentLocation] = useState('Fetching location...');
    const [locationLoading, setLocationLoading] = useState(true);

    // Profile state for header icon
    const PROFILE_CACHE_KEY = '@profile_cache';
    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80');
    const navigation = useNavigation();

    // Fetch profile image (similar logic to profile.jsx)
    const fetchProfileImage = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) return;
        // Try cache first
        try {
            const cachedProfile = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
            if (cachedProfile) {
                const parsedProfile = JSON.parse(cachedProfile);
                if (parsedProfile.uid === user.uid && parsedProfile.data?.image) {
                    setProfileImage(parsedProfile.data.image);
                    return;
                }
            }
        } catch {}
        // Fetch from Firestore
        try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.image) setProfileImage(userData.image);
            }
        } catch {}
    }, []);

    // Location functions
    const getCurrentLocation = useCallback(async () => {
        try {
            setLocationLoading(true);
            
            // First check if we have a saved location from ManualLocationScreen
            try {
                const savedLocation = await AsyncStorage.getItem('@user_location');
                if (savedLocation) {
                    const locationData = JSON.parse(savedLocation);
                    // Check if location is not too old (24 hours)
                    if (Date.now() - locationData.timestamp < 86400000) {
                        setCurrentLocation(locationData.address);
                        setLocationLoading(false);
                        return;
                    }
                }
            } catch (_storageError) {
                console.log('No saved location found');
            }
            
            // Request location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Location permission is required to show your delivery address. You can set it manually.',
                    [
                        { text: 'Set Manually', onPress: () => router.push('/ManualLocationScreen') },
                        { text: 'Try Again', onPress: getCurrentLocation },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                setCurrentLocation('Set location manually');
                setLocationLoading(false);
                return;
            }

            // Get current position
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            // Reverse geocode to get address
            const [address] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (address) {
                const formattedAddress = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
                setCurrentLocation(formattedAddress || 'Unknown location');
            } else {
                setCurrentLocation('Unable to get address');
            }
        } catch (error) {
            console.error('Location error:', error);
            Alert.alert(
                'Location Error',
                'Unable to get your current location. You can set it manually.',
                [
                    { text: 'Set Manually', onPress: () => router.push('/ManualLocationScreen') },
                    { text: 'Retry', onPress: getCurrentLocation },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
            setCurrentLocation('Set location manually');
        } finally {
            setLocationLoading(false);
        }
    }, [setCurrentLocation, setLocationLoading]);

    useEffect(() => {
        fetchProfileImage();
        getCurrentLocation();
        
        // Listen for navigation focus to refresh profile image and location
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProfileImage();
            getCurrentLocation();
        });
        return unsubscribe;
    }, [fetchProfileImage, navigation, getCurrentLocation]);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.dark : colors.light,
    };

    // Animate banner in when component mounts
    useEffect(() => {
        if (bannerVisible) {
            Animated.timing(bannerAnim, {
                toValue: 1,
                duration: 700,
                delay: 500, // Wait a bit before showing
                useNativeDriver: true,
            }).start();
        }
    }, [bannerVisible, bannerAnim]);

    const hideBanner = () => {
        Animated.timing(bannerAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setBannerVisible(false));
    };

    const bannerTranslateY = bannerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0] // Start from below the screen
    });
    const bannerOpacity = bannerAnim;

    const handleViewMenu = (restaurant) => {
        router.push({
            pathname: '/restaurant-menu',
            params: {
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                restaurantData: JSON.stringify(restaurant)
            }
        });
    };

    // --- RENDER FUNCTIONS ---
    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.selectedCategoryItem,
            ]}
            onPress={() => setSelectedCategory(item.id)}>
            <View style={[
                styles.categoryIconContainer,
                { backgroundColor: selectedCategory === item.id ? item.color : `${item.color}20` }
            ]}>
                <Ionicons
                    name={item.icon}
                    size={24}
                    color={selectedCategory === item.id ? colors.white : item.color}
                />
            </View>
            <Text
                style={[
                    styles.categoryText,
                    { color: isDarkMode ? colors.white : colors.black },
                    selectedCategory === item.id && styles.selectedCategoryText,
                ]}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );

    const renderRestaurantCard = ({ item }) => (
        <TouchableOpacity style={[styles.restaurantCard, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]} onPress={() => handleViewMenu(item)}>
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
                <Text style={[styles.restaurantName, { color: isDarkMode ? colors.white : colors.black }]}>{item.name}</Text>
                <Text style={[styles.restaurantCuisine, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>{item.cuisine}</Text>
                <View style={styles.restaurantDetails}>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={[styles.rating, { color: isDarkMode ? colors.white : colors.black }]}>{item.rating}</Text>
                    </View>
                    <Text style={[styles.deliveryTime, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>∙ {item.deliveryTime}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderDealCard = ({ item }) => (
        <View style={styles.dealCard}>
            <Image source={{ uri: item.image }} style={styles.dealImage} />
            <View style={styles.dealOverlay} />
            <View style={styles.dealTextContainer}>
                <Text style={styles.dealTitle}>{item.title}</Text>
                <Text style={styles.dealSubtitle}>{item.subtitle}</Text>
            </View>
        </View>
    )

    return (
        <View style={[styles.container, backgroundStyle]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent={true}
            />

            {/* Fixed Header Section */}
            <View style={[
                styles.fixedHeader,
                {
                    paddingTop: insets.top,
                    backgroundColor: isDarkMode ? colors.dark : colors.light,
                    borderBottomColor: isDarkMode ? colors.gray[800] : colors.gray[100]
                }
            ]}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.locationContainer}
                        onPress={() => router.push('/ManualLocationScreen')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.locationTextContainer}>
                            <View style={styles.titleRow}>
                                <Text style={styles.headerTitle}>Delivering to</Text>
                                <Ionicons 
                                    name="location" 
                                    size={16} 
                                    color={colors.primary}
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                            <View style={styles.addressRow}>
                                <Text style={[styles.headerSubtitle, { 
                                    color: isDarkMode ? colors.white : colors.black,
                                    flex: 1,
                                    opacity: locationLoading ? 0.6 : 1
                                }]}>
                                    {locationLoading ? 'Fetching location...' : currentLocation}
                                </Text>
                                {locationLoading && (
                                    <Animated.View style={{ 
                                        marginLeft: 8,
                                        transform: [{ 
                                            rotate: bannerAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg']
                                            })
                                        }]
                                    }}>
                                        <Ionicons 
                                            name="refresh" 
                                            size={16} 
                                            color={isDarkMode ? colors.gray[400] : colors.gray[600]} 
                                        />
                                    </Animated.View>
                                )}
                            </View>
                        </View>
                        <Ionicons 
                            name="chevron-down" 
                            size={20} 
                            color={isDarkMode ? colors.gray[400] : colors.gray[600]} 
                            style={{ marginLeft: 8 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.profileIcon, { backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100], overflow: 'hidden' }]}
                        onPress={() => router.push('/profile')}
                        accessibilityLabel="Profile"
                    >
                        <Image
                            source={{ uri: profileImage }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchSection}>
                    <View style={[styles.searchBar, { backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100] }]}>
                        <Ionicons
                            name="search"
                            size={20}
                            color={isDarkMode ? colors.gray[400] : colors.gray[500]}
                        />
                        <TextInput
                            placeholder="Search for restaurants or dishes"
                            placeholderTextColor={isDarkMode ? colors.gray[400] : colors.gray[500]}
                            style={[styles.searchInput, { color: isDarkMode ? colors.white : colors.black }]}
                        />
                    </View>
                </View>

                {/* Fixed Categories Section */}
                <View style={[
                    styles.categoriesWrapper,
                    { borderBottomColor: isDarkMode ? colors.gray[800] : colors.gray[100] }
                ]}>
                    <FlatList
                        horizontal
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryList}
                    />
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollableContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollableContentContainer}
                contentInsetAdjustmentBehavior="automatic">

                {/* Deals Section */}
                <View style={[styles.section, styles.firstSection]}>
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.black }]}>Deals for you</Text>
                    <FlatList
                        horizontal
                        data={deals}
                        renderItem={renderDealCard}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.dealsList}
                    />
                </View>

                {/* Popular Restaurants Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.black }]}>Popular Restaurants</Text>
                    {popularRestaurants.map(item => <View key={item.id}>{renderRestaurantCard({ item })}</View>)}
                </View>

            </ScrollView>

            {/* NEW: Made with Love Banner */}
            {bannerVisible && (
                <Animated.View style={[
                    styles.loveBanner,
                    {
                        bottom: insets.bottom + spacing.md,
                        backgroundColor: isDarkMode ? colors.gray[800] : colors.white,
                        borderColor: isDarkMode ? colors.gray[600] : colors.gray[100],
                        opacity: bannerOpacity,
                        transform: [{ translateY: bannerTranslateY }]
                    }
                ]}>
                    <Image
                        source={{ uri: 'https://media1.giphy.com/media/efULp0lT9SmiXb6yGk/giphy.gif' }}
                        style={styles.loveGif}
                    />
                    <View style={styles.loveTextWrap}>
                        <Text style={[styles.loveTitle, { color: isDarkMode ? colors.white : colors.black }]}>
                            Crafted with ❤️ in India
                        </Text>
                        <Text style={[styles.loveSubtitle, { color: isDarkMode ? colors.gray[300] : colors.gray[500] }]}>
                            By the Khao Piyo Team
                        </Text>
                    </View>
                    <TouchableOpacity onPress={hideBanner} style={styles.loveClose}>
                        <Ionicons
                            name="close"
                            size={20}
                            color={isDarkMode ? colors.gray[400] : colors.gray[500]}
                        />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fixedHeader: {
        backgroundColor: colors.light, // Set a default
        elevation: 4,
        zIndex: 1000,
    },
    scrollableContent: {
        flex: 1,
    },
    scrollableContentContainer: {
        paddingBottom: spacing.xl,
    },
    firstSection: {
        marginTop: spacing.sm,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: spacing.sm,
    },
    locationTextContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        ...typography.caption,
        color: colors.gray[500]
    },
    headerSubtitle: {
        ...typography.body,
        fontWeight: 'bold',
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchSection: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
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
    categoriesWrapper: {
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        marginTop: -12,
    },
    categoryList: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: spacing.md,
        paddingVertical: spacing.sm,
    },
    selectedCategoryItem: {
        borderBottomWidth: 3,
        borderBottomColor: colors.primary,
    },
    categoryIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    categoryText: {
        ...typography.body,
        fontWeight: '500',
        fontSize: 14,
    },
    selectedCategoryText: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    section: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    sectionTitle: {
        ...typography.h2,
        marginBottom: spacing.md,
    },
    dealsList: {
        gap: spacing.md,
    },
    dealCard: {
        width: 280,
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
    },
    dealImage: {
        width: '100%',
        height: '100%',
    },
    dealOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    dealTextContainer: {
        position: 'absolute',
        bottom: spacing.md,
        left: spacing.md,
    },
    dealTitle: {
        ...typography.h2,
        color: colors.white,
        fontWeight: 'bold',
    },
    dealSubtitle: {
        ...typography.body,
        color: colors.white,
    },
    restaurantCard: {
        marginBottom: spacing.lg,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 5,
    },
    restaurantImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    restaurantInfo: {
        padding: spacing.md,
    },
    restaurantName: {
        ...typography.h2,
        fontSize: 20,
        marginBottom: spacing.sm / 2,
    },
    restaurantCuisine: {
        ...typography.body,
        marginBottom: spacing.sm,
    },
    restaurantDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        ...typography.body,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    deliveryTime: {
        ...typography.body,
        marginLeft: spacing.sm
    },
    // NEW: Styles for the banner
    loveBanner: {
        position: 'absolute',
        left: spacing.md,
        right: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    loveGif: {
        width: 48,
        height: 48,
        borderRadius: 10,
        marginRight: 12,
    },
    loveTextWrap: {
        flex: 1,
    },
    loveTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    loveSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    loveClose: {
        marginLeft: 12,
        padding: 6,
    },
});

export default HomeScreen;