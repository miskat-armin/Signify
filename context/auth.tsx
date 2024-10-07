import auth from "@/config/auth";
import db from "@/config/db";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  signup: (
    email: string,
    password: string,
    username: string,
    phone: string,
    address: { country: string; state: string },
    avatar: string
  ) => Promise<any>;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>(null);

export function useAuth() {
  if (!AuthContext)
    throw new Error("useAuth must be used within an AuthProvider");
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<unknown>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, username, phone, address, avatar) => {
    return createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          username: username,
          phone: phone,
          address: address,
          avatar: avatar,
        });
      }
    );
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}
