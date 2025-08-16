import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- DUMMY DATA ---
// In a real app, this would come from props or an API call based on the selected restaurant
const restaurantInfo = {
  name: 'The Pizza Place',
  image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80',
  rating: 4.5,
  deliveryTime: '25-30 min',
  cuisine: 'Pizza, Italian',
  address: '123 Pizza St, Foodie Town',
};

const menuData = [
  {
    category: 'Recommended',
    items: [
      {
        id: '1',
        name: 'Butter Chicken',
        price: 320,
        originalPrice: 380,
        description: 'Creamy tomato-based curry with tender chicken pieces served with basmati rice.',
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80',
        isVeg: false,
        rating: 4.5,
        restaurant: 'The Spice Kitchen',
        isPopular: true,
      },
      {
        id: '2',
        name: 'Paneer Tikka',
        price: 250,
        originalPrice: 290,
        description: 'Marinated cottage cheese cubes grilled with bell peppers and onions.',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80',
        isVeg: true,
        rating: 4.4,
        restaurant: 'Vegetarian Delight',
        isPopular: true,
      },
    ],
  },
  {
    category: 'Chicken',
    items: [
      {
        id: '3',
        name: 'Butter Chicken',
        price: 320,
        originalPrice: 380,
        description: 'Creamy tomato-based curry with tender chicken pieces.',
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80',
        isVeg: false,
        rating: 4.5,
        restaurant: 'The Spice Kitchen',
        isPopular: true,
      },
      {
        id: '4',
        name: 'Chicken Tikka',
        price: 280,
        originalPrice: 320,
        description: 'Marinated chicken grilled to perfection with aromatic spices.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80',
        isVeg: false,
        rating: 4.3,
        restaurant: 'Grill Master',
        isPopular: false,
      },
      {
        id: '5',
        name: 'Chicken Biryani',
        price: 350,
        originalPrice: 400,
        description: 'Aromatic basmati rice with tender chicken and traditional spices.',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=500&q=80',
        isVeg: false,
        rating: 4.7,
        restaurant: 'Biryani House',
        isPopular: true,
      },
      {
        id: '6',
        name: 'Chicken Curry',
        price: 290,
        originalPrice: 340,
        description: 'Traditional home-style chicken curry with rich gravy.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80',
        isVeg: false,
        rating: 4.2,
        restaurant: 'Home Kitchen',
        isPopular: false,
      },
    ],
  },
  {
    category: 'Paneer',
    items: [
      {
        id: '7',
        name: 'Paneer Tikka',
        price: 250,
        originalPrice: 290,
        description: 'Marinated cottage cheese cubes grilled with bell peppers.',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80',
        isVeg: true,
        rating: 4.4,
        restaurant: 'Vegetarian Delight',
        isPopular: true,
      },
      {
        id: '8',
        name: 'Paneer Butter Masala',
        price: 280,
        originalPrice: 320,
        description: 'Rich and creamy paneer curry with butter and aromatic spices.',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
        isVeg: true,
        rating: 4.6,
        restaurant: 'Curry Corner',
        isPopular: false,
      },
      {
        id: '9',
        name: 'Palak Paneer',
        price: 260,
        originalPrice: 300,
        description: 'Fresh spinach curry with soft paneer cubes.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80',
        isVeg: true,
        rating: 4.3,
        restaurant: 'Green Garden',
        isPopular: false,
      },
      {
        id: '10',
        name: 'Kadai Paneer',
        price: 270,
        originalPrice: 310,
        description: 'Paneer cooked in traditional kadai with bell peppers and tomatoes.',
        image: 'https://images.unsplash.com/photo-1628294896516-118579d2a948?w=500&q=80',
        isVeg: true,
        rating: 4.1,
        restaurant: 'Spice Route',
        isPopular: false,
      },
    ],
  },
  {
    category: 'Pizza',
    items: [
      {
        id: '11',
        name: 'Margherita Pizza',
        price: 299,
        originalPrice: 350,
        description: 'Classic pizza with fresh tomatoes, mozzarella, and basil.',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80',
        isVeg: true,
        rating: 4.2,
        restaurant: 'The Pizza Place',
        isPopular: true,
      },
      {
        id: '12',
        name: 'Pepperoni Pizza',
        price: 399,
        originalPrice: 450,
        description: 'Delicious pizza topped with pepperoni and extra cheese.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
        isVeg: false,
        rating: 4.5,
        restaurant: 'The Pizza Place',
        isPopular: false,
      },
      {
        id: '13',
        name: 'Veggie Supreme',
        price: 379,
        originalPrice: 420,
        description: 'Loaded with fresh vegetables, olives, and cheese.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
        isVeg: true,
        rating: 4.3,
        restaurant: 'The Pizza Place',
        isPopular: false,
      },
    ],
  },
  {
    category: 'Burgers',
    items: [
      {
        id: '14',
        name: 'Classic Burger',
        price: 199,
        originalPrice: 240,
        description: 'Juicy beef patty with lettuce, tomato, and cheese.',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
        isVeg: false,
        rating: 4.3,
        restaurant: 'Burger Queen',
        isPopular: true,
      },
      {
        id: '15',
        name: 'Veg Burger',
        price: 149,
        originalPrice: 180,
        description: 'Fresh veggie patty with salad and special sauce.',
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80',
        isVeg: true,
        rating: 4.1,
        restaurant: 'Burger Queen',
        isPopular: false,
      },
      {
        id: '16',
        name: 'Chicken Burger',
        price: 219,
        originalPrice: 260,
        description: 'Grilled chicken breast with fresh lettuce and mayo.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
        isVeg: false,
        rating: 4.4,
        restaurant: 'Burger Queen',
        isPopular: false,
      },
    ],
  },
  {
    category: 'Chinese',
    items: [
      {
        id: '17',
        name: 'Chicken Noodles',
        price: 220,
        originalPrice: 260,
        description: 'Stir-fried noodles with chicken and fresh vegetables.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80',
        isVeg: false,
        rating: 4.4,
        restaurant: 'Wok & Roll',
        isPopular: true,
      },
      {
        id: '18',
        name: 'Veg Fried Rice',
        price: 180,
        originalPrice: 210,
        description: 'Aromatic fried rice with mixed vegetables and soy sauce.',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80',
        isVeg: true,
        rating: 4.2,
        restaurant: 'Wok & Roll',
        isPopular: false,
      },
      {
        id: '19',
        name: 'Chicken Manchurian',
        price: 250,
        originalPrice: 290,
        description: 'Crispy chicken balls in sweet and tangy Manchurian sauce.',
        image: 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=500&q=80',
        isVeg: false,
        rating: 4.5,
        restaurant: 'Dragon House',
        isPopular: false,
      },
      {
        id: '20',
        name: 'Veg Spring Rolls',
        price: 160,
        originalPrice: 190,
        description: 'Crispy spring rolls filled with fresh vegetables.',
        image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?w=500&q=80',
        isVeg: true,
        rating: 4.0,
        restaurant: 'Dragon House',
        isPopular: false,
      },
    ],
  },
  {
    category: 'Desserts',
    items: [
      {
        id: '21',
        name: 'Chocolate Brownie',
        price: 120,
        originalPrice: 150,
        description: 'Rich and fudgy chocolate brownie with vanilla ice cream.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
        isVeg: true,
        rating: 4.6,
        restaurant: 'Sweet Treats',
        isPopular: true,
      },
      {
        id: '22',
        name: 'Gulab Jamun',
        price: 80,
        originalPrice: 100,
        description: 'Traditional Indian sweet dumplings in sugar syrup.',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&q=80',
        isVeg: true,
        rating: 4.4,
        restaurant: 'Mithai Ghar',
        isPopular: false,
      },
      {
        id: '23',
        name: 'Ice Cream Sundae',
        price: 150,
        originalPrice: 180,
        description: 'Vanilla ice cream with chocolate sauce and nuts.',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80',
        isVeg: true,
        rating: 4.3,
        restaurant: 'Frozen Delights',
        isPopular: false,
      },
    ],
  },
  {
    category: 'Beverages',
    items: [
      {
        id: '24',
        name: 'Fresh Lime Soda',
        price: 60,
        originalPrice: 80,
        description: 'Refreshing lime soda with a hint of mint.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
        isVeg: true,
        rating: 4.0,
        restaurant: 'Refresh Bar',
        isPopular: false,
      },
      {
        id: '25',
        name: 'Mango Lassi',
        price: 90,
        originalPrice: 110,
        description: 'Creamy yogurt drink blended with fresh mango.',
        image: 'https://images.unsplash.com/photo-1553978297-833d7c5773f6?w=500&q=80',
        isVeg: true,
        rating: 4.5,
        restaurant: 'Dairy Fresh',
        isPopular: true,
      },
      {
        id: '26',
        name: 'Cold Coffee',
        price: 120,
        originalPrice: 140,
        description: 'Chilled coffee with ice cream and whipped cream.',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80',
        isVeg: true,
        rating: 4.2,
        restaurant: 'Cafe Mocha',
        isPopular: false,
      },
    ],
  },
];

function MenuScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState(menuData[0].category);
  
  // Get restaurant data from navigation parameters
  const params = useLocalSearchParams();
  let currentRestaurant = restaurantInfo; // fallback to default
  
  if (params.restaurantData) {
    try {
      currentRestaurant = JSON.parse(params.restaurantData);
    } catch (error) {
      console.log('Error parsing restaurant data:', error);
    }
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.dark : colors.light,
  };
  const cardStyle = {
    backgroundColor: isDarkMode ? colors.gray[800] : colors.white,
  };

  const handleAddToCart = (item) => {
    // Simple cart logic: add item to the cart array
    setCart(currentCart => [...currentCart, item]);
  };
  
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const renderMenuItem = ({ item }) => (
    <View style={[styles.menuItemCard, cardStyle]}>
        <View style={styles.menuItemDetails}>
            <View style={styles.itemHeader}>
                <Text style={item.isVeg ? styles.vegIndicator : styles.nonVegIndicator}>●</Text>
                {item.isPopular && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>🔥 Popular</Text>
                    </View>
                )}
            </View>
            <Text style={[styles.itemName, { color: isDarkMode ? colors.white : colors.black }]}>{item.name}</Text>
            <Text style={[styles.itemRestaurantName, { color: isDarkMode ? colors.gray[400] : colors.gray[600] }]}>
                {item.restaurant}
            </Text>
            <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                {item.originalPrice && item.originalPrice > item.price && (
                    <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                )}
            </View>
            <Text style={[styles.itemDescription, { color: isDarkMode ? colors.gray[400] : colors.gray[600] }]}>
                {item.description}
            </Text>
            {item.rating && (
                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                </View>
            )}
        </View>
        <View style={styles.menuItemImageContainer}>
            <Image source={{ uri: item.image }} style={styles.menuItemImage} />
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
            >
                <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- Header Section --- */}
        <View style={styles.header}>
          <Image source={{ uri: currentRestaurant.image }} style={styles.headerImage} />
          <View style={styles.headerOverlay} />
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { top: insets.top + 10 }]}>
              <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.restaurantName}>{currentRestaurant.name}</Text>
            <Text style={styles.restaurantCuisine}>{currentRestaurant.cuisine}</Text>
            <View style={styles.restaurantDetails}>
              <Text style={styles.rating}>⭐ {currentRestaurant.rating}</Text>
              <Text style={styles.deliveryTime}>∙ {currentRestaurant.deliveryTime}</Text>
            </View>
          </View>
        </View>

    {/* --- Sticky Category Navigation --- */}
    <View style={[styles.categoryNav, { backgroundColor: isDarkMode ? colors.gray[800] : colors.light }]}>
      <FlatList
        horizontal
        data={menuData}
        renderItem={({item}) => {
          const active = activeCategory === item.category;
          return (
            <TouchableOpacity
              onPress={() => setActiveCategory(item.category)}
              style={[styles.categoryItem, active ? styles.activeCategoryItem : null]}
            >
              <Text style={[
                styles.categoryItemText,
                active ? styles.activeCategoryItemText : { color: isDarkMode ? colors.gray[300] : colors.gray[600] }
              ]}>
                {item.category}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.category}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md, alignItems: 'center' }}
      />
    </View>

        {/* --- Menu Content (only active category) --- */}
        <View style={styles.content}>
          {(() => {
            const activeSection = menuData.find(s => s.category === activeCategory) || menuData[0];
            return (
              <View key={activeSection.category} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.black }]}>
                  {activeSection.category} ({activeSection.items.length})
                </Text>
                {activeSection.items.map(item => <View key={item.id}>{renderMenuItem({item})}</View>)}
              </View>
            );
          })()}
        </View>
      </ScrollView>

      {/* --- Floating Cart Button --- */}
      {cart.length > 0 && (
          <TouchableOpacity 
            style={[styles.cartButton, { bottom: insets.bottom + spacing.md }]}
            onPress={() => router.push('/cart')}
          >
              <View>
                  <Text style={styles.cartButtonText}>{cart.length} ITEM{cart.length > 1 ? 'S' : ''}</Text>
                  <Text style={styles.cartButtonPrice}>₹{cartTotal}</Text>
              </View>
              <Text style={styles.cartButtonText}>View Cart →</Text>
          </TouchableOpacity>
      )}
    </View>
  );
}

