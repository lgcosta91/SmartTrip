/**
 * Camada de Serviços — SmartTrip
 * 
 * Módulos integrados:
 * - Firebase: Inicialização Singleton do Client SDK (Auth & Firestore)
 * - Auth: Autenticação completa e sincronização de perfil (users/{uid})
 * - Gemini, Weather, Geocoding: Pendentes de integração nas fases seguintes
 */

export * from './firebase';

export const SERVICES_STATUS = {
  firebaseClient: 'initialized',
  firebaseAdmin: 'server_only',
  auth: 'ready',
  firestore: 'ready',
  gemini: 'pending_implementation',
  weather: 'pending_implementation',
  geocoding: 'pending_implementation',
} as const;
