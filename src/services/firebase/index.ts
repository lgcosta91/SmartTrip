/**
 * Ponto de entrada público da camada Firebase — SmartTrip
 * 
 * Regra de Segurança:
 * - Expõe exclusivamente o Client SDK (app, auth, db), serviços de autenticação e utilitários de validação.
 * - O módulo Admin (admin.ts) NÃO é exportado aqui para garantir que nenhum bundler do cliente
 *   inclua código de servidor ou credenciais privadas.
 */

export { app, auth, db, getFirebaseApp, getFirebaseAuth, getFirebaseDb } from './client';
export { getFirebaseClientConfig, assertFirebaseConfigured } from './config';
export type { FirebaseClientConfig, ConfigValidationResult } from './config';

// Autenticação e Perfis (SPEC-AUTH-001)
export * from './authTypes';
export * from './authErrors';
export * from './authService';

// Firestore: Folgas e Viagens
export * from './firestoreService';
