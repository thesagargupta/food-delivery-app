import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView, // Import ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography } from '../styles';
import { auth } from '../config/firebase';
import { signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// Native (Android/iOS) will use @react-native-firebase/auth for invisible verification (SafetyNet / Play Integrity / silent reCAPTCHA)
let authNative = null;
if (Platform.OS !== 'web') {
  try {
    authNative = require('@react-native-firebase/auth').default;
  } catch (_) {
    // library not installed yet; will fall back to web SDK (will show captcha if used on native)
  }
}

const LoginScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const otpInputRef = useRef(null);
  const recaptchaVerifier = useRef(null); // web: DOM RecaptchaVerifier, native fallback: FirebaseRecaptchaVerifierModal

  const [activeIndex, setActiveIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  const carouselImages = useMemo(() => {
    return [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setActiveIndex((p) => (p + 1) % carouselImages.length);
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length, opacity]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    }
  }, []);

  // Dev helper: allow using Firebase test phone numbers without sending real SMS (configure test numbers in Firebase console first)
  useEffect(() => {
    // Allow test phone numbers on web SDK only (native firebase sdk handles its own test mode)
    try {
      if (__DEV__ && Platform.OS === 'web' && auth?.settings) {
        auth.settings.appVerificationDisabledForTesting = true;
      }
    } catch (_) {}
  }, []);

  const sendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      Alert.alert('Invalid phone', 'Please enter a valid 10-digit Indian phone number starting with 6-9.');
      return;
    }
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        const appVerifier = recaptchaVerifier.current;
        const confirmationResult = await signInWithPhoneNumber(auth, `+91${cleaned}`, appVerifier);
        setVerificationId(confirmationResult); // has .confirm
      } else if (authNative) {
        // Pure native module path (no custom verifier needed)
        const confirmation = await authNative().signInWithPhoneNumber(`+91${cleaned}`);
        setVerificationId(confirmation); // has .confirm
      } else {
        // Expo Go / no native module: must supply a FirebaseRecaptchaVerifierModal ref as appVerifier
        const appVerifier = recaptchaVerifier.current;
        if (!appVerifier) throw new Error('Recaptcha verifier not ready');
        const confirmationResult = await signInWithPhoneNumber(auth, `+91${cleaned}`, appVerifier);
        setVerificationId(confirmationResult); // has .confirm
      }
      setStep('otp');
      Alert.alert('OTP sent', 'Please check your messages.');
      setTimeout(() => otpInputRef.current && otpInputRef.current.focus(), 250);
    } catch (_error) {
      console.log('sendOtp error', _error?.code, _error?.message, _error);
      if (_error?.code === 'auth/billing-not-enabled') {
        Alert.alert(
          'Enable Billing for Phone Auth',
          'Your Firebase project must be upgraded (Blaze plan) OR disable reCAPTCHA Enterprise for Phone Auth in Firebase Console > Authentication > Settings. For development you can add test phone numbers and keep billing disabled.'
        );
      } else if (_error?.code === 'auth/invalid-app-credential') {
        Alert.alert('ReCAPTCHA issue', 'ReCAPTCHA token invalid. Try again or clear the Metro cache.');
      } else if (_error?.code === 'auth/too-many-requests') {
        Alert.alert('Too many attempts', 'Please wait a bit before requesting another OTP.');
      } else {
        Alert.alert('OTP send failed', _error?.message || String(_error));
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Invalid OTP', 'Enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      if (verificationId && typeof verificationId.confirm === 'function') {
        // confirmationResult from web or native RN Firebase
        await verificationId.confirm(otp);
      } else {
        const credential = PhoneAuthProvider.credential(verificationId, otp);
        await signInWithCredential(auth, credential); // fallback path
      }
      router.replace('/(tabs)');
    } catch (_error) {
      console.log('verifyOtp error', _error?.code, _error?.message, _error);
      if (_error?.code === 'auth/billing-not-enabled') {
        Alert.alert(
          'Enable Billing for Phone Auth',
          'Upgrade project billing OR disable reCAPTCHA Enterprise. (Firebase Console > Authentication > Settings)'
        );
      } else if (_error?.code === 'auth/invalid-verification-code') {
        Alert.alert('Incorrect OTP', 'The OTP you entered is incorrect.');
      } else if (_error?.code === 'auth/invalid-verification-id') {
        Alert.alert('Session expired', 'Please request a new OTP.');
      } else {
        Alert.alert('Verification failed', _error?.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const cardBackgroundColor = isDarkMode ? colors.gray[900] : colors.white;
  const textColor = isDarkMode ? colors.white : colors.black;
  const placeholderTextColor = isDarkMode ? colors.gray[500] : colors.gray[400];

  return (
    // FIX: Use a standard View as the root container instead of KeyboardAvoidingView.
    // This prevents the entire layout from resizing when the keyboard appears.
    <View style={{ flex: 1, backgroundColor: isDarkMode ? colors.dark : colors.light }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Animated.Image source={{ uri: carouselImages[activeIndex] }} style={[styles.heroImage, { opacity }]} />

      {/* Native fallback (Expo Go) invisible reCAPTCHA modal; does not render on web */}
      {Platform.OS !== 'web' && !authNative && (
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app?.options || {}}
          attemptInvisibleVerification
        />
      )}

      {/* The card now maintains its size because its parent (the root View) doesn't shrink. */}
      <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
        {/* FIX: KeyboardAvoidingView is now inside the card, only affecting the form content. */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          {/* FIX: ScrollView allows content to scroll if the keyboard covers it, without shrinking the container. */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* This wrapper helps in structuring the content within the ScrollView */}
            <View>
              <Text style={[typography.h2, { marginBottom: spacing.sm, textAlign: 'center', color: textColor }]}>
                Your Personal Food-Court
              </Text>
              <Text style={[typography.body, { color: colors.gray[500], textAlign: 'center', marginBottom: spacing.lg }]}>
                Let&apos;s get started
              </Text>

              {/* Web-only invisible Recaptcha target (DOM div) */}
              <View id="recaptcha-container" style={{ position: 'absolute', top: -1000, left: -1000 }}></View>

              {step === 'phone' ? (
                <>
                  <View style={[styles.phoneRow, { backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100] }]}>
                    <Text style={{ fontSize: 16, marginRight: spacing.sm, color: textColor }}>+91</Text>
                    <TextInput
                      style={[styles.input, { color: textColor }]}
                      placeholder="Enter your phone number"
                      placeholderTextColor={placeholderTextColor}
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      maxLength={10}
                    />
                  </View>

                  <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={sendOtp} disabled={loading}>
                    <Text style={styles.btnText}>{loading ? 'Sending...' : 'Continue'}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={{ marginBottom: spacing.sm, color: textColor, textAlign: 'center' }}>
                    Enter the 6-digit OTP sent to +91 {phone}
                  </Text>
                  <TextInput
                    ref={otpInputRef}
                    style={[styles.otpInput, { color: textColor, borderColor: isDarkMode ? colors.gray[700] : colors.gray[200] }]}
                    placeholder="------"
                    placeholderTextColor={placeholderTextColor}
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                  />

                  <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={verifyOtp} disabled={loading}>
                    <Text style={styles.btnText}>{loading ? 'Verifying...' : 'Verify & Proceed'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => { setStep('phone'); setOtp(''); setVerificationId(null); }} style={{ marginTop: spacing.md }}>
                    <Text style={{ color: colors.primary, textAlign: 'center' }}>Use another number</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <Text style={[styles.lowerText, { textAlign: 'center', color: colors.gray[500]}]}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lowerText: {marginBottom: 100 },
  heroImage: { width: '100%', height: '45%', resizeMode: 'cover' },
  card: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden', // Ensures content inside respects the border radius.
  },
  // FIX: New style for the ScrollView's content.
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'space-between', // Pushes the 'Terms of Service' text to the bottom.
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  input: { flex: 1, fontSize: 16, ...typography.body },
  btn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: spacing.sm },
  btnText: { color: colors.white, fontWeight: '700', ...typography.h3 },
  otpInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    textAlign: 'center',
    fontSize: 22,
    marginBottom: spacing.md,
    letterSpacing: 10,
    ...typography.h2,
  },
});

export default LoginScreen;
