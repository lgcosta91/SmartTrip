import React, { useState, useEffect } from 'react';
import { AppRoute, TimeOffPeriod } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Screens
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AvailabilityScreen } from './screens/AvailabilityScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { TripsScreen } from './screens/TripsScreen';
import { TripDetailScreen } from './screens/TripDetailScreen';

const PRIVATE_ROUTES: AppRoute[] = [
  '/dashboard',
  '/profile',
  '/availability',
  '/explore',
  '/trips',
  '/trips/:id',
];

function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/');
  const [selectedTripId, setSelectedTripId] = useState<string>('lisboa-2026');
  const [exploreParams, setExploreParams] = useState<{ start?: string; end?: string }>({});

  // Recupera parâmetro de redirecionamento da URL se existente
  const getRedirectParam = (): string | null => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      if (redirect && redirect.startsWith('/')) {
        return redirect;
      }
    } catch {
      // Ignora erro de parsing
    }
    return null;
  };

  // Sincronização e proteção de rota (SPEC-AUTH-001 Seção 8)
  const navigateTo = (route: AppRoute, customPath?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // CA-AUTH-006: Usuário anônimo tentando acessar rota privada
    if (!isAuthenticated && PRIVATE_ROUTES.includes(route)) {
      const target = customPath || route;
      setCurrentRoute('/login');
      window.history.pushState({}, '', `/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    // CA-AUTH-007: Usuário logado tentando acessar login/register
    if (isAuthenticated && (route === '/login' || route === '/register')) {
      const target = getRedirectParam() || '/dashboard';
      if (target.startsWith('/trips/')) {
        setCurrentRoute('/trips/:id');
      } else {
        setCurrentRoute((target as AppRoute) || '/dashboard');
      }
      window.history.pushState({}, '', target);
      return;
    }

    setCurrentRoute(route);
    const pathForUrl = customPath || (route === '/trips/:id' ? `/trips/${selectedTripId}` : route);
    window.history.pushState({}, '', pathForUrl);
  };

  // Inicialização e escuta de popstate (Back/Forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '/login' || path === '/register' || path === '/dashboard' ||
          path === '/profile' || path === '/availability' || path === '/explore' || path === '/trips') {
        setCurrentRoute(path as AppRoute);
      } else if (path.startsWith('/trips/')) {
        setCurrentRoute('/trips/:id');
        const parts = path.split('/');
        if (parts[2]) setSelectedTripId(parts[2]);
      } else {
        setCurrentRoute('/');
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Monitora transição de autenticação e rotas privadas
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && PRIVATE_ROUTES.includes(currentRoute)) {
      const target = window.location.pathname;
      setCurrentRoute('/login');
      window.history.pushState({}, '', `/login?redirect=${encodeURIComponent(target)}`);
    } else if (isAuthenticated && (currentRoute === '/login' || currentRoute === '/register')) {
      const redirect = getRedirectParam() || '/dashboard';
      if (redirect.startsWith('/trips/')) {
        setCurrentRoute('/trips/:id');
      } else {
        setCurrentRoute((redirect as AppRoute) || '/dashboard');
      }
      window.history.pushState({}, '', redirect);
    }
  }, [isAuthenticated, isLoading, currentRoute]);

  const handleLoginSuccess = () => {
    const redirect = getRedirectParam();
    if (redirect) {
      if (redirect.startsWith('/trips/')) {
        const parts = redirect.split('/');
        if (parts[2]) setSelectedTripId(parts[2]);
        setCurrentRoute('/trips/:id');
      } else {
        setCurrentRoute(redirect as AppRoute);
      }
      window.history.pushState({}, '', redirect);
    } else {
      navigateTo('/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigateTo('/');
  };

  const handleTimeOffSelectedForTrip = (timeOff: TimeOffPeriod) => {
    setExploreParams({ start: timeOff.startDate, end: timeOff.endDate });
  };

  // Carregamento inicial da sessão Firebase
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0b3c5d] to-[#ae3115] text-white font-extrabold text-xl flex items-center justify-center shadow-lg animate-pulse mb-4">
          ST
        </div>
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          Carregando SmartTrip...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased flex flex-col selection:bg-amber-100 selection:text-amber-950">
      {/* Top Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={(route) => navigateTo(route)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-20 md:pb-12">
        {currentRoute === '/' && (
          <LandingScreen onNavigate={(route) => navigateTo(route)} />
        )}

        {currentRoute === '/login' && (
          <LoginScreen
            onNavigate={(route) => navigateTo(route)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentRoute === '/register' && (
          <RegisterScreen
            onNavigate={(route) => navigateTo(route)}
            onRegisterSuccess={handleLoginSuccess}
          />
        )}

        {currentRoute === '/dashboard' && (
          <DashboardScreen
            onNavigate={(route) => navigateTo(route)}
            onSelectTrip={(id) => {
              setSelectedTripId(id);
              navigateTo('/trips/:id', `/trips/${id}`);
            }}
          />
        )}

        {currentRoute === '/profile' && (
          <ProfileScreen
            onNavigate={(route) => navigateTo(route)}
            onLogout={handleLogout}
          />
        )}

        {currentRoute === '/availability' && (
          <AvailabilityScreen
            onNavigate={(route) => navigateTo(route)}
            onSelectTimeOffForTrip={handleTimeOffSelectedForTrip}
          />
        )}

        {currentRoute === '/explore' && (
          <ExploreScreen
            onNavigate={(route) => navigateTo(route)}
            initialStartDate={exploreParams.start}
            initialEndDate={exploreParams.end}
            onGenerateTripSuccess={(id) => {
              setSelectedTripId(id);
              navigateTo('/trips/:id', `/trips/${id}`);
            }}
          />
        )}

        {currentRoute === '/trips' && (
          <TripsScreen
            onNavigate={(route) => navigateTo(route)}
            onSelectTrip={(id) => {
              setSelectedTripId(id);
              navigateTo('/trips/:id', `/trips/${id}`);
            }}
          />
        )}

        {currentRoute === '/trips/:id' && (
          <TripDetailScreen
            tripId={selectedTripId}
            onNavigate={(route) => navigateTo(route)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <Navigation
        currentRoute={currentRoute}
        onNavigate={(route) => navigateTo(route)}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
