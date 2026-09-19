import React, { useState } from 'react';
import { ScreenId } from '../types';
import { LISBOA_DAYS } from '../data/mockData';

interface RoteiroScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectAttraction?: (attractionId: string) => void;
}

export const RoteiroScreen: React.FC<RoteiroScreenProps> = ({
  onNavigate,
  onSelectAttraction
}) => {
  const [selectedDayNum, setSelectedDayNum] = useState<number>(2);
  const [aiRefining, setAiRefining] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [refinementSuccess, setRefinementSuccess] = useState<string | null>(null);

  const currentDay = LISBOA_DAYS.find((d) => d.dayNumber === selectedDayNum) || LISBOA_DAYS[1];

  const handleApplyRefine = (promptText: string) => {
    setAiRefining(true);
    setTimeout(() => {
      setAiRefining(false);
      setShowAiModal(false);
      setRefinementSuccess(`Itinerário atualizado com foco em "${promptText}"!`);
      setTimeout(() => setRefinementSuccess(null), 4000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f9fb] pt-20 pb-28">
      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-4">
        {/* Top Summary & Metadata */}
        <section className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eceef0] text-[#42474e] text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#ae3115]">
                calendar_today
              </span>
              Outubro 2025
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#cee5ff] text-[#001d32] text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">savings</span>
              Orçamento Equilibrado
            </span>
          </div>

          <div>
            <h2 className="text-[26px] font-bold text-[#00263f] tracking-tight leading-tight">
              Lisboa Encantadora
            </h2>
            <p className="text-[13px] text-[#42474e] mt-0.5">
              7 Dias inesquecíveis • Programação Otimizada por IA
            </p>
          </div>
        </section>

        {/* Horizontal Days Slider */}
        <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 flex items-center gap-2 py-1">
          {LISBOA_DAYS.map((day) => {
            const isSelected = day.dayNumber === selectedDayNum;
            const isToday = day.dayNumber === 2;

            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNum(day.dayNumber)}
                className={`shrink-0 flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-[#00263f] text-white shadow-md shadow-[#00263f]/25 scale-105 relative'
                    : 'bg-[#f2f4f6] text-[#42474e] hover:bg-[#e6e8ea]'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected && isToday ? 'text-[#fd6a49]' : 'opacity-75'
                  }`}
                >
                  {isToday ? `${day.dateStr} • HOJE` : day.dateStr}
                </span>
                <span className="text-[13px] font-bold flex items-center gap-1">
                  Dia {day.dayNumber}
                  {isToday && isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ae3115] animate-ping"></span>
                  )}
                </span>
                <span
                  className={`text-[10px] truncate max-w-[80px] ${
                    isSelected ? 'text-[#e0e3e5]' : 'opacity-70'
                  }`}
                >
                  {day.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Refinement Success Toast */}
        {refinementSuccess && (
          <div className="p-3 rounded-2xl bg-[#00263f] text-white text-[13px] flex items-center gap-2 shadow-lg animate-fade-in">
            <span className="material-symbols-outlined text-[#fd6a49] text-[18px]">
              auto_awesome
            </span>
            <span className="flex-1">{refinementSuccess}</span>
            <button
              onClick={() => setRefinementSuccess(null)}
              className="text-[#e0e3e5] text-[12px] font-bold hover:underline"
            >
              OK
            </button>
          </div>
        )}

        {/* Smart Daily Weather Card */}
        <section>
          <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] relative overflow-hidden flex flex-col gap-2">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#ffdad2]/40 blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdad2] flex items-center justify-center text-[#ae3115] shrink-0">
                  <span className="material-symbols-outlined text-[24px]">sunny</span>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#00263f] leading-none">
                    {currentDay.weather.temp} • {currentDay.weather.condition}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#42474e] mt-1">
                    {currentDay.weekday}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#42474e] text-[11px] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">air</span> 9 km/h
              </span>
            </div>

            <div className="bg-[#f2f4f6] rounded-xl p-2.5 flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-[#ae3115] text-[18px] shrink-0">
                wb_twilight
              </span>
              <p className="text-[12px] text-[#191c1e] leading-snug">
                {currentDay.weather.sunAdvise ||
                  'Excelente para passeios ao ar livre e caminhadas ao longo da orla do Rio Tejo!'}
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00263f] text-[20px]">
                route
              </span>
              <h3 className="text-[18px] font-bold text-[#00263f]">Cronograma do Dia</h3>
            </div>
            <span className="text-[11px] text-[#ae3115] uppercase font-bold tracking-wider">
              {currentDay.activities.length} Atividades
            </span>
          </div>

          {/* Timeline Container */}
          <div className="relative pl-6 flex flex-col gap-4">
            {/* Continuous Vertical Line */}
            <div className="absolute left-2.5 top-3 bottom-4 w-0.5 bg-[#e0e3e5]"></div>

            {currentDay.activities.map((activity, index) => {
              const isJerónimos = activity.id === 'act-2';
              const dotColors = ['bg-[#ae3115]', 'bg-[#00263f]', 'bg-[#fd6a49]', 'bg-[#0b3c5d]'];
              const currentDotColor = dotColors[index % dotColors.length];

              return (
                <div key={activity.id} className="relative flex flex-col group">
                  {/* Waypoint Indicator */}
                  <div className="absolute -left-6 top-2 w-5 h-5 rounded-full bg-white border border-[#eceef0] flex items-center justify-center shadow-xs z-10">
                    <div className={`w-2.5 h-2.5 rounded-full ${currentDotColor}`}></div>
                  </div>

                  {/* Activity Card */}
                  <div
                    onClick={() => {
                      if (isJerónimos && onSelectAttraction) {
                        onSelectAttraction('mosteiro-dos-jeronimos');
                      }
                    }}
                    className={`bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-2.5 transition-all ${
                      isJerónimos
                        ? 'cursor-pointer hover:border-[#ae3115]/50 hover:shadow-md active:scale-[0.99]'
                        : ''
                    }`}
                  >
                    {/* Time & Duration */}
                    <div className="flex items-center justify-between text-[#42474e]">
                      <span className="text-[13px] font-bold text-[#00263f] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#ae3115]">
                          schedule
                        </span>
                        {activity.time}
                      </span>
                      <span className="text-[11px] bg-[#f2f4f6] px-2 py-0.5 rounded-full text-[#42474e] font-medium">
                        {activity.duration}
                      </span>
                    </div>

                    {/* Image & Title */}
                    <div className="flex gap-3">
                      <img
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#eceef0]"
                        src={activity.imageUrl}
                        alt={activity.title}
                        loading="lazy"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-[16px] font-bold text-[#191c1e] leading-snug truncate">
                            {activity.title}
                          </h4>
                          {isJerónimos && (
                            <span className="material-symbols-outlined text-[16px] text-[#ae3115] shrink-0">
                              open_in_new
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#42474e] mt-0.5 line-clamp-2 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>

                    {/* AI Highlight Tag if available */}
                    {activity.aiTip && (
                      <div className="bg-[#f2f4f6] rounded-xl p-2 flex items-center gap-2 text-[#00263f]">
                        <span className="material-symbols-outlined text-[17px] text-[#ae3115] shrink-0">
                          auto_awesome
                        </span>
                        <span className="text-[12px] font-semibold leading-tight">
                          {activity.aiTip}
                        </span>
                      </div>
                    )}

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#f2f4f6]">
                      <span className="text-[12px] text-[#42474e] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">payments</span>
                        {activity.priceText}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {activity.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              tag === 'UNESCO'
                                ? 'text-[#ae3115] bg-[#ffdad2]'
                                : 'text-[#0b3c5d] bg-[#cee5ff]/60'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Daily Finance Recap */}
        <section>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-[#00263f] shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  account_balance_wallet
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[18px] font-bold text-[#00263f]">€46</span>
                  <span className="text-[12px] text-[#42474e]">/ €60 meta</span>
                </div>
                <p className="text-[12px] text-[#42474e]">Estimado para o dia de hoje</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#f2f4f6] text-[#00263f] flex items-center gap-1 text-[11px] font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#ae3115]">
                trending_down
              </span>
              -€14 poupados
            </div>
          </div>
        </section>

        {/* AI Refine Quick Action Bar */}
        <section className="bg-gradient-to-r from-[#0b3c5d] to-[#00263f] text-white rounded-2xl p-4 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ae3115] flex items-center justify-center text-white shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[19px]">auto_awesome</span>
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-white">Refinar com IA</h4>
                <p className="text-[12px] text-[#e0e3e5] opacity-90">
                  Ajuste seu itinerário instantaneamente
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAiModal(true)}
              disabled={aiRefining}
              className="px-4 py-1.5 rounded-full bg-[#fd6a49] text-[#640f00] text-[12px] font-bold hover:brightness-105 active:scale-95 transition-all"
            >
              {aiRefining ? 'Calculando...' : 'Adaptar'}
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {[
              { label: 'Se chover, museus', icon: 'rainy' },
              { label: 'Opção vegana', icon: 'restaurant' },
              { label: 'Ritmo leve', icon: 'directions_walk' },
              { label: 'Mais paradas fotográficas', icon: 'photo_camera' }
            ].map((pill) => (
              <button
                key={pill.label}
                onClick={() => {
                  setActiveFilter(pill.label);
                  handleApplyRefine(pill.label);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] backdrop-blur-sm transition-all flex items-center gap-1.5 ${
                  activeFilter === pill.label
                    ? 'bg-white text-[#00263f] font-bold'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{pill.icon}</span>
                {pill.label}
              </button>
            ))}
          </div>
        </section>

        {/* Modal for Custom AI Refinement */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-5 shadow-2xl flex flex-col gap-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ae3115] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </div>
                  <h3 className="font-bold text-[18px] text-[#00263f]">
                    Como gostaria de adaptar o dia?
                  </h3>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#42474e]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="text-[13px] text-[#42474e]">
                Exemplo: "Trocar almoço por piquenique no parque", "Terminar mais cedo para assistir ao pôr do sol", "Focar em arte urbana".
              </p>

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Descreva o que deseja alterar..."
                rows={3}
                className="w-full p-3 rounded-2xl bg-[#f2f4f6] text-[14px] border border-transparent focus:border-[#ae3115] focus:bg-white outline-none resize-none transition-all"
              />

              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 rounded-full text-[#42474e] font-semibold text-[13px]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleApplyRefine(customPrompt || 'Otimização inteligente')}
                  disabled={aiRefining}
                  className="px-5 py-2.5 rounded-full bg-[#ae3115] text-white font-bold text-[13px] shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>{aiRefining ? 'Processando...' : 'Aplicar Adaptação'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
