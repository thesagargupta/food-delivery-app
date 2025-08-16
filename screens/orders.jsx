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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Header } from '../components';
import { colors, spacing, typography } from '../styles';

const orders = [
  {
    id: '1',
    restaurantName: 'The Pizza Place',
    items: ['Margherita Pizza', 'Garlic Bread'],
    total: 459,
    status: 'delivered',
    date: '2025-08-05',
    time: '7:30 PM',
    orderNumber: '#KP12345'
  },
  {
    id: '2',
    restaurantName: 'Burger Queen',
    items: ['Classic Burger', 'Fries', 'Coke'],
    total: 349,
    status: 'in_progress',
    date: '2025-08-06',
    time: '12:45 PM',
    orderNumber: '#KP12346'
  },
  {
    id: '3',
    restaurantName: 'Wok & Roll',
    items: ['Chicken Noodles', 'Spring Rolls'],
    total: 289,
    status: 'cancelled',
    date: '2025-08-04',
    time: '9:15 PM',
    orderNumber: '#KP12344'
  }
];

function OrdersScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('all');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.dark : colors.light,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return colors.secondary || '#10B981';
      case 'in_progress':
        return colors.warning || '#F59E0B';
      case 'cancelled':
        return colors.danger || '#EF4444';
      default:
        return colors.gray[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in_progress':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'in_progress':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const filteredOrders = selectedTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedTab);

  const tabs = [
    { id: 'all', title: 'All', count: orders.length },
    { id: 'in_progress', title: 'Active', count: orders.filter(o => o.status === 'in_progress').length },
    { id: 'delivered', title: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', title: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const renderOrderCard = ({ item }) => (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={[styles.orderNumber, {color: isDarkMode ? colors.white : colors.black}]}>
            {item.orderNumber}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Ionicons 
              name={getStatusIcon(item.status)} 
              size={16} 
              color={getStatusColor(item.status)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        <Text style={[styles.orderDate, {color: isDarkMode ? colors.gray[400] : colors.gray[500]}]}>
          {item.date} • {item.time}
        </Text>
      </View>

      <View style={styles.orderDetails}>
        <Text style={[styles.restaurantName, {color: isDarkMode ? colors.white : colors.black}]}>
          {item.restaurantName}
        </Text>
        <Text style={[styles.orderItems, {color: isDarkMode ? colors.gray[300] : colors.gray[600]}]}>
          {item.items.join(', ')}
        </Text>
        <View style={styles.orderFooter}>
          <Text style={[styles.orderTotal, {color: isDarkMode ? colors.white : colors.black}]}>
            ₹{item.total}
          </Text>
          <View style={styles.orderActions}>
            {item.status === 'delivered' && (
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Reorder</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderTab = (tab) => (
    <TouchableOpacity
      key={tab.id}
      style={[
        styles.tab,
        selectedTab === tab.id && styles.activeTab
      ]}
      onPress={() => setSelectedTab(tab.id)}
    >
      <Text style={[
        styles.tabText,
        selectedTab === tab.id ? styles.activeTabText : {color: isDarkMode ? colors.gray[400] : colors.gray[600]}
      ]}>
        {tab.title}
      </Text>
      {tab.count > 0 && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{tab.count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      
      <View style={{ paddingTop: insets.top }}>
        <Header title="My Orders" />
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, {backgroundColor: isDarkMode ? colors.gray[800] : colors.white}]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContainer}>
          {tabs.map(renderTab)}
        </ScrollView>
      </View>
      
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.content}>
          {filteredOrders.length > 0 ? (
            <FlatList
              data={filteredOrders}
              renderItem={renderOrderCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons 
                name="receipt-outline" 
                size={64} 
                color={isDarkMode ? colors.gray[400] : colors.gray[500]} 
              />
              <Text style={[styles.emptyStateTitle, {color: isDarkMode ? colors.white : colors.black}]}>
                No orders found
              </Text>
              <Text style={[styles.emptyStateText, {color: isDarkMode ? colors.gray[300] : colors.gray[600]}]}>
                {selectedTab === 'all' 
                  ? "You haven't placed any orders yet" 
                  : `No ${selectedTab.replace('_', ' ')} orders found`}
              </Text>
              <Button 
                title="Start Ordering" 
                style={styles.startOrderingButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabScrollContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.primary + '20',
  },
  tabText: {
    ...typography.body,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: spacing.xs,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderNumber: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  orderDate: {
    ...typography.caption,
    textAlign: 'right',
  },
  orderDetails: {
    marginTop: spacing.sm,
  },
  restaurantName: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  orderItems: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    ...typography.h3,
    color: colors.primary,
  },
  orderActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateTitle: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  startOrderingButton: {
    backgroundColor: colors.primary,
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
});

export default OrdersScreen;
