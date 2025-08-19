import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Replace with your own Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCqZgT5hEJjawtL8AfUUgm-UV3TZEhzyx8",
  authDomain: "eleve8me-33d62.firebaseapp.com",
  projectId: "eleve8me-33d62",
  storageBucket: "eleve8me-33d62.firebasestorage.app",
  messagingSenderId: "1010671558020",
  appId: "1:1010671558020:web:27a008b2239b68343f91d1",
  measurementId: "G-D6JSYR8SZ6"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app, "khaopiyo");
