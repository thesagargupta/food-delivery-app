import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Replace with your own Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAkuy9aOWHwYp-nT_vrZYR_c8RkZiZqic4",
  authDomain: "food-app-77d74.firebaseapp.com",
  projectId: "food-app-77d74",
  storageBucket: "food-app-77d74.firebasestorage.app",
  messagingSenderId: "941488007971",
  appId: "1:941488007971:web:eec28463fdb92b9c2dfa96",
  measurementId: "G-VPV9MDPN6P",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
