import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = '@framez_user_persist';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load persisted auth state on mount
  useEffect(() => {
    loadPersistedAuth();
  }, []);

  // Listen to Firebase auth changes
  useEffect(() => {
    console.log('🔥 Setting up auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      console.log('🔥 Auth state changed:', currentUser?.email || 'No user');
      setUser(currentUser);
      
      // Persist auth state
      if (currentUser) {
        await persistAuth(currentUser);
      } else {
        await clearPersistedAuth();
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🔥 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const loadPersistedAuth = async (): Promise<void> => {
    try {
      const persistedData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (persistedData) {
        console.log('✅ Found persisted auth data');
        // Firebase auth will automatically restore session if valid
      } else {
        console.log('ℹ️ No persisted auth data found');
      }
    } catch (error) {
      console.error('❌ Error loading persisted auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const persistAuth = async (currentUser: User): Promise<void> => {
    try {
      const userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log('✅ Auth persisted successfully');
    } catch (error) {
      console.error('❌ Error persisting auth:', error);
    }
  };

  const clearPersistedAuth = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      console.log('✅ Persisted auth cleared');
    } catch (error) {
      console.error('❌ Error clearing persisted auth:', error);
    }
  };

  const signup = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      console.log('📝 Signing up user:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      console.log('✅ Signup successful');
    } catch (error: any) {
      console.error('❌ Signup error:', error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔐 Logging in user:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful');
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Logging out user');
      await signOut(auth);
      await clearPersistedAuth();
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout error:', error.message);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};