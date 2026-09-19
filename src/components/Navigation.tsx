import React from 'react';
import { AppRoute } from '../types';

interface NavigationProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  isAuthenticated: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentRoute,
  onNavigate,
  isAuthenticated,
}) => {
  // Hide bottom navigation on unauthenticated/standalone screens
  if (!isAuthenticated || currentRoute === '/' || currentRoute === '/login' || currentRoute === '/register') {
    return null;
  }

  const navItems: Array<{
    route: AppRoute;
    label: string;
    icon: string;
    isCenterAction?: boolean;
  }> = [
    { route: '/dashboard', label: 'Painel', icon: '📊' },
    { route: '/availability', label: 'Folgas', icon: '📅' },
    { route: '/explore', label: 'Criar IA', icon: '✨', isCenterAction: true },
    { route: '/trips', label: 'Viagens', icon: '🧳' },
    { route: '/profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <nav
      aria-label="Navegação móvel"
      className="md:hidden fixed bottom-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-safe"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = currentRoute === item.route;

          if (item.isCenterAction) {
            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] group focus:outline-none transition-transform active:scale-95 cursor-pointer"
                title={item.label}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-tr from-[#0b3c5d] to-[#ae3115] flex items-center justify-center text-white shadow-md -mt-5 transition-all duration-200 group-hover:scale-105 ${
                    isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0b3c5d]' : ''
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-[#ae3115]' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] transition-colors cursor-pointer ${
                isActive ? 'text-[#0b3c5d]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`text-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
