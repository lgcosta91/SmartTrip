/**
 * Configuração e Validação de Variáveis do Firebase Client SDK — SmartTrip
 * 
 * Regra de Segurança: Apenas variáveis com prefixo VITE_ são consumidas aqui.
 * Variáveis privadas do servidor nunca são acessadas neste módulo.
 */

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface ConfigValidationResult {
  isValid: boolean;
  missingKeys: string[];
  config: FirebaseClientConfig;
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseClientConfig = {
  apiKey: "AIzaSyD5TT9il3NCY47SgKQvDAXCvetsFioVtWU",
  authDomain: "smarttrip-d951a.firebaseapp.com",
  projectId: "smarttrip-d951a",
  storageBucket: "smarttrip-d951a.firebasestorage.app",
  messagingSenderId: "267870578271",
  appId: "1:267870578271:web:f90d3cea4513504a3cddea",
  measurementId: "G-NGCH3QDPRW",
};

/**
 * Lê e valida as variáveis de ambiente necessárias para o Client SDK.
 */
export function getFirebaseClientConfig(): ConfigValidationResult {
  const config: FirebaseClientConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || DEFAULT_FIREBASE_CONFIG.measurementId,
  };

  const missingKeys: string[] = [];

  if (!config.apiKey) missingKeys.push('VITE_FIREBASE_API_KEY');
  if (!config.authDomain) missingKeys.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!config.projectId) missingKeys.push('VITE_FIREBASE_PROJECT_ID');
  if (!config.appId) missingKeys.push('VITE_FIREBASE_APP_ID');

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    config,
  };
}

/**
 * Lança um erro detalhado caso a configuração obrigatória esteja ausente.
 */
export function assertFirebaseConfigured(): FirebaseClientConfig {
  const { isValid, missingKeys, config } = getFirebaseClientConfig();

  if (!isValid) {
    const errorMsg = `[SmartTrip Firebase Error] Configuração obrigatória do Firebase Client ausente!\n` +
      `As seguintes variáveis de ambiente não foram encontradas:\n` +
      missingKeys.map((k) => ` - ${k}`).join('\n') +
      `\n\nPor favor, defina essas variáveis em seu arquivo .env.local com base no .env.example.`;
    throw new Error(errorMsg);
  }

  return config;
}
