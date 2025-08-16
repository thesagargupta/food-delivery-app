import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, Card } from '../components';
import { colors, spacing, typography } from '../styles';

export default function AddressesScreen() {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState([
    { id: 'a1', label: 'Home', address: '123 Main St, Foodie Town, India' },
  ]);
  const [text, setText] = useState('');

  const addAddress = () => {
    if (!text.trim()) {
      Alert.alert('Validation', 'Please enter an address');
      return;
    }
    const newAddr = { id: Date.now().toString(), label: 'Other', address: text.trim() };
    setAddresses(prev => [newAddr, ...prev]);
    setText('');
  };

  const removeAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.light }]}>
      <Header title="Manage Addresses" />
      <View style={styles.content}>
        <Card style={styles.addCard}>
          <TextInput placeholder="Enter new address" value={text} onChangeText={setText} style={styles.input} />
          <TouchableOpacity style={styles.addButton} onPress={addAddress}>
            <Text style={styles.addButtonText}>Add Address</Text>
          </TouchableOpacity>
        </Card>

        <FlatList
          data={addresses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card style={styles.addrCard}>
              <View style={styles.addrRow}>
                <View>
                  <Text style={styles.addrLabel}>{item.label}</Text>
                  <Text style={styles.addrText}>{item.address}</Text>
                </View>
                <TouchableOpacity onPress={() => removeAddress(item.id)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  addCard: { padding: spacing.md, marginBottom: spacing.md },
  input: { borderWidth: 1, borderColor: colors.gray[300], borderRadius: 8, padding: 10, marginBottom: spacing.sm, backgroundColor: colors.white },
  addButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: colors.white, fontWeight: '600' },
  addrCard: { padding: spacing.md, marginBottom: spacing.sm },
  addrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addrLabel: { ...typography.h3 },
  addrText: { ...typography.body, color: colors.gray[600] },
  delete: { color: colors.danger, fontWeight: '600' },
});
