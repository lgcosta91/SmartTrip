import React, { useState } from 'react';
import { ScreenId } from '../types';

interface CriarComIaScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CriarComIaScreen: React.FC<CriarComIaScreenProps> = ({ onNavigate }) => {
  const [budgetTier, setBudgetTier] = useState<'economic' | 'balanced' | 'luxury'>('balanced');
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'intense'>('moderate');
  const [destination, setDestination] = useState<string>('Lisboa & Porto, Portugal 🇵🇹');
  const [isEditingDest, setIsEditingDest] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Vinícolas & Gastronomia',
    'Monumentos & História',
    'Cafés Charmosos',
    'Caminhadas a pé'
  ]);

  const allInterests = [
    { label: 'Vinícolas & Gastronomia', icon: '🍷' },
    { label: 'Monumentos & História', icon: '🏰' },
    { label: 'Cafés Charmosos', icon: '☕' },
    { label: 'Caminhadas a pé', icon: '🚶' },
    { label: 'Feiras Locais', icon: '🛍️' },
    { label: 'Fado & Noite', icon: '🎶' },
    { label: 'Praias & Costa', icon: '🏖️' },
    { label: 'Miradouros & Fotos', icon: '📸' }
  ];

  const toggleInterest = (label: string) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onNavigate('roteiro');
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f9fb] pt-20 pb-28">
      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-5">
        {/* Header & Stepper */}
        <section className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0b3c5d]/10 text-[#00263f]">
              <span className="material-symbols-outlined text-[#00263f] text-[14px]">
                auto_awesome
              </span>
              <span className="text-[11px] font-bold text-[#00263f] uppercase tracking-wider">
                Assistente Inteligente
              </span>
            </div>
            <span className="text-[12px] font-bold text-[#42474e]">Passo 2 de 3</span>
          </div>

          {/* Stepper bar */}
          <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#fd6a49] rounded-full w-2/3 transition-all duration-500"></div>
          </div>

          <div className="pt-1">
            <h1 className="text-[26px] font-bold text-[#00263f] tracking-tight leading-tight">
              Monte seu Roteiro Perfeito com IA
            </h1>
            <p className="text-[13px] text-[#42474e] mt-0.5">
              Personalizado para seu tempo, bolso e estilo de viajar.
            </p>
          </div>
        </section>

        {/* Destino Principal */}
        <section className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[#00263f] flex items-center gap-1">
            <span className="material-symbols-outlined text-[#ae3115] text-[18px]">
              near_me
            </span>
            Destino Principal
          </label>
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#eceef0] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#00263f]/5 flex items-center justify-center text-[#00263f] shrink-0">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </div>
              <div className="min-w-0 flex-1">
                {isEditingDest ? (
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onBlur={() => setIsEditingDest(false)}
                    autoFocus
                    className="text-[15px] font-bold text-[#191c1e] w-full border-b border-[#ae3115] outline-none"
                  />
                ) : (
                  <div className="text-[15px] font-bold text-[#191c1e] truncate">
                    {destination}
                  </div>
                )}
                <div className="text-[12px] text-[#42474e]">
                  2 paradas estratégicas selecionadas
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditingDest(!isEditingDest)}
              aria-label="Editar destino"
              className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#42474e] hover:text-[#00263f] transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
        </section>

        {/* Datas & Duração com Previsão */}
        <section className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[#00263f] flex items-center gap-1">
            <span className="material-symbols-outlined text-[#ae3115] text-[18px]">
              calendar_today
            </span>
            Datas & Duração
          </label>
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#eceef0] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdad2]/50 flex items-center justify-center text-[#ae3115] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">date_range</span>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#191c1e]">12 Out - 19 Out</div>
                  <div className="text-[12px] text-[#42474e]">7 dias de estadia</div>
                </div>
              </div>
              <button
                aria-label="Alterar datas"
                className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#42474e] hover:text-[#00263f] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>

            {/* Weather Micro Insight */}
            <div className="flex items-center gap-2 bg-[#f2f4f6] px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[#ae3115] text-[16px]">
                wb_sunny
              </span>
              <span className="text-[12px] text-[#42474e] font-medium">
                Outono com clima ameno e pouca chuva 🌤️
              </span>
            </div>
          </div>
        </section>

        {/* Faixa de Orçamento */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-bold text-[#00263f] flex items-center gap-1">
              <span className="material-symbols-outlined text-[#ae3115] text-[18px]">
                payments
              </span>
              Faixa de Orçamento
            </label>
            <span className="text-[11px] text-[#42474e]">Médio por pessoa</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {/* Econômico */}
            <div
              onClick={() => setBudgetTier('economic')}
              className={`cursor-pointer rounded-2xl p-3.5 flex items-center justify-between transition-all border ${
                budgetTier === 'economic'
                  ? 'bg-[#ffdad2]/20 border-[#fd6a49] shadow-md'
                  : 'bg-white border-[#eceef0] shadow-sm hover:border-[#a3cbf2]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#00263f] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">hiking</span>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#191c1e]">
                    Econômico (Backpacker)
                  </div>
                  <div className="text-[12px] text-[#42474e]">
                    Hostels selecionados, transporte público
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[15px] font-bold text-[#00263f]">~R$ 350</div>
                <div className="text-[10px] text-[#72777e]">/dia</div>
              </div>
            </div>

            {/* Equilibrado (Selected) */}
            <div
              onClick={() => setBudgetTier('balanced')}
              className={`cursor-pointer rounded-2xl p-3.5 flex items-center justify-between transition-all relative overflow-hidden border ${
                budgetTier === 'balanced'
                  ? 'bg-[#ffdad2]/30 border-[#fd6a49] shadow-md'
                  : 'bg-white border-[#eceef0] shadow-sm hover:border-[#a3cbf2]'
              }`}
            >
              {budgetTier === 'balanced' && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#fd6a49]"></div>
              )}
              <div className="flex items-center gap-3 pl-1">
                <div className="w-10 h-10 rounded-full bg-[#fd6a49] text-white flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[20px] fill-1">hotel</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-[#00263f]">
                      Equilibrado (Conforto)
                    </span>
                    {budgetTier === 'balanced' && (
                      <span className="material-symbols-outlined text-[#ae3115] text-[16px] fill-1">
                        check_circle
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[#42474e]">
                    Hotéis boutique, gastronomia local e táxis
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[15px] font-bold text-[#ae3115]">~R$ 750</div>
                <div className="text-[10px] text-[#72777e]">/dia</div>
              </div>
            </div>

            {/* Luxo */}
            <div
              onClick={() => setBudgetTier('luxury')}
              className={`cursor-pointer rounded-2xl p-3.5 flex items-center justify-between transition-all border ${
                budgetTier === 'luxury'
                  ? 'bg-[#ffdad2]/20 border-[#fd6a49] shadow-md'
                  : 'bg-white border-[#eceef0] shadow-sm hover:border-[#a3cbf2]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#00263f] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">diamond</span>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#191c1e]">Luxo & Exclusivo</div>
                  <div className="text-[12px] text-[#42474e]">
                    Hotéis 5 estrelas, chefs e motorista privativo
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[15px] font-bold text-[#00263f]">~R$ 1.600+</div>
                <div className="text-[10px] text-[#72777e]">/dia</div>
              </div>
            </div>
          </div>
        </section>

        {/* Ritmo de Viagem */}
        <section className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[#00263f] flex items-center gap-1">
            <span className="material-symbols-outlined text-[#ae3115] text-[18px]">speed</span>
            Ritmo de Viagem
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'relaxed', label: 'Relaxado', sub: 'Sem pressa', icon: 'spa' },
              { id: 'moderate', label: 'Moderado', sub: 'Recomendado', icon: 'directions_walk' },
              { id: 'intense', label: 'Explorador', sub: 'Intenso', icon: 'bolt' }
            ].map((p) => {
              const isActive = pace === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPace(p.id as any)}
                  className={`py-3 px-2 rounded-2xl flex flex-col items-center text-center transition-all border ${
                    isActive
                      ? 'bg-[#0b3c5d] text-white border-[#0b3c5d] shadow-md'
                      : 'bg-white text-[#191c1e] border-[#eceef0] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] mb-1 ${
                      isActive ? 'text-[#ffdad2]' : 'text-[#42474e]'
                    }`}
                  >
                    {p.icon}
                  </span>
                  <span className="text-[13px] font-bold leading-tight">{p.label}</span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      isActive ? 'text-[#a3cbf2]' : 'text-[#72777e]'
                    }`}
                  >
                    {p.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Interesses & Experiências */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-bold text-[#00263f] flex items-center gap-1">
              <span className="material-symbols-outlined text-[#ae3115] text-[18px]">
                interests
              </span>
              Interesses & Experiências
            </label>
            <span className="text-[11px] text-[#ae3115] font-bold">
              {selectedInterests.length} selecionados
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.label);
              return (
                <button
                  key={interest.label}
                  onClick={() => toggleInterest(interest.label)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all border active:scale-95 ${
                    isSelected
                      ? 'bg-[#0b3c5d] text-white border-[#0b3c5d] shadow-xs'
                      : 'bg-white text-[#191c1e] border-[#eceef0] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <span>{interest.icon}</span>
                  <span>{interest.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[15px] ml-0.5">check</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* AI Smart Insight Card */}
        <section className="rounded-2xl p-4 bg-white border border-[#eceef0] shadow-[0_4px_24px_rgba(99,102,241,0.08)] relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#0b3c5d]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0b3c5d] to-[#ae3115] flex items-center justify-center text-white shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-[#00263f]">Dica do SmartTrip</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ae3115]"></span>
                <span className="text-[10px] text-[#ae3115] uppercase tracking-wider font-extrabold">
                  Economia Ativa
                </span>
              </div>
              <p className="text-[12px] text-[#42474e] leading-relaxed">
                Encontramos <strong>12 atrações com entrada gratuita</strong> nas terças-feiras
                durante seu período em Lisboa. O roteiro já está ajustando essa logística
                automaticamente.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Gerar Roteiro Personalizado */}
        <div className="pt-2 flex flex-col items-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-14 rounded-full bg-[#fd6a49] text-white text-[15px] font-bold shadow-[0_8px_24px_rgba(174,49,21,0.3)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">
                  refresh
                </span>
                <span>Sintetizando Roteiro Inteligente...</span>
              </>
            ) : (
              <>
                <span>Gerar Roteiro Personalizado</span>
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-[#72777e] mt-2">
            Geração em ~15 segundos com base em +400 curadorias locais
          </p>
        </div>
      </div>
    </div>
  );
};