// Assuming same color, spacing, and typography objects as before
const colors = {
    primary: '#FF6347',
    secondary: '#4CAF50', // A nice green for veg
    light: '#F5F5F5',
    dark: '#121212',
    white: '#FFFFFF',
    black: '#000000',
    red: '#D32F2F', // For non-veg
    gray: {
        100: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF',
        500: '#6B7280', 600: '#4B5563', 800: '#1F2937',
    },
};
const spacing = { sm: 8, md: 16, lg: 24, xl: 32 };
const typography = {
    h1: { fontSize: 28, fontWeight: 'bold' },
    h2: { fontSize: 22, fontWeight: 'bold' },
    body: { fontSize: 16 },
    caption: { fontSize: 12 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header styles
  header: {
    height: 250,
    justifyContent: 'flex-end',
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    marginBottom:10,
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    padding: spacing.md,
  },
  restaurantName: {
    ...typography.h1,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  restaurantCuisine: {
    ...typography.body,
    color: colors.gray[100],
    fontSize: 16,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  rating: { ...typography.body, fontWeight: 'bold', color: colors.white },
  deliveryTime: { ...typography.body, color: colors.gray[100], marginLeft: spacing.sm },
  
  // Category Nav styles
  categoryNav: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    backgroundColor: '#F5F5F5', // Use light background for sticky header
  },
  categoryText: {
    ...typography.body,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  activeCategoryText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  // New category chip styles
  categoryItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    marginRight: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeCategoryItem: {
    backgroundColor: colors.primary + '22', // translucent primary
  },
  categoryItemText: {
    ...typography.body,
    fontWeight: '600',
  },
  activeCategoryItemText: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Content styles
  content: {
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemDetails: {
    flex: 1,
    paddingRight: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm / 2,
  },
  itemRestaurantName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemPrice: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
    marginRight: spacing.sm,
  },
  originalPrice: {
    ...typography.caption,
    color: colors.gray[500],
    textDecorationLine: 'line-through',
  },
  itemDescription: {
    ...typography.caption,
    lineHeight: 16,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    marginTop: spacing.xs,
  },
  popularBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  popularText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  vegIndicator: {
      color: colors.secondary,
      fontWeight: 'bold',
      fontSize: 16,
  },
  nonVegIndicator: {
      color: colors.red,
      fontWeight: 'bold',
      fontSize: 16,
  },
  menuItemImageContainer: {
    alignItems: 'center',
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 25,
    paddingVertical: 8,
    position: 'absolute',
    bottom: -10,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },

  // Cart Button styles
  cartButton: {
      position: 'absolute',
      left: spacing.md,
      right: spacing.md,
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
  },
  cartButtonText: {
      color: colors.white,
      fontWeight: 'bold',
      fontSize: 16,
  },
  cartButtonPrice: {
      color: colors.white,
      fontSize: 12,
  }
});

export default MenuScreen;
