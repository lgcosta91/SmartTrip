import React, { useState } from 'react';
import { ScreenId } from '../types';
import { APP_ASSETS } from '../data/mockData';

interface PerfilScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PerfilScreen: React.FC<PerfilScreenProps> = ({ onNavigate }) => {
  const [conciergeAutoBook, setConciergeAutoBook] = useState<boolean>(true);
  const [fastTrackPrioritize, setFastTrackPrioritize] = useState<boolean>(true);
  const [activeCurrency, setActiveCurrency] = useState<'EUR' | 'BRL' | 'USD'>('EUR');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f9fb] pt-20 pb-28">
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#00263f] text-white shadow-xl text-[13px] font-semibold animate-fade-in pointer-events-none">
          {toastMsg}
        </div>
      )}

      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-4">
        {/* Profile Card Header */}
        <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col items-center text-center gap-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#0b3c5d] to-[#00263f]"></div>

          <div className="relative mt-4">
            <img
              src={APP_ASSETS.beatrizProfile}
              alt="Foto do Perfil"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#ae3115] text-white flex items-center justify-center text-[12px] shadow-xs">
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </span>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-[20px] font-extrabold text-[#00263f]">Beatriz Nogueira</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#ffdad2] text-[#ae3115] mt-1">
              <span className="material-symbols-outlined text-[13px] fill-1">verified</span>
              Viajante Explorer VIP
            </span>
            <p className="text-[12px] text-[#72777e] mt-1">
              São Paulo, Brasil 🇧🇷 • Membro desde 2023
            </p>
          </div>

          {/* Travel Stats */}
          <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-[#f2f4f6]">
            <div className="flex flex-col items-center p-2 rounded-2xl bg-[#f2f4f6]">
              <span className="text-[18px] font-black text-[#00263f]">14</span>
              <span className="text-[10px] font-bold text-[#72777e] uppercase">Países</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-2xl bg-[#f2f4f6]">
              <span className="text-[18px] font-black text-[#ae3115]">38</span>
              <span className="text-[10px] font-bold text-[#72777e] uppercase">Cidades</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-2xl bg-[#f2f4f6]">
              <span className="text-[18px] font-black text-[#00263f]">6</span>
              <span className="text-[10px] font-bold text-[#72777e] uppercase">Roteiros IA</span>
            </div>
          </div>
        </div>

        {/* Active Trip Spotlight */}
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ae3115]">
              Próxima Viagem Ativa
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Confirmada
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-[#00263f]">Lisboa & Porto 🇵🇹</h2>
              <p className="text-[12px] text-[#72777e]">12 a 20 de Outubro • 21°C Ensolarado</p>
            </div>
            <button
              onClick={() => onNavigate('roteiro')}
              className="px-4 py-2 rounded-full bg-[#00263f] text-white text-[12px] font-bold active:scale-95 transition-transform"
            >
              Abrir
            </button>
          </div>
        </div>

        {/* Concierge Memory & Personalization */}
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ae3115] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[17px]">psychology</span>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#00263f]">Memória do Concierge IA</h2>
              <p className="text-[11px] text-[#72777e]">
                Preferências aprendidas em viagens anteriores
              </p>
            </div>
          </div>

          {/* Interest Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'Cafés Históricos',
              'Caminhadas a pé',
              'Vinho Tinto',
              'Arte Barroca',
              'Hotéis Boutique',
              'Restaurantes com Vista'
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-[#f2f4f6] text-[#00263f] text-[11px] font-bold border border-[#eceef0]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#f2f4f6]">
            <div
              onClick={() => setConciergeAutoBook(!conciergeAutoBook)}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#f2f4f6] cursor-pointer"
            >
              <span className="text-[12px] font-semibold text-[#191c1e]">
                Sugerir gastronomia autêntica local
              </span>
              <div
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  conciergeAutoBook ? 'bg-[#ae3115]' : 'bg-[#c2c7ce]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    conciergeAutoBook ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </div>

            <div
              onClick={() => setFastTrackPrioritize(!fastTrackPrioritize)}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#f2f4f6] cursor-pointer"
            >
              <span className="text-[12px] font-semibold text-[#191c1e]">
                Priorizar ingressos sem fila (Fast Track)
              </span>
              <div
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  fastTrackPrioritize ? 'bg-[#ae3115]' : 'bg-[#c2c7ce]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    fastTrackPrioritize ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet & Digital Assets */}
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#00263f]">Carteira & Benefícios</h2>
            <span className="text-[12px] font-bold text-[#ae3115]">4.850 pts SmartTrip</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => onNavigate('checkout')}
              className="p-3 rounded-2xl bg-[#f2f4f6] flex flex-col cursor-pointer hover:bg-[#e6e8ea]"
            >
              <span className="material-symbols-outlined text-[#00263f] text-[20px] mb-1">
                confirmation_number
              </span>
              <span className="text-[13px] font-bold text-[#191c1e]">1 Voucher Ativo</span>
              <span className="text-[11px] text-[#72777e]">Mosteiro dos Jerónimos</span>
            </div>

            <div
              onClick={() => showToast('Seguro Viagem ativo com cobertura de €30.000')}
              className="p-3 rounded-2xl bg-[#f2f4f6] flex flex-col cursor-pointer hover:bg-[#e6e8ea]"
            >
              <span className="material-symbols-outlined text-emerald-600 text-[20px] mb-1">
                verified_user
              </span>
              <span className="text-[13px] font-bold text-[#191c1e]">Seguro Europa</span>
              <span className="text-[11px] text-[#72777e]">Apólice digital ativa</span>
            </div>
          </div>
        </div>

        {/* Account & Session Controls */}
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-2">
          {/* Currency selection */}
          <div className="flex items-center justify-between p-2 rounded-2xl">
            <span className="text-[13px] font-bold text-[#191c1e]">Moeda de Exibição</span>
            <div className="flex p-0.5 rounded-full bg-[#f2f4f6]">
              {(['EUR', 'BRL', 'USD'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setActiveCurrency(curr);
                    showToast(`Moeda alterada para ${curr}`);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    activeCurrency === curr
                      ? 'bg-[#00263f] text-white'
                      : 'text-[#42474e]'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('login')}
            className="w-full py-3 rounded-full bg-[#ffdad2]/50 text-[#ae3115] text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#ffdad2] active:scale-95 transition-all mt-1"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
