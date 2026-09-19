/**
 * Serviço de Integração do Cloud Firestore — SmartTrip
 * 
 * Centraliza todas as operações de persistência e leitura das entidades:
 * - /users/{userId}
 * - /timeOffs/{timeOffId}
 * - /trips/{tripId}
 * 
 * Regra Inviolável de Segurança:
 * - Toda gravação associa explicitamente o `userId` autenticado.
 * - Toda consulta é filtrada pelo `userId` do solicitante para garantir isolamento.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './client';
import { TimeOffPeriod, SavedTrip } from '../../types';

// =================================================================
// 1. FOLGAS E DISPONIBILIDADE (/timeOffs)
// =================================================================

/**
 * Consulta todas as folgas cadastradas para o usuário autenticado.
 */
export async function getTimeOffs(userId: string): Promise<TimeOffPeriod[]> {
  if (!userId) return [];

  const timeOffsRef = collection(db, 'timeOffs');
  const q = query(timeOffsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  const results: TimeOffPeriod[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    results.push({
      id: docSnap.id,
      userId: data.userId,
      title: data.title || 'Folga sem título',
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: data.totalDays || 1,
      status: data.status || 'upcoming',
    });
  });

  // Ordena por data de início ascendente
  return results.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/**
 * Cadastra uma nova folga no Firestore associada ao usuário autenticado.
 */
export async function createTimeOff(
  userId: string,
  data: {
    title: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    status: 'upcoming' | 'ongoing' | 'past';
  }
): Promise<TimeOffPeriod> {
  if (!userId) throw new Error('Usuário não autenticado.');

  const timeOffsRef = collection(db, 'timeOffs');
  const payload = {
    userId, // Garante que confere com request.auth.uid (firestore.rules)
    title: data.title.trim(),
    startDate: data.startDate,
    endDate: data.endDate,
    totalDays: data.totalDays,
    status: data.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(timeOffsRef, payload);

  return {
    id: docRef.id,
    userId,
    ...data,
  };
}

/**
 * Exclui uma folga do Firestore.
 */
export async function deleteTimeOff(timeOffId: string): Promise<void> {
  if (!timeOffId) return;
  const docRef = doc(db, 'timeOffs', timeOffId);
  await deleteDoc(docRef);
}

// =================================================================
// 2. VIAGENS E ROTEIROS (/trips)
// =================================================================

/**
 * Consulta todas as viagens cadastradas do usuário autenticado.
 */
export async function getTrips(userId: string): Promise<SavedTrip[]> {
  if (!userId) return [];

  const tripsRef = collection(db, 'trips');
  const q = query(tripsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  const results: SavedTrip[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    results.push({
      id: docSnap.id,
      title: data.title || 'Viagem sem título',
      destination: data.destination || '',
      dates: data.dates || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      daysCount: data.daysCount || 1,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
      badge: data.badge || 'IA Planejada',
      budgetEst: data.budgetEst || 'R$ 0',
      status: data.status || 'Planejamento',
      weatherSummary: data.weatherSummary,
      days: data.days || [],
    });
  });

  return results;
}

/**
 * Recupera os detalhes de uma viagem específica no Firestore.
 */
export async function getTripById(tripId: string): Promise<SavedTrip | null> {
  if (!tripId) return null;

  const tripRef = doc(db, 'trips', tripId);
  const snap = await getDoc(tripRef);

  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: snap.id,
    title: data.title || 'Viagem sem título',
    destination: data.destination || '',
    dates: data.dates || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    daysCount: data.daysCount || 1,
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
    badge: data.badge || 'IA Planejada',
    budgetEst: data.budgetEst || 'R$ 0',
    status: data.status || 'Planejamento',
    weatherSummary: data.weatherSummary,
    days: data.days || [],
  };
}

/**
 * Cria ou salva um novo roteiro de viagem no Firestore.
 */
export async function createTrip(
  userId: string,
  trip: Omit<SavedTrip, 'id'>
): Promise<SavedTrip> {
  if (!userId) throw new Error('Usuário não autenticado.');

  const tripsRef = collection(db, 'trips');
  const payload = {
    userId, // Compulsório para Security Rules
    ...trip,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(tripsRef, payload);

  return {
    id: docRef.id,
    ...trip,
  };
}

/**
 * Exclui uma viagem do Firestore.
 */
export async function deleteTrip(tripId: string): Promise<void> {
  if (!tripId) return;
  const tripRef = doc(db, 'trips', tripId);
  await deleteDoc(tripRef);
}
