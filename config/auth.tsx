import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import app from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default auth;
