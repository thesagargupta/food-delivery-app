import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../components';

// All Restaurant Data from Home Screen with their complete menu items
const restaurantsData = [
  {
    id: '1',
    name: 'The Pizza Place',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80',
    rating: 4.5,
    deliveryTime: '25-30 min',
    cuisine: 'Pizza, Italian',
    categories: [
      {
        name: 'Pizza',
        items: [
          {
            id: 'p1',
            name: 'Margherita Pizza',
            price: 299,
            originalPrice: 350,
            description: 'Classic pizza with fresh tomatoes, mozzarella, and basil.',
            image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80',
            isVeg: true,
            rating: 4.2,
            isPopular: true,
          },
          {
            id: 'p2',
            name: 'Pepperoni Pizza',
            price: 399,
            originalPrice: 450,
            description: 'Delicious pizza topped with pepperoni and extra cheese.',
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80',
            isVeg: false,
            rating: 4.5,
            isPopular: false,
          },
          {
            id: 'p3',
            name: 'Veggie Supreme',
            price: 379,
            originalPrice: 420,
            description: 'Loaded with fresh vegetables, olives, and cheese.',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
            isVeg: true,
            rating: 4.3,
            isPopular: false,
          },
        ]
      },
      {
        name: 'Sides',
        items: [
          {
            id: 'p4',
            name: 'Garlic Bread',
            price: 150,
            originalPrice: 180,
            description: 'Toasted bread with garlic, butter, and herbs.',
            image: 'https://images.unsplash.com/photo-1598964344239-e938a192415d?w=500&q=80',
            isVeg: true,
            rating: 4.1,
            isPopular: false,
          },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Burger Queen',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
    rating: 4.3,
    deliveryTime: '20-25 min',
    cuisine: 'Burgers, Fast Food',
    categories: [
      {
        name: 'Burgers',
        items: [
          {
            id: 'b1',
            name: 'Classic Burger',
            price: 199,
            originalPrice: 240,
            description: 'Juicy beef patty with lettuce, tomato, and cheese.',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
            isVeg: false,
            rating: 4.3,
            isPopular: true,
          },
          {
            id: 'b2',
            name: 'Veg Burger',
            price: 149,
            originalPrice: 180,
            description: 'Fresh veggie patty with salad and special sauce.',
            image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80',
            isVeg: true,
            rating: 4.1,
            isPopular: false,
          },
          {
            id: 'b3',
            name: 'Chicken Burger',
            price: 219,
            originalPrice: 260,
            description: 'Grilled chicken breast with fresh lettuce and mayo.',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
            isVeg: false,
            rating: 4.4,
            isPopular: false,
          },
        ]
      },
      {
        name: 'Sides',
        items: [
          {
            id: 'b4',
            name: 'French Fries',
            price: 120,
            originalPrice: 150,
            description: 'Crispy golden fries with salt.',
            image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&q=80',
            isVeg: true,
            rating: 4.0,
            isPopular: true,
          },
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Wok & Roll',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80',
    rating: 4.8,
    deliveryTime: '30-35 min',
    cuisine: 'Asian, Noodles',
    categories: [
      {
        name: 'Chicken',
        items: [
          {
            id: 'w1',
            name: 'Chicken Noodles',
            price: 220,
            originalPrice: 260,
            description: 'Stir-fried noodles with chicken and fresh vegetables.',
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80',
            isVeg: false,
            rating: 4.4,
            isPopular: true,
          },
          {
            id: 'w2',
            name: 'Chicken Manchurian',
            price: 250,
            originalPrice: 290,
            description: 'Crispy chicken balls in sweet and tangy Manchurian sauce.',
            image: 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=500&q=80',
            isVeg: false,
            rating: 4.5,
            isPopular: false,
          },
          {
            id: 'w3',
            name: 'Chicken Fried Rice',
            price: 200,
            originalPrice: 240,
            description: 'Aromatic fried rice with chicken and vegetables.',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80',
            isVeg: false,
            rating: 4.3,
            isPopular: true,
          },
        ]
      },
      {
        name: 'Vegetarian',
        items: [
          {
            id: 'w4',
            name: 'Veg Fried Rice',
            price: 180,
            originalPrice: 210,
            description: 'Aromatic fried rice with mixed vegetables and soy sauce.',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80',
            isVeg: true,
            rating: 4.2,
            isPopular: false,
          },
          {
            id: 'w5',
            name: 'Veg Spring Rolls',
            price: 160,
            originalPrice: 190,
            description: 'Crispy spring rolls filled with fresh vegetables.',
            image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?w=500&q=80',
            isVeg: true,
            rating: 4.0,
            isPopular: false,
          },
        ]
      }
    ]
  },
  // Additional restaurants with Indian cuisine
  {
    id: '4',
    name: 'Spice Kitchen',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80',
    rating: 4.6,
    deliveryTime: '25-30 min',
    cuisine: 'Indian, North Indian',
    categories: [
      {
        name: 'Chicken',
        items: [
          {
            id: 's1',
            name: 'Butter Chicken',
            price: 320,
            originalPrice: 380,
            description: 'Creamy tomato-based curry with tender chicken pieces.',
            image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80',
            isVeg: false,
            rating: 4.5,
            isPopular: true,
          },
          {
            id: 's2',
            name: 'Chicken Tikka',
            price: 280,
            originalPrice: 320,
            description: 'Marinated chicken grilled to perfection with aromatic spices.',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80',
            isVeg: false,
            rating: 4.3,
            isPopular: false,
          },
          {
            id: 's3',
            name: 'Chicken Biryani',
            price: 350,
            originalPrice: 400,
            description: 'Aromatic basmati rice with tender chicken and traditional spices.',
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=500&q=80',
            isVeg: false,
            rating: 4.7,
            isPopular: true,
          },
        ]
      },
      {
        name: 'Paneer',
        items: [
          {
            id: 's4',
            name: 'Paneer Tikka',
            price: 250,
            originalPrice: 290,
            description: 'Marinated cottage cheese cubes grilled with bell peppers.',
            image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80',
            isVeg: true,
            rating: 4.4,
            isPopular: true,
          },
          {
            id: 's5',
            name: 'Paneer Butter Masala',
            price: 280,
            originalPrice: 320,
            description: 'Rich and creamy paneer curry with butter and aromatic spices.',
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
            isVeg: true,
            rating: 4.6,
            isPopular: false,
          },
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'Sweet Treats',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
    rating: 4.4,
    deliveryTime: '15-20 min',
    cuisine: 'Desserts, Bakery',
    categories: [
      {
        name: 'Desserts',
        items: [
          {
            id: 'd1',
            name: 'Chocolate Brownie',
            price: 120,
            originalPrice: 150,
            description: 'Rich and fudgy chocolate brownie with vanilla ice cream.',
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
            isVeg: true,
            rating: 4.6,
            isPopular: true,
          },
          {
            id: 'd2',
            name: 'Ice Cream Sundae',
            price: 150,
            originalPrice: 180,
            description: 'Vanilla ice cream with chocolate sauce and nuts.',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80',
            isVeg: true,
            rating: 4.3,
            isPopular: false,
          },
        ]
      },
      {
        name: 'Beverages',
        items: [
          {
            id: 'd3',
            name: 'Cold Coffee',
            price: 120,
            originalPrice: 140,
            description: 'Chilled coffee with ice cream and whipped cream.',
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80',
            isVeg: true,
            rating: 4.2,
            isPopular: false,
          },
          {
            id: 'd4',
            name: 'Mango Lassi',
            price: 90,
            originalPrice: 110,
            description: 'Creamy yogurt drink blended with fresh mango.',
            image: 'https://images.unsplash.com/photo-1553978297-833d7c5773f6?w=500&q=80',
            isVeg: true,
            rating: 4.5,
            isPopular: true,
          },
        ]
      }
    ]
  }
];

// Categories for filtering
const allCategories = [
  { id: 'all', name: 'All', icon: 'restaurant', color: '#FF6347' },
  { id: 'chicken', name: 'Chicken', icon: 'nutrition', color: '#FF8C42' },
  { id: 'paneer', name: 'Paneer', icon: 'fitness', color: '#4ECDC4' },
  { id: 'pizza', name: 'Pizza', icon: 'pizza', color: '#FF6B35' },
  { id: 'burgers', name: 'Burgers', icon: 'fast-food', color: '#FF6B6B' },
  { id: 'vegetarian', name: 'Vegetarian', icon: 'leaf', color: '#4ECDC4' },
  { id: 'sides', name: 'Sides', icon: 'basket', color: '#96CEB4' },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream', color: '#FECA57' },
  { id: 'beverages', name: 'Beverages', icon: 'wine', color: '#45B7D1' },
];

function AllMenuItemsScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.dark : colors.light,
  };

  // Flatten all items from all restaurants with category and restaurant info
  const getAllItems = () => {
    const allItems = [];
    restaurantsData.forEach(restaurant => {
      restaurant.categories.forEach(category => {
        category.items.forEach(item => {
          allItems.push({
            ...item,
            categoryName: category.name,
            restaurantName: restaurant.name,
            restaurantRating: restaurant.rating,
            deliveryTime: restaurant.deliveryTime,
          });
        });
      });
    });
    return allItems;
  };

  // Filter items based on selected category and search text
  const getFilteredItems = () => {
    let items = getAllItems();

    // Filter by category
    if (selectedCategory !== 'all') {
      items = items.filter(item => 
        item.categoryName.toLowerCase() === selectedCategory ||
        (selectedCategory === 'vegetarian' && item.isVeg) ||
        (selectedCategory === 'chicken' && item.categoryName.toLowerCase() === 'chicken') ||
        (selectedCategory === 'paneer' && item.categoryName.toLowerCase() === 'paneer') ||
        (selectedCategory === 'pizza' && item.categoryName.toLowerCase() === 'pizza') ||
        (selectedCategory === 'burgers' && item.categoryName.toLowerCase() === 'burgers') ||
        (selectedCategory === 'sides' && item.categoryName.toLowerCase() === 'sides') ||
        (selectedCategory === 'desserts' && item.categoryName.toLowerCase() === 'desserts') ||
        (selectedCategory === 'beverages' && item.categoryName.toLowerCase() === 'beverages')
      );
    }

    // Filter by search text
    if (searchText.length > 0) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.restaurantName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return items;
  };

  const handleAddToCart = (item) => {
    setCart(currentCart => [...currentCart, item]);
    // Navigate to cart
    router.push('/cart');
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.selectedCategoryChip,
        {backgroundColor: selectedCategory === item.id ? item.color : (isDarkMode ? colors.gray[800] : colors.white)}
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={selectedCategory === item.id ? colors.white : item.color} 
      />
      <Text style={[
        styles.categoryText,
        {color: selectedCategory === item.id ? colors.white : (isDarkMode ? colors.white : colors.black)}
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }) => (
    <View style={[styles.menuItemCard, {backgroundColor: isDarkMode ? colors.gray[800] : colors.white}]}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemBadges}>
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Ionicons name="flame" size={12} color={colors.white} />
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
          <View style={[styles.vegBadge, {backgroundColor: item.isVeg ? colors.secondary : colors.danger}]}>
            <Text style={styles.vegText}>●</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{item.categoryName}</Text>
          </View>
        </View>
        
        <Text style={[styles.itemName, {color: isDarkMode ? colors.white : colors.black}]}>
          {item.name}
        </Text>
        
        <Text style={[styles.restaurantName, {color: isDarkMode ? colors.gray[400] : colors.gray[600]}]}>
          {item.restaurantName}
        </Text>
        
        <Text style={[styles.itemDescription, {color: isDarkMode ? colors.gray[300] : colors.gray[600]}]}>
          {item.description}
        </Text>
        
        <View style={styles.itemMeta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={[styles.deliveryTime, {color: isDarkMode ? colors.gray[400] : colors.gray[500]}]}>
            • {item.deliveryTime}
          </Text>
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, {color: colors.primary}]}>
              ₹{item.price}
            </Text>
            {item.originalPrice && item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const filteredItems = getFilteredItems();

  return (
    <SafeScreen includeTop={false} includeBottom={false}>
      {/* Custom Header with Back Button */}
      <View style={[styles.header, {backgroundColor: isDarkMode ? colors.dark : colors.light}]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? colors.white : colors.black} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: isDarkMode ? colors.white : colors.black}]}>
          All Menu Items
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, {backgroundColor: isDarkMode ? colors.dark : colors.light}]}>
        <View style={[styles.searchBar, {backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100]}]}>
          <Ionicons name="search" size={20} color={isDarkMode ? colors.gray[400] : colors.gray[500]} />
          <TextInput
            placeholder="Search dishes, restaurants, or categories..."
            placeholderTextColor={isDarkMode ? colors.gray[400] : colors.gray[500]}
            style={[styles.searchInput, {color: isDarkMode ? colors.white : colors.black}]}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={isDarkMode ? colors.gray[400] : colors.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={[styles.categoriesWrapper, {backgroundColor: isDarkMode ? colors.dark : colors.light}]}>
        <FlatList
          horizontal
          data={allCategories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>
      
      <ScrollView
        style={[styles.scrollContainer, backgroundStyle]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.content}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsText, {color: isDarkMode ? colors.white : colors.black}]}>
              {filteredItems.length} items found
            </Text>
            {(searchText.length > 0 || selectedCategory !== 'all') && (
              <TouchableOpacity onPress={() => {
                setSearchText('');
                setSelectedCategory('all');
              }}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            numColumns={1}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: isDarkMode ? colors.gray[400] : colors.gray[500]}]}>
              All items from {restaurantsData.length} restaurants
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
        >
          <View>
            <Text style={styles.cartButtonText}>{cart.length} ITEM{cart.length > 1 ? 'S' : ''}</Text>
            <Text style={styles.cartButtonPrice}>
              ₹{cart.reduce((total, item) => total + item.price, 0)}
            </Text>
          </View>
          <Text style={styles.cartButtonText}>View Cart →</Text>
        </TouchableOpacity>
      )}
    </SafeScreen>
  );
}

