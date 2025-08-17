import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, Button } from '../components';
import { colors, spacing, typography } from '../styles';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_CACHE_KEY = '@profile_cache';

const ProfileScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.dark : colors.light,
  };

  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    name: '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80',
  });

  const [editVisible, setEditVisible] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not logged in.");
      return;
    }

    // Load from cache first
    try {
      const cachedProfile = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      if (cachedProfile) {
        const parsedProfile = JSON.parse(cachedProfile);
        // Check if cached data is for the current user
        if (parsedProfile.uid === user.uid) {
          setProfile(parsedProfile.data);
        }
      }
    } catch (e) {
      console.warn('Failed to load profile from cache', e);
    }

    // Fetch from Firestore
    const userRef = doc(db, "users", user.uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const freshProfile = {
          name: userData.name || '',
          email: userData.email || user.email || '',
          phone: user.phoneNumber,
          image: userData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80',
        };
        setProfile(freshProfile);
        // Cache the new profile data with UID
        await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ uid: user.uid, data: freshProfile }));
      } else {
        // For a new user, the profile is already initialized with email and phone.
        // No need to set state here and cause a re-render.
      }
    } catch (error) {
      console.error("Error fetching user profile from Firestore: ", error);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const openEdit = () => {
    setNameInput(profile.name);
    setEmailInput(profile.email);
    setImageInput(profile.image);
    setEditVisible(true);
  };

  const saveProfile = async () => {
    if (!nameInput || !nameInput.trim()) {
      Alert.alert('Validation', 'Name cannot be empty');
      return;
    }
    if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      Alert.alert('Validation', 'Please enter a valid email');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      setIsSaving(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const updatedProfileData = {
          name: nameInput ? nameInput.trim() : '',
          email: emailInput ? emailInput.trim() : '',
          image: imageInput ? imageInput.trim() : '',
        };
        await setDoc(userRef, updatedProfileData, { merge: true });

        const fullProfile = { ...profile, ...updatedProfileData };
        setProfile(fullProfile);
        await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ uid: user.uid, data: fullProfile }));

        setEditVisible(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (error) {
        console.error("Error saving profile: ", error);
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      } finally {
        setIsSaving(false);
      }
    } else {
      Alert.alert('Error', 'User not authenticated.');
    }
  };

  

  // Image picker helpers
  const pickImage = async (fromCamera = false) => {
    try {
      const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert('Permissions', 'Permission to access media library is required.');
        return;
      }

      let result;
      if (fromCamera) {
        const camPerm = await ImagePicker.requestCameraPermissionsAsync();
        if (!camPerm.granted) {
          Alert.alert('Permissions', 'Permission to access camera is required.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: true, aspect: [1, 1] });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true, aspect: [1, 1] });
      }

      if (!result.cancelled) {
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setImageInput(uri);
        setProfile(p => ({ ...p, image: uri }));
      }
    } catch (err) {
      console.warn('Image pick error', err);
    }
  };

  const openImageOptions = () => {
    Alert.alert('Upload Photo', 'Choose source', [
      { text: 'Camera', onPress: () => pickImage(true) },
      { text: 'Gallery', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const menuActions = [
    { id: 1, title: 'Orders', icon: 'receipt-outline', onPress: () => console.log('Orders') },
    { id: 2, title: 'Addresses', icon: 'location-outline', onPress: () => console.log('Addresses') },
    { id: 3, title: 'Payments', icon: 'card-outline', onPress: () => Alert.alert('Payments', 'Payments screen coming soon') },
    { id: 4, title: 'Favorites', icon: 'heart-outline', onPress: () => Alert.alert('Favorites', 'Favorites screen coming soon') },
    { id: 5, title: 'Help & Support', icon: 'help-circle-outline', onPress: () => Alert.alert('Help', 'Help & Support coming soon') },
    { id: 6, title: 'Settings', icon: 'settings-outline', onPress: () => Alert.alert('Settings', 'Settings coming soon') },
  ];

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />

      <View style={{ paddingTop: insets.top }}>
        <Header title="Profile" />
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <TouchableOpacity>
                <Image source={{ uri: profile.image }} style={styles.profileImage} />
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: isDarkMode ? colors.white : colors.black }]}>{profile.name}</Text>
                <Text style={[styles.profileEmail, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>{profile.email}</Text>
                <Text style={[styles.profilePhone, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>{profile.phone}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={openEdit} accessibilityLabel="Edit Profile">
                <Ionicons name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Menu Items */}
          <Card style={styles.menuCard}>
            {menuActions.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, index !== menuActions.length - 1 && styles.menuItemBorder]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={24} color={isDarkMode ? colors.white : colors.black} />
                  <Text style={[styles.menuItemText, { color: isDarkMode ? colors.white : colors.black }]}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? colors.gray[400] : colors.gray[500]} />
              </TouchableOpacity>
            ))}
          </Card>

          {/* Logout Button */}
          <Button
            title="Logout"
            onPress={() => {
              logout();
              // ensure we land on login
              try { require('expo-router').router.replace('/login'); } catch {}
            }}
            style={[styles.logoutButton, { backgroundColor: colors.danger || '#EF4444' }]}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>KhaoPiyo v1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal (eye-catching orange theme) */}
      <Modal visible={editVisible} animationType="fade" transparent onRequestClose={() => setEditVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
            <View style={[styles.modalHeader, { backgroundColor: colors.primary }]}> 
              <Text style={styles.modalHeaderTitle}>Edit Profile</Text>
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.avatarPreview} onPress={openImageOptions} accessibilityLabel="Change photo">
                <Image source={{ uri: imageInput }} style={styles.avatarImage} />
                <View style={styles.avatarEditIcon}><Ionicons name="camera" size={14} color="#fff" /></View>
              </TouchableOpacity>

              <TextInput
                style={[styles.input, styles.inputLarge, { color: isDarkMode ? colors.white : colors.black }]}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Full name"
                placeholderTextColor={isDarkMode ? colors.gray[500] : colors.gray[400]}
              />

              <TextInput
                style={[styles.input, styles.inputLarge, { color: isDarkMode ? colors.white : colors.black }]}
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor={isDarkMode ? colors.gray[500] : colors.gray[400]}
              />

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} onPress={saveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingVertical: spacing.lg },
  profileCard: { marginBottom: spacing.lg },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: spacing.md },
  profileInfo: { flex: 1 },
  profileName: { ...typography.h2, marginBottom: spacing.xs },
  profileEmail: { ...typography.body, marginBottom: spacing.xs },
  profilePhone: { ...typography.body },
  editButton: { padding: spacing.sm },
  menuCard: { marginBottom: spacing.lg },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray[200] },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { ...typography.body, marginLeft: spacing.md, fontWeight: '500' },
  logoutButton: { marginBottom: spacing.lg },
  footer: { alignItems: 'center', paddingTop: spacing.lg },
  footerText: { ...typography.caption, fontStyle: 'italic' },
  modalContainer: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  modalTitle: { ...typography.h2, marginBottom: spacing.md, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: colors.gray[300], borderRadius: 10, padding: 12, marginBottom: spacing.md, backgroundColor: colors.white },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.md },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 8,
  },
  modalHeader: {
    padding: 14,
    alignItems: 'center',
  },
  modalHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    padding: spacing.md,
    alignItems: 'center',
  },
  avatarPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: spacing.md,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  avatarEditIcon: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputLarge: {
    width: '100%',
    fontSize: 16,
    paddingVertical: 12,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    marginRight: spacing.sm,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  cancelText: {
    color: colors.primary,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    marginLeft: spacing.sm,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ProfileScreen;