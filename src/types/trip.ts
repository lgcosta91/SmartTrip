/**
 * SmartTrip - Definições de Tipos do Domínio (Conforme SPEC Mestre)
 * Rastreabilidade: Modelo de Dados Conceitual (Seção 12 da SPEC Mestre)
 */

export interface UserPreferences {
  travelPace: 'slow' | 'moderate' | 'fast';
  interests: string[];
  budgetLevel: 'low' | 'medium' | 'high';
  dietaryRestrictions?: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimeOffPeriod {
  id: string;
  userId: string;
  title: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
  createdAt?: string;
}

export type ActivityPeriod = 'morning' | 'afternoon' | 'night';

export interface ActivityProposal {
  id: string;
  period: ActivityPeriod;
  time?: string;
  title: string;
  description: string;
  placeName?: string;
  estimatedCost?: string | number;
  estimatedDurationMin?: number;
  isCustomized?: boolean;
}

export interface ItineraryDayProposal {
  dayNumber: number;
  date: string; // ISO YYYY-MM-DD
  theme?: string;
  weatherForecast?: string;
  activities: ActivityProposal[];
}

export type TripStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled';

export interface TripProposal {
  id?: string;
  userId: string;
  destination: {
    name: string;
    latitude: number;
    longitude: number;
    countryCode?: string;
  };
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
  totalDays: number;
  status: TripStatus;
  weatherSnapshot?: {
    avgTemp: number;
    condition: string;
  };
  itinerary: ItineraryDayProposal[];
  createdAt?: string;
  updatedAt?: string;
}
