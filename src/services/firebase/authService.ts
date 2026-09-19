/**
 * Serviço de Autenticação e Sincronização de Perfil — SmartTrip
 * 
 * DIRETRIZES DE SEGURANÇA INEGOCIÁVEIS (SPEC-AUTH-001):
 * 1. O papel inicial é estritamente 'user' (não aceito de parâmetros externos).
 * 2. A identidade é exclusivamente obtida de auth.currentUser.uid.
 * 3. Nunca registrar senhas ou tokens em logs (sanitização obrigatória).
 * 4. Criação de perfil em /users/{uid} é idempotente (não sobrescreve dados existentes).
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from './client';
import {
  UserProfileDocument,
  DEFAULT_USER_PREFERENCES,
} from './authTypes';
import { getFriendlyAuthErrorMessage } from './authErrors';

/**
 * Cria ou recupera de forma idempotente o perfil do usuário em /users/{uid}.
 * Se o documento já existir, preserva as preferências e role existentes.
 * Se não existir, inicializa compulsoriamente com role: 'user'.
 */
export async function syncUserProfile(
  firebaseUser: FirebaseUser,
  customDisplayName?: string
): Promise<UserProfileDocument> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userDocSnap = await getDoc(userRef);

  if (userDocSnap.exists()) {
    const data = userDocSnap.data() as UserProfileDocument;
    return {
      ...data,
      uid: firebaseUser.uid,
      email: firebaseUser.email || data.email,
      displayName: customDisplayName || data.displayName || firebaseUser.displayName || 'Viajante SmartTrip',
      photoURL: data.photoURL || firebaseUser.photoURL || null,
      role: data.role || 'user',
    };
  }

  // Novo perfil: Inicialização com papel travado em 'user' (sem autoelevação)
  const newProfile: UserProfileDocument = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: customDisplayName || firebaseUser.displayName || 'Viajante SmartTrip',
    photoURL: firebaseUser.photoURL || null,
    originCity: 'São Paulo, Brasil',
    role: 'user', // Hardcoded e validado em firestore.rules
    preferences: DEFAULT_USER_PREFERENCES,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

/**
 * Recupera o perfil do usuário em /users/{uid}.
 */
export async function getUserProfile(uid: string): Promise<UserProfileDocument | null> {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return snap.data() as UserProfileDocument;
}

/**
 * Cadastro por E-mail e Senha
 * - Cria a conta no Firebase Auth
 * - Atualiza o displayName no Auth
 * - Inicializa compulsoriamente o perfil em /users/{uid} com role 'user'
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<{ firebaseUser: FirebaseUser; userProfile: UserProfileDocument }> {
  // Validações no cliente
  if (!email || !email.includes('@')) {
    throw new Error('O endereço de e-mail informado não é válido.');
  }
  if (!password || password.length < 6) {
    throw new Error('A senha deve conter no mínimo 6 caracteres.');
  }
  if (!displayName || !displayName.trim()) {
    throw new Error('Informe seu nome completo para o cadastro.');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // Atualiza nome no Firebase Auth
    await updateProfile(user, { displayName: displayName.trim() });

    // Criação idempotente do perfil no Firestore
    const profile = await syncUserProfile(user, displayName.trim());

    return { firebaseUser: user, userProfile: profile };
  } catch (error: any) {
    const friendlyMessage = getFriendlyAuthErrorMessage(error);
    const err = new Error(friendlyMessage);
    (err as any).code = error.code;
    throw err;
  }
}

/**
 * Login por E-mail e Senha
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ firebaseUser: FirebaseUser; userProfile: UserProfileDocument }> {
  if (!email || !password) {
    throw new Error('Informe seu e-mail e sua senha de acesso.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // Recupera ou cria perfil no Firestore
    const profile = await syncUserProfile(user);

    return { firebaseUser: user, userProfile: profile };
  } catch (error: any) {
    const friendlyMessage = getFriendlyAuthErrorMessage(error);
    const err = new Error(friendlyMessage);
    (err as any).code = error.code;
    throw err;
  }
}

/**
 * Login Federado com Google (Google SSO)
 */
export async function loginWithGoogle(): Promise<{
  firebaseUser: FirebaseUser;
  userProfile: UserProfileDocument;
}> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Cria perfil caso primeiro login, ou recupera existente
    const profile = await syncUserProfile(user);

    return { firebaseUser: user, userProfile: profile };
  } catch (error: any) {
    const friendlyMessage = getFriendlyAuthErrorMessage(error);
    const err = new Error(friendlyMessage);
    (err as any).code = error.code;
    throw err;
  }
}

/**
 * Logout do Usuário
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Recuperação de Senha por E-mail
 * Em conformidade com SPEC-AUTH-001, não expõe se o e-mail existe no banco
 */
export async function sendPasswordReset(email: string): Promise<void> {
  if (!email || !email.includes('@')) {
    throw new Error('Informe um e-mail válido para a recuperação de senha.');
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    // Se o erro for de usuário não encontrado, silenciamos para evitar enumeração de contas
    if (error.code === 'auth/user-not-found') {
      return;
    }
    const friendlyMessage = getFriendlyAuthErrorMessage(error);
    const err = new Error(friendlyMessage);
    (err as any).code = error.code;
    throw err;
  }
}
