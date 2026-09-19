/**
 * Contratos de Tipagem de Autenticação — SmartTrip
 * Referência: SPEC-AUTH-001 (docs/specs/SPEC_AUTENTICACAO_FIREBASE.md)
 */

import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'user' | 'admin';

export interface UserPreferencesPayload {
  travelPace: 'slow' | 'moderate' | 'fast';
  interests: string[];
  budgetLevel: 'low' | 'medium' | 'high';
  dietaryRestrictions: string[];
}

export interface UserProfileDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  originCity: string;
  role: UserRole; // Sempre 'user' por padrão, protegido contra autoelevação
  preferences: UserPreferencesPayload;
  createdAt?: any;
  updatedAt?: any;
}

export interface AuthSessionState {
  user: UserProfileDocument | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthErrorResponse {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

export const DEFAULT_USER_PREFERENCES: UserPreferencesPayload = {
  travelPace: 'moderate',
  interests: ['Gastronomia', 'Cultura & Museus', 'Caminhadas ao Ar Livre'],
  budgetLevel: 'medium',
  dietaryRestrictions: [],
};
