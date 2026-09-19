/**
 * Contexto Global de Autenticação — SmartTrip
 * 
 * Gerencia a sessão do usuário com Firebase Authentication e sincronização de /users/{uid}.
 * Referência: SPEC-AUTH-001 (docs/specs/SPEC_AUTENTICACAO_FIREBASE.md)
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '../services/firebase/client';
import {
  UserProfileDocument,
  DEFAULT_USER_PREFERENCES,
} from '../services/firebase/authTypes';
import {
  registerWithEmail as serviceRegister,
  loginWithEmail as serviceLogin,
  loginWithGoogle as serviceLoginGoogle,
  logout as serviceLogout,
  sendPasswordReset as serviceResetPassword,
  syncUserProfile,
} from '../services/firebase/authService';

export interface AuthContextType {
  user: UserProfileDocument | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfileDocument>) => Promise<void>;
  clearError: () => void;
  // Auxiliar para demonstração e testes
  setDemoUser: (profile: UserProfileDocument | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfileDocument | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Escuta ativa de mudanças no estado de autenticação (SPEC-AUTH-001)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      if (currentFirebaseUser) {
        setFirebaseUser(currentFirebaseUser);
        try {
          const profile = await syncUserProfile(currentFirebaseUser);
          setUser(profile);
        } catch (err) {
          // Fallback seguro em caso de indisponibilidade momentânea do Firestore
          setUser({
            uid: currentFirebaseUser.uid,
            email: currentFirebaseUser.email || '',
            displayName: currentFirebaseUser.displayName || 'Viajante SmartTrip',
            photoURL: currentFirebaseUser.photoURL || null,
            originCity: 'São Paulo, Brasil',
            role: 'user',
            preferences: DEFAULT_USER_PREFERENCES,
          });
        }
      } else {
        setFirebaseUser(null);
        // Se não houver usuário mock/demo ativo manualmente, reseta
        setUser((prev) => (prev?.uid.startsWith('demo_') ? prev : null));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { firebaseUser: fbUser, userProfile } = await serviceLogin(email, password);
      setFirebaseUser(fbUser);
      setUser(userProfile);
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { firebaseUser: fbUser, userProfile } = await serviceRegister(
        email,
        password,
        displayName
      );
      setFirebaseUser(fbUser);
      setUser(userProfile);
    } catch (err: any) {
      setError(err.message || 'Falha ao criar conta.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { firebaseUser: fbUser, userProfile } = await serviceLoginGoogle();
      setFirebaseUser(fbUser);
      setUser(userProfile);
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação com Google.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await serviceLogout();
      setFirebaseUser(null);
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Falha ao encerrar sessão.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await serviceResetPassword(email);
    } catch (err: any) {
      setError(err.message || 'Falha ao solicitar redefinição de senha.');
      throw err;
    }
  };

  const updateProfileData = async (updates: Partial<UserProfileDocument>) => {
    if (!user) return;
    
    // Proibição estrita de autoelevação no cliente (SPEC-AUTH-001)
    const sanitizedUpdates = { ...updates };
    delete (sanitizedUpdates as any).role;
    delete (sanitizedUpdates as any).uid;

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...sanitizedUpdates,
      updatedAt: serverTimestamp(),
    });

    setUser((prev) => (prev ? { ...prev, ...sanitizedUpdates } : null));
  };

  const setDemoUser = (profile: UserProfileDocument | null) => {
    setUser(profile);
    setIsLoading(false);
  };

  const isAuthenticated = Boolean(user || firebaseUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAuthenticated,
        error,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfileData,
        clearError,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return context;
};