const colors = {
  primary: '#FF6347',
  secondary: '#4CAF50',
  danger: '#D32F2F',
  light: '#F5F5F5',
  dark: '#121212',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#E5E7EB',
    200: '#D1D5DB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    800: '#1F2937',
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const typography = {
  h1: { fontSize: 28, fontWeight: 'bold' },
  h2: { fontSize: 22, fontWeight: 'bold' },
  h3: { fontSize: 18, fontWeight: 'bold' },
  body: { fontSize: 16 },
  caption: { fontSize: 12 },
};

const styles = StyleSheet.create({
  // Custom Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.md,
    marginTop:20
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 24,
    flex: 1,
    marginTop:20
  },
  headerSpacer: {
    width: 32, // Same width as back button to center the title
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 50,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
  },
  clearButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  categoriesWrapper: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  categoriesContainer: {
    paddingHorizontal: spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.gray[300],
    minHeight: 36,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryChip: {
    borderColor: colors.primary,
    elevation: 3,
    shadowOpacity: 0.2,
  },
  categoryText: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: spacing.xs,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  resultsText: {
    ...typography.body,
    fontWeight: '600',
  },
  clearText: {
    color: colors.primary,
    ...typography.body,
    fontWeight: '600',
  },
  menuItemCard: {
    marginBottom: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemImageContainer: {
    position: 'relative',
    height: 180,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemBadges: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  popularBadge: {
    backgroundColor: 'rgba(255, 99, 71, 0.95)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  vegBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  vegText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemContent: {
    padding: spacing.lg,
  },
  itemHeader: {
    marginBottom: spacing.sm,
  },
  categoryTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
    elevation: 1,
  },
  categoryTagText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  itemName: {
    ...typography.h3,
    marginBottom: spacing.xs,
    fontSize: 20,
  },
  restaurantName: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  itemDescription: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: spacing.xs,
    ...typography.caption,
    fontWeight: '600',
    fontSize: 13,
  },
  deliveryTime: {
    ...typography.caption,
    marginLeft: spacing.sm,
    fontSize: 13,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...typography.h3,
    marginRight: spacing.sm,
    fontSize: 20,
  },
  originalPrice: {
    ...typography.body,
    color: colors.gray[500],
    textDecorationLine: 'line-through',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    ...typography.body,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  cartButton: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  cartButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartButtonPrice: {
    color: colors.white,
    fontSize: 12,
    marginTop: 2,
  },
});

export default AllMenuItemsScreen;
