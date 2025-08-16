import React from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header } from '../components';
import { colors, spacing, typography } from '../styles';

const deals = [
  {
    id: '1',
    title: '50% OFF',
    subtitle: 'On your first order',
    description: 'Valid on orders above ₹199',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    discount: '50%',
    code: 'FIRST50'
  },
  {
    id: '2',
    title: 'Free Delivery',
    subtitle: 'On orders above ₹299',
    description: 'No delivery charges',
    image: 'https://images.unsplash.com/photo-1585759065152-3b0e2524b869?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    discount: 'FREE',
    code: 'FREEDEL'
  },
  {
    id: '3',
    title: '30% OFF',
    subtitle: 'On Pizza orders',
    description: 'Valid on all pizza restaurants',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80',
    discount: '30%',
    code: 'PIZZA30'
  },
  {
    id: '4',
    title: 'Buy 1 Get 1',
    subtitle: 'On selected items',
    description: 'Applicable on burgers and beverages',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
    discount: 'BOGO',
    code: 'BOGO1'
  }
];

function DealsScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.dark : colors.light,
  };

  const handleCopyCode = (code) => {
    // You can add actual clipboard functionality here
  };

  const renderDealCard = ({ item }) => (
    <Card style={styles.dealCard}>
      <View style={styles.dealContent}>
        <Image source={{ uri: item.image }} style={styles.dealImage} />
        <View style={styles.dealInfo}>
          <View style={styles.dealHeader}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>
            <Text style={[styles.dealTitle, {color: isDarkMode ? colors.white : colors.black}]}>
              {item.title}
            </Text>
          </View>
          <Text style={[styles.dealSubtitle, {color: isDarkMode ? colors.gray[300] : colors.gray[600]}]}>
            {item.subtitle}
          </Text>
          <Text style={[styles.dealDescription, {color: isDarkMode ? colors.gray[400] : colors.gray[500]}]}>
            {item.description}
          </Text>
          <View style={styles.codeContainer}>
            <Text style={[styles.codeLabel, {color: isDarkMode ? colors.gray[300] : colors.gray[600]}]}>
              Use code:
            </Text>
            <TouchableOpacity 
              style={styles.codeButton}
              onPress={() => handleCopyCode(item.code)}
            >
              <Text style={styles.codeText}>{item.code}</Text>
              <Ionicons name="copy-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      
      <View style={{ paddingTop: insets.top }}>
        <Header title="Deals & Offers" />
      </View>
      
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Ionicons name="gift" size={32} color={colors.primary} />
            <Text style={[styles.headerTitle, {color: isDarkMode ? colors.white : colors.black}]}>
              🎉 Great Deals Await!
            </Text>
            <Text style={[styles.headerSubtitle, {color: isDarkMode ? colors.gray[300] : colors.gray[600]}]}>
              Save more on your favorite food
            </Text>
          </View>

          <FlatList
            data={deals}
            renderItem={renderDealCard}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />

  
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  dealCard: {
    marginBottom: spacing.lg,
  },
  dealContent: {
    flexDirection: 'row',
  },
  dealImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  dealInfo: {
    flex: 1,
  },
  dealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  discountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  discountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dealTitle: {
    ...typography.h3,
    flex: 1,
  },
  dealSubtitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  dealDescription: {
    ...typography.caption,
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeLabel: {
    ...typography.caption,
    marginRight: spacing.sm,
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  codeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DealsScreen;
