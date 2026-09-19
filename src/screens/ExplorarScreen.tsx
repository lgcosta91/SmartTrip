import React, { useState } from 'react';
import { ScreenId } from '../types';
import { INSPIRATIONS, APP_ASSETS } from '../data/mockData';

interface ExplorarScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectDestination?: (dest: string) => void;
}

export const ExplorarScreen: React.FC<ExplorarScreenProps> = ({
  onNavigate,
  onSelectDestination
}) => {
  const [activeStyle, setActiveStyle] = useState<string>('Natureza & Trilhas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'insp-1': true,
    'insp-2': false,
    'insp-3': false
  });

  const searchSuggestions = [
    'Final de semana relaxante na serra até R$ 1.500',
    'Roteiro gastronômico de 3 dias em Santiago',
    'Praias desertas no litoral norte de SP',
    'Viagem romântica para Gramado com fondue'
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const travelStyles = [
    { label: '🌿 Natureza & Trilhas', id: 'Natureza & Trilhas' },
    { label: '🍷 Gastronomia', id: 'Gastronomia' },
    { label: '🏛️ História & Cultura', id: 'História & Cultura' },
    { label: '🏖️ Praias Secretas', id: 'Praias Secretas' },
    { label: '⚡ Bate e Volta', id: 'Bate e Volta' }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f9fb] pt-20 pb-28">
      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-5">
        {/* Greeting & AI Pill */}
        <section className="flex flex-col gap-2 pt-1">
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#e0e3e5]/60 text-[#00263f]">
            <span className="material-symbols-outlined text-[16px] text-[#ae3115] fill-1">
              auto_awesome
            </span>
            <span className="text-[11px] font-bold text-[#00263f] uppercase tracking-wider">
              Smart Concierge Ativo
            </span>
          </div>

          <h1 className="text-[28px] font-extrabold text-[#00263f] tracking-tight leading-tight">
            Olá, Mariana ✨
          </h1>
          <p className="text-[14px] text-[#42474e]">
            Onde será sua próxima aventura inesquecível?
          </p>
        </section>

        {/* Natural AI Search Bar */}
        <section className="relative w-full">
          <div className="w-full bg-white rounded-full shadow-[0_4px_24px_rgba(11,60,93,0.06)] border border-[#eceef0] p-1.5 flex items-center gap-2 focus-within:shadow-[0_4px_28px_rgba(174,49,21,0.15)] focus-within:border-[#fd6a49]/40 transition-all">
            <div className="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#0b3c5d] shrink-0">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: 'Final de semana relaxante na serra até R$ 1.500'"
              className="w-full bg-transparent text-[14px] text-[#191c1e] placeholder:text-[#72777e] focus:outline-none pr-1 truncate"
            />
            <button
              onClick={() => {
                const randomSug =
                  searchSuggestions[Math.floor(Math.random() * searchSuggestions.length)];
                setSearchQuery(randomSug);
              }}
              title="Preencher sugestão inteligente"
              className="w-9 h-9 rounded-full hover:bg-[#eceef0] flex items-center justify-center text-[#0b3c5d] shrink-0 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            <button
              onClick={() => onNavigate('criar-com-ia')}
              title="Filtros avançados do roteiro"
              className="w-9 h-9 rounded-full bg-[#00263f] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </section>

        {/* Travel Style Horizontal Chips */}
        <section className="flex flex-col gap-2 -mx-4">
          <div className="flex items-center justify-between px-4">
            <span className="text-[12px] font-bold text-[#42474e] uppercase tracking-wider">
              Estilo de Viagem
            </span>
            <span className="text-[11px] text-[#ae3115] font-bold">Personalizado</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto px-4 no-scrollbar py-1">
            {travelStyles.map((style) => {
              const isSelected = activeStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#00263f] text-white shadow-sm'
                      : 'bg-white text-[#42474e] shadow-[0_2px_10px_rgba(11,60,93,0.04)] border border-[#eceef0] hover:bg-[#f2f4f6]'
                  }`}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Active Trip Spotlight Card */}
        <section>
          <div className="relative w-full rounded-3xl bg-white shadow-[0_8px_28px_rgba(11,60,93,0.07)] border border-[#eceef0] overflow-hidden flex flex-col">
            {/* Media Header with Gradient */}
            <div className="relative h-44 w-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={APP_ASSETS.rioDeJaneiro}
                alt="Rio de Janeiro"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00263f] via-[#00263f]/40 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] text-[#00263f] font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#ae3115] animate-pulse"></span>
                  VIAGEM EM ANDAMENTO
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00263f]/80 backdrop-blur-md text-[11px] text-white">
                  <span className="material-symbols-outlined text-[14px]">wb_sunny</span>
                  27°C Ensolarado
                </span>
              </div>

              {/* Title on Photo */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-col text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-bold tracking-tight text-white">
                    Rio de Janeiro, RJ
                  </h2>
                  <span className="text-[12px] text-[#ffdad2] font-semibold">
                    4 dias restantes
                  </span>
                </div>
                <p className="text-[12px] text-[#a3cbf2]">
                  Hospedagem em Ipanema • Próxima atração em 45 min
                </p>
              </div>
            </div>

            {/* Card Content & Progress */}
            <div className="p-4 flex flex-col gap-3.5 bg-white">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] text-[#42474e]">
                  <span className="font-bold text-[#00263f]">Progresso da Rota</span>
                  <span className="font-bold text-[#ae3115]">Dia 2 de 4</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e6e8ea] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#ae3115] transition-all duration-700"
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </div>

              {/* Next Activity Preview */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2f4f6]">
                <div className="w-9 h-9 rounded-full bg-[#ffdad2] flex items-center justify-center text-[#3d0600] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">restaurant</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] text-[#72777e] uppercase font-bold">
                    A Seguir • 13:30
                  </span>
                  <span className="text-[13px] font-bold text-[#191c1e] truncate">
                    Almoço no Confeitaria Colombo
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#72777e] text-[20px]">
                  navigate_next
                </span>
              </div>

              {/* Action CTA */}
              <button
                onClick={() => onNavigate('roteiro')}
                className="w-full py-3 px-6 rounded-full bg-[#ae3115] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(174,49,21,0.22)] hover:bg-[#fd6a49] active:scale-[0.98] transition-all"
              >
                <span>Ver Roteiro de Hoje</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* AI Inspiration Engine Section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ae3115] text-[18px] fill-1">
                  auto_awesome
                </span>
                <h2 className="text-[18px] font-bold text-[#00263f] tracking-tight">
                  Inspirações com IA
                </h2>
              </div>
              <p className="text-[12px] text-[#42474e]">
                Curadas pelo seu perfil aventureiro & gastronômico
              </p>
            </div>
            <button
              onClick={() => onNavigate('criar-com-ia')}
              className="px-3 py-1 rounded-full bg-[#e6e8ea] text-[#00263f] text-[11px] font-bold active:scale-95 transition-transform"
            >
              Ver Todas
            </button>
          </div>

          {/* Cards Vertical Feed */}
          <div className="flex flex-col gap-4">
            {INSPIRATIONS.map((insp) => (
              <div
                key={insp.id}
                className="w-full rounded-3xl bg-white shadow-[0_6px_22px_rgba(11,60,93,0.05)] border border-[#eceef0] overflow-hidden flex flex-col group transition-all hover:shadow-md"
              >
                {/* Visual Header */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={insp.imageUrl}
                    alt={insp.destination}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00263f]/90 via-[#00263f]/25 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-[#00263f]/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#c0c1ff]">
                        {insp.icon}
                      </span>
                      {insp.tagPrimary}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#00263f] text-[11px] font-bold">
                      {insp.tagSecondary}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(insp.id, e)}
                    aria-label={`Favoritar ${insp.destination}`}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        favorites[insp.id] ? 'text-[#ae3115] fill-1' : 'text-[#42474e]'
                      }`}
                    >
                      favorite
                    </span>
                  </button>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[19px] font-bold text-white leading-tight">
                        {insp.destination}
                      </h3>
                      <span className="text-[11px] text-[#cee5ff] font-medium">
                        {insp.season}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#a3cbf2] mt-0.5">{insp.description}</p>
                  </div>
                </div>

                {/* Lower Bento Info */}
                <div className="p-4 flex flex-col gap-3 bg-white">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#f2f4f6] flex flex-col">
                      <span className="text-[11px] text-[#72777e]">Estimativa Diária</span>
                      <span className="text-[13px] text-[#00263f] font-bold">
                        {insp.dailyBudget}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#f2f4f6] flex flex-col">
                      <span className="text-[11px] text-[#72777e]">Clima Médio</span>
                      <span className="text-[13px] text-[#00263f] font-bold">
                        {insp.weather}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#f2f4f6]">
                    <div className="flex items-center gap-1.5 text-[#42474e] text-[12px]">
                      <span className="material-symbols-outlined text-[16px] text-[#ae3115]">
                        flight_takeoff
                      </span>
                      <span>{insp.footerInfo}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (insp.id === 'insp-3') {
                          onNavigate('roteiro');
                        } else {
                          onNavigate('criar-com-ia');
                        }
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#00263f] text-white text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-transform shadow-xs"
                    >
                      <span>Explorar</span>
                      <span className="material-symbols-outlined text-[14px]">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Quick Plan with AI Banner */}
        <section className="sticky bottom-20 z-30 pt-1">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0b3c5d] via-[#00263f] to-[#00263f] text-white shadow-[0_12px_32px_rgba(11,60,93,0.28)] flex items-center justify-between gap-3 border border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-[#ae3115] flex items-center justify-center text-white shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold truncate">Planejar com IA</span>
                <span className="text-[12px] text-[#a3cbf2] truncate">
                  Roteiro completo em 10 segundos
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('criar-com-ia')}
              className="px-4 py-2.5 rounded-full bg-[#fd6a49] text-[#640f00] text-[12px] font-extrabold shrink-0 shadow-md active:scale-95 transition-transform flex items-center gap-1"
            >
              <span>Começar</span>
              <span className="material-symbols-outlined text-[16px]">bolt</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
