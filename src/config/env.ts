/**
 * Configuração de Variáveis de Ambiente — SmartTrip
 * Centraliza a leitura das variáveis definidas em .env.example
 */

export const env = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  },
  weatherApiUrl: import.meta.env.VITE_WEATHER_API_URL || 'https://api.open-meteo.com/v1',
  geocodingApiUrl: import.meta.env.VITE_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1',
  appUrl: import.meta.env.VITE_APP_URL || '',
};
