export type AppRoute =
  | '/'
  | '/login'
  | '/register'
  | '/dashboard'
  | '/profile'
  | '/availability'
  | '/explore'
  | '/trips'
  | '/trips/:id';

export type ScreenId =
  | AppRoute
  | 'explorar'
  | 'roteiro'
  | 'criar-com-ia'
  | 'salvos'
  | 'perfil'
  | 'atracao-detalhes'
  | 'checkout'
  | 'notificacoes'
  | 'login';

export type UIState = 'normal' | 'empty' | 'loading' | 'error';

export interface UserPreferences {
  travelPace: 'slow' | 'moderate' | 'fast';
  interests: string[];
  budgetLevel: 'low' | 'medium' | 'high';
  dietaryRestrictions: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  originCity: string;
  role?: 'user' | 'admin';
  preferences: UserPreferences;
}

export interface TimeOffPeriod {
  id: string;
  userId: string;
  title: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
  totalDays: number;
  status: 'upcoming' | 'ongoing' | 'past';
}

export interface ActivityItem {
  id: string;
  time: string;
  period?: 'morning' | 'afternoon' | 'night';
  duration?: string;
  title: string;
  category: string;
  rating?: number;
  reviewsCount?: number;
  priceText?: string;
  priceVal?: number;
  imageUrl?: string;
  description: string;
  placeName?: string;
  tags: string[];
  aiTip?: string;
  statusBadge?: string;
  isBooked?: boolean;
  isCustomized?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  dateStr: string;
  weekday: string;
  title: string;
  summary: string;
  weather: {
    temp: string;
    condition: string;
    icon: string;
    sunAdvise?: string;
  };
  totalBudgetDay?: string;
  activities: ActivityItem[];
}

export interface TripMember {
  id: string;
  name: string;
  role: 'Dono' | 'Editor' | 'Visualizador';
  avatarUrl: string;
  badgeColor?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'Documentos' | 'Vestuário' | 'Eletrônicos';
  checked: boolean;
}

export interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  imageUrl: string;
  badge: string;
  budgetEst: string;
  status: 'Planejamento' | 'Confirmada' | 'Concluído' | 'Favorito';
  weatherSummary?: {
    avgTemp: string;
    condition: string;
  };
  days: DayItinerary[];
}

export interface DestinationOption {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  avgTemp: string;
  weatherCondition: string;
  popularPOIs: Array<{
    name: string;
    category: string;
    description: string;
  }>;
}

export interface PredictiveAlert {
  id: string;
  time: string;
  type: 'weather' | 'crowd' | 'booking' | 'flight';
  title: string;
  description: string;
  actionText?: string;
  actionScreen?: ScreenId;
  icon: string;
}
