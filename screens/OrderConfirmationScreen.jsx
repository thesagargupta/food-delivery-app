import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Make sure to install expo-linear-gradient by running: npx expo install expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';

// --- THEME DEFINITIONS (from your code) ---
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

// --- UPDATED COMPONENT ---
export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  // Safely parse data
  const cartItems = params.cartData ? JSON.parse(params.cartData) : [];
  const toPay = params.toPay ? Number(params.toPay) : 0;

  const handlePayment = () => {
    if (isProcessing) return; // Prevent multiple clicks while processing
    setIsProcessing(true);
    
    // Simulate payment API call and redirect to the location screen
    setTimeout(() => {
      router.replace('/LocationScreen'); // Navigate to the final screen
      // No need to set isProcessing back to false, as the screen is being replaced.
    }, 1500);
  };

  // Improved list item component for better visual structure
  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- Safe Area Aware Header --- */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back-circle-outline" size={32} color={colors.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Your Order</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Confirmation Icon & Text --- */}
        <View style={styles.confirmationIconContainer}>
          <Ionicons name="receipt-outline" size={64} color={colors.secondary} />
          <Text style={styles.confirmationText}>Please review and confirm your order details below.</Text>
        </View>

        {/* --- Order Details Card --- */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false} // The parent ScrollView handles scrolling
            ListEmptyComponent={<Text style={styles.emptyText}>Your order is empty.</Text>}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <View style={styles.totalSeparator} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <Text style={styles.totalValue}>₹{toPay.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* --- Sticky Footer & Pay Button --- */}
      <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md }]}>
        <TouchableOpacity onPress={handlePayment} disabled={isProcessing} style={styles.payButton}>
          <LinearGradient
            colors={isProcessing ? [colors.gray[400], colors.gray[500]] : ['#FF8C7A', colors.primary]}
            style={styles.gradient}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.payButtonText}>Pay & Place Order</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- REVAMPED STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[100] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  headerBack: { marginRight: spacing.sm, padding: 5 },
  headerTitle: { ...typography.h2, fontSize: 20, color: colors.gray[800] },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 120, // Extra space to ensure content isn't hidden by the sticky footer
  },
  confirmationIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  confirmationText: {
    ...typography.body,
    color: colors.gray[600],
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    ...typography.h2,
    fontSize: 18,
    marginBottom: spacing.md,
    color: colors.dark,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  itemName: { ...typography.body, fontWeight: '600', color: colors.gray[800] },
  itemQuantity: { ...typography.caption, color: colors.gray[500], paddingTop: 4 },
  itemPrice: { ...typography.body, fontWeight: 'bold', color: colors.dark },
  emptyText: { textAlign: 'center', color: colors.gray[500], paddingVertical: spacing.lg },
  separator: {
    height: 1,
    backgroundColor: colors.gray[100],
  },
  totalSeparator: {
    height: 2,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { ...typography.h2, fontSize: 18, color: colors.dark },
  totalValue: { ...typography.h1, fontSize: 22, color: colors.primary },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  payButton: {
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  payButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});