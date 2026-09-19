import React from 'react';
import { AppRoute } from '../types';
import { Button } from './ui/Button';
import { APP_ASSETS, MOCK_USER_PROFILE } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  isAuthenticated,
  onLogout,
}) => {
  const { user } = useAuth();

  // Hide main header on standalone auth screens (/login and /register)
  if (currentRoute === '/login' || currentRoute === '/register') {
    return null;
  }

  const navLinks: Array<{ route: AppRoute; label: string }> = [
    { route: '/dashboard', label: 'Painel' },
    { route: '/availability', label: 'Folgas' },
    { route: '/explore', label: 'Explorar & IA' },
    { route: '/trips', label: 'Minhas Viagens' },
  ];

  const displayName = user?.displayName || MOCK_USER_PROFILE.displayName;
  const photoURL = user?.photoURL || APP_ASSETS.userProfile;

  return (
    <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <button
          onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          title="SmartTrip Início"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0b3c5d] to-[#ae3115] text-white font-extrabold text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            ST
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-[#00263f]">
              SmartTrip
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
              MVP
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links (Privadas se autenticado) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#0b3c5d] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/profile')}
                className={`flex items-center gap-2 p-1 pl-2 pr-3 rounded-full transition-all cursor-pointer ${
                  currentRoute === '/profile'
                    ? 'bg-slate-100 ring-2 ring-[#0b3c5d]/20'
                    : 'hover:bg-slate-100'
                }`}
                title="Meu Perfil"
              >
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline-block">
                  {displayName.split(' ')[0]}
                </span>
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-xs text-slate-500 hover:text-red-600"
                title="Sair da conta"
              >
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('/login')}
              >
                Entrar
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => onNavigate('/register')}
              >
                Começar Grátis
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
