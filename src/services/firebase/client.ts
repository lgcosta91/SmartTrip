/**
 * Inicialização Singleton do Firebase Client SDK — SmartTrip
 * 
 * Regra Arquitetural (SPEC-FB-001):
 * - Utiliza padrão Singleton estrito para prevenir erro de inicialização duplicada em HMR.
 * - Fornece acesso ao Firebase App, Firebase Auth e Cloud Firestore.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirebaseClientConfig } from './config';

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firebaseDbInstance: Firestore | null = null;

/**
 * Retorna a instância única do FirebaseApp, inicializando-a apenas se ainda não existir.
 * Previne duplicidade através do controle de getApps().
 */
export function getFirebaseApp(): FirebaseApp {
  if (firebaseAppInstance) {
    return firebaseAppInstance;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseAppInstance = existingApps[0];
    return firebaseAppInstance;
  }

  const { isValid, missingKeys, config } = getFirebaseClientConfig();

  if (!isValid) {
    console.warn(
      `[SmartTrip Firebase] Variáveis de ambiente ausentes (${missingKeys.join(', ')}). ` +
      `A inicialização real ocorrerá quando as chaves forem preenchidas em .env.local.`
    );
  }

  firebaseAppInstance = initializeApp({
    apiKey: config.apiKey || 'placeholder-api-key',
    authDomain: config.authDomain || 'smarttrip-dev.firebaseapp.com',
    projectId: config.projectId || 'smarttrip-dev',
    storageBucket: config.storageBucket || 'smarttrip-dev.appspot.com',
    messagingSenderId: config.messagingSenderId || '123456789',
    appId: config.appId || '1:123456789:web:abcdef',
    ...(config.measurementId ? { measurementId: config.measurementId } : {}),
  });

  return firebaseAppInstance;
}

/**
 * Retorna a instância Singleton do Firebase Authentication.
 */
export function getFirebaseAuth(): Auth {
  if (!firebaseAuthInstance) {
    const app = getFirebaseApp();
    firebaseAuthInstance = getAuth(app);
  }
  return firebaseAuthInstance;
}

/**
 * Retorna a instância Singleton do Cloud Firestore.
 */
export function getFirebaseDb(): Firestore {
  if (!firebaseDbInstance) {
    const app = getFirebaseApp();
    firebaseDbInstance = getFirestore(app);
  }
  return firebaseDbInstance;
}

// Exportações convenientes de instâncias Singleton
export const app = getFirebaseApp();
export const auth = getFirebaseAuth();
export const db = getFirebaseDb();
