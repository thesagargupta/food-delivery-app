import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- DUMMY DATA ---
const initialCartItems = [
  { id: 'p1', name: 'Margherita Pizza', price: 299, quantity: 1, isVeg: true, restaurant: 'The Pizza Place' },
  { id: 'b4', name: 'French Fries', price: 120, quantity: 1, isVeg: true, restaurant: 'Burger Queen' },
];

// Dummy data for suggested items (items not already in the cart)
const frequentlyOrderedItems = [
    { id: 'd1', name: 'Chocolate Brownie', price: 120, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80' },
    { id: 'd3', name: 'Cold Coffee', price: 120, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80'},
    { id: 'p4', name: 'Garlic Bread', price: 150, image: 'https://images.unsplash.com/photo-1598964344239-e938a192415d?w=500&q=80' },
];


function CartScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  const backgroundStyle = { backgroundColor: isDarkMode ? colors.dark : colors.light };
  const cardStyle = { backgroundColor: isDarkMode ? colors.gray[800] : colors.white };

  const handleQuantityChange = (itemId, amount) => {
    setCartItems(currentItems =>
      currentItems
        .map(item => (item.id === itemId ? { ...item, quantity: item.quantity + amount } : item))
        .filter(item => item.quantity > 0)
    );
  };
  
  const handleAddItem = (itemToAdd) => {
      setCartItems(currentItems => {
          const existingItem = currentItems.find(item => item.id === itemToAdd.id);
          if (existingItem) {
              return currentItems.map(item => item.id === itemToAdd.id ? {...item, quantity: item.quantity + 1} : item)
          }
          return [...currentItems, {...itemToAdd, quantity: 1}]
      })
  }

  const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = itemTotal > 0 ? 40 : 0;
  const taxes = itemTotal > 0 ? Math.round(itemTotal * 0.05) : 0;
  const toPay = itemTotal + deliveryFee + taxes;

  const renderCartItem = ({ item }) => (
    <View style={[styles.cartItemCard, cardStyle]}>
      <Text style={item.isVeg ? styles.vegIndicator : styles.nonVegIndicator}>●</Text>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: isDarkMode ? colors.white : colors.black }]}>{item.name}</Text>
        <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item.id, -1)}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={[styles.quantityText, { color: isDarkMode ? colors.white : colors.black }]}>{item.quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item.id, 1)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderSuggestedItem = ({item}) => {
      // Don't suggest items already in cart
      if (cartItems.some(cartItem => cartItem.id === item.id)) return null;

      return (
        <View style={[styles.suggestedItemCard, cardStyle]}>
            <Image source={{uri: item.image}} style={styles.suggestedItemImage} />
            <Text style={[styles.suggestedItemName, {color: isDarkMode ? colors.white : colors.black}]} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.suggestedItemPrice}>₹{item.price}</Text>
            <TouchableOpacity style={styles.suggestedItemAddButton} onPress={() => handleAddItem(item)}>
                <Text style={styles.suggestedItemAddButtonText}>ADD</Text>
            </TouchableOpacity>
        </View>
      )
  }

  const renderBillDetails = () => (
    <View style={[styles.billCard, cardStyle]}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.black }]}>Bill Details</Text>
      <View style={styles.billRow}>
        <Text style={styles.billLabel}>Item Total</Text>
        <Text style={[styles.billValue, { color: isDarkMode ? colors.white : colors.black }]}>₹{itemTotal}</Text>
      </View>
      <View style={styles.billRow}>
        <Text style={styles.billLabel}>Delivery Fee</Text>
        <Text style={[styles.billValue, { color: isDarkMode ? colors.white : colors.black }]}>₹{deliveryFee}</Text>
      </View>
      <View style={styles.billRow}>
        <Text style={styles.billLabel}>Taxes & Charges</Text>
        <Text style={[styles.billValue, { color: isDarkMode ? colors.white : colors.black }]}>₹{taxes}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.billRow}>
        <Text style={styles.billTotalLabel}>To Pay</Text>
        <Text style={styles.billTotalValue}>₹{toPay}</Text>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
        <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80' }}
            style={styles.emptyImage}
        />
        <Text style={[styles.emptyTitle, {color: isDarkMode ? colors.white : colors.black}]}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Good food is always cooking! Go ahead, order some yummy items from the menu.</Text>
        <TouchableOpacity style={styles.browseButton} onPress={() => router.back()}>
            <Text style={styles.browseButtonText}>Browse Menu</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: isDarkMode ? colors.dark : colors.white }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? colors.white : colors.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? colors.white : colors.black }]}>Your Cart</Text>
      </View>

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ListHeaderComponent={<Text style={[styles.sectionTitle, {marginTop: spacing.md, color: isDarkMode ? colors.white : colors.black}]}>Order Summary</Text>}
            />

            <View style={[styles.section, cardStyle]}>
                <Text style={[styles.sectionTitle, {color: isDarkMode ? colors.white : colors.black}]}>Frequently Ordered</Text>
                <FlatList
                    horizontal
                    data={frequentlyOrderedItems}
                    renderItem={renderSuggestedItem}
                    keyExtractor={item => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingLeft: spacing.md}}
                />
            </View>

            <View style={[styles.section, cardStyle]}>
                <Text style={[styles.sectionTitle, {color: isDarkMode ? colors.white : colors.black}]}>Offers & Coupons</Text>
                <View style={styles.promoContainer}>
                    <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                    <TextInput 
                        style={[styles.promoInput, {color: isDarkMode ? colors.white : colors.black}]}
                        placeholder="Enter coupon code"
                        placeholderTextColor={colors.gray[500]}
                        value={promoCode}
                        onChangeText={setPromoCode}
                    />
                    <TouchableOpacity>
                        <Text style={styles.promoApplyText}>APPLY</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {renderBillDetails()}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm, backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
            <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/OrderConfirmationScreen')}>
              <View>
                <Text style={styles.checkoutPrice}>₹{toPay}</Text>
                <Text style={styles.checkoutLabel}>TOTAL</Text>
              </View>
              <Text style={styles.checkoutText}>Proceed to Pay</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const colors = {
    primary: '#FF6347', secondary: '#4CAF50', light: '#F0F0F0',
    dark: '#121212', white: '#FFFFFF', black: '#000000', red: '#D32F2F',
    gray: { 100: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 800: '#1F2937' },
};
const spacing = { sm: 8, md: 16, lg: 24, xl: 32 };
const typography = {
    h1: { fontSize: 28, fontWeight: 'bold' }, h2: { fontSize: 22, fontWeight: 'bold' },
    body: { fontSize: 16 }, caption: { fontSize: 12 },
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
  },
  headerBack: { paddingRight: spacing.md },
  headerTitle: { ...typography.h2, fontSize: 20 },
  section: {
      marginTop: spacing.md,
      paddingVertical: spacing.md,
  },
  sectionTitle: {
      ...typography.h2,
      fontSize: 18,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
  },
  cartItemCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  itemInfo: { flex: 1, paddingLeft: spacing.md },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemRestaurant: { fontSize: 12, color: colors.gray[500], marginTop: 2 },
  itemPrice: { ...typography.body, fontWeight: 'bold', color: colors.primary, marginTop: 4 },
  vegIndicator: { color: colors.secondary, fontWeight: 'bold', fontSize: 16, alignSelf: 'flex-start' },
  nonVegIndicator: { color: colors.red, fontWeight: 'bold', fontSize: 16, alignSelf: 'flex-start' },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    borderRadius: 8,
  },
  quantityButton: { paddingHorizontal: 12, paddingVertical: 8 },
  quantityButtonText: { color: colors.primary, fontWeight: 'bold', fontSize: 18 },
  quantityText: { fontSize: 16, fontWeight: 'bold', minWidth: 24, textAlign: 'center' },
  
  suggestedItemCard: {
      width: 140,
      marginRight: spacing.md,
      borderRadius: 12,
      padding: spacing.sm,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  suggestedItemImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: spacing.sm,
  },
  suggestedItemName: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      height: 35,
  },
  suggestedItemPrice: {
      fontSize: 14,
      color: colors.gray[600],
      marginVertical: spacing.sm,
  },
  suggestedItemAddButton: {
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 6,
  },
  suggestedItemAddButtonText: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 12,
  },

  promoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
  },
  promoInput: {
      flex: 1,
      ...typography.body,
      marginLeft: spacing.sm,
      paddingVertical: spacing.md,
  },
  promoApplyText: {
      color: colors.primary,
      fontWeight: 'bold',
  },

  billCard: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  billLabel: { ...typography.body, color: colors.gray[500], fontSize: 15 },
  billValue: { ...typography.body, fontWeight: '500', fontSize: 15 },
  separator: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    marginVertical: spacing.sm,
  },
  billTotalLabel: { ...typography.h2, fontSize: 18, fontWeight: 'bold' },
  billTotalValue: { ...typography.h2, fontSize: 18, fontWeight: 'bold' },

  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.1)',
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutPrice: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  checkoutLabel: { color: colors.white, fontSize: 10, fontWeight: '600' },
  checkoutText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },

  emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
  },
  emptyImage: {
      width: 200,
      height: 200,
      borderRadius: 24,
      marginBottom: spacing.xl,
  },
  emptyTitle: {
      ...typography.h1,
      fontSize: 24,
      marginBottom: spacing.sm,
  },
  emptySubtitle: {
      ...typography.body,
      color: colors.gray[500],
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: spacing.lg,
  },
  browseButton: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: 12,
  },
  browseButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
  }
});

export default CartScreen;
