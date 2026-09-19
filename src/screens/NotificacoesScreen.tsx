import React, { useState } from 'react';
import { ScreenId } from '../types';
import { PREDICTIVE_NOTIFICATIONS } from '../data/mockData';

interface NotificacoesScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const NotificacoesScreen: React.FC<NotificacoesScreenProps> = ({ onNavigate }) => {
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({
    weather: true,
    crowds: true,
    flights: true,
    bookings: true,
    coupons: true
  });
  const [simulatedToast, setSimulatedToast] = useState<string | null>(null);

  const toggleSwitch = (key: string) => {
    setActiveToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSimulateAlert = () => {
    setSimulatedToast(
      '🔔 Concierge IA: A fila do Mosteiro dos Jerónimos aumentou 20 min. Sugerimos antecipar sua saída em 15 minutos!'
    );
    setTimeout(() => {
      setSimulatedToast(null);
    }, 5000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f9fb] pt-20 pb-28">
      {/* Simulated Live Toast */}
      {simulatedToast && (
        <div className="fixed top-20 left-4 right-4 max-w-md mx-auto z-50 p-4 rounded-3xl bg-[#00263f] text-white shadow-2xl border border-white/20 flex items-start gap-3 animate-slide-down">
          <div className="w-9 h-9 rounded-full bg-[#ae3115] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <div className="flex-1 text-[13px] leading-snug">
            {simulatedToast}
          </div>
          <button
            onClick={() => setSimulatedToast(null)}
            className="text-[#a3cbf2] hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-4">
        {/* Header Title */}
        <section className="flex flex-col gap-1 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cee5ff] text-[#001d32] self-start">
            <span className="material-symbols-outlined text-[16px] text-[#ae3115]">
              radar
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Monitoramento Ativo
            </span>
          </div>
          <h1 className="text-[26px] font-bold text-[#00263f] tracking-tight">
            Notificações & Lembretes
          </h1>
          <p className="text-[13px] text-[#42474e]">
            O Concierge Preditivo avisa sobre voos, clima e filas em tempo real.
          </p>
        </section>

        {/* Hero Push Preview Card */}
        <div className="bg-gradient-to-br from-[#0b3c5d] via-[#00263f] to-[#00263f] text-white rounded-3xl p-4 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fd6a49] animate-ping"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#cee5ff]">
                Lembrete de Pré-Embarque
              </span>
            </div>
            <span className="text-[11px] text-[#a3cbf2]">Há 10 min</span>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-white leading-snug">
              ✈️ Sua viagem a Lisboa começa em 2 dias!
            </h2>
            <p className="text-[12px] text-[#e0e3e5] mt-1 leading-relaxed">
              Previsão de 22°C com tempo ensolarado no desembarque. Não esqueça do adaptador europeu tipo C/F e do comprovante do voucher do Mosteiro.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onNavigate('roteiro')}
              className="flex-1 py-2 rounded-full bg-[#fd6a49] text-[#640f00] text-[12px] font-bold active:scale-95 transition-transform"
            >
              Abrir Roteiro
            </button>
            <button
              onClick={handleSimulateAlert}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-[12px] font-bold active:scale-95 transition-transform"
            >
              Testar Alerta
            </button>
          </div>
        </div>

        {/* Feed of Alerts */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-[#00263f] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#ae3115]">
              schedule
            </span>
            Alertas Preditivos
          </h2>

          <div className="flex flex-col gap-2.5">
            {PREDICTIVE_NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#ae3115] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                    {item.time}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#42474e] font-semibold">
                    Concierge IA
                  </span>
                </div>

                <h3 className="text-[15px] font-bold text-[#191c1e]">{item.title}</h3>
                <p className="text-[12px] text-[#42474e] leading-relaxed">
                  {item.description}
                </p>

                {item.actionText && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        if (item.actionScreen) {
                          onNavigate(item.actionScreen);
                        } else {
                          onNavigate('roteiro');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#00263f] text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <span>{item.actionText}</span>
                      <span className="material-symbols-outlined text-[14px]">
                        chevron_right
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings Toggles */}
        <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#00263f]">Preferências de Alertas</h2>
            <span className="text-[11px] text-[#ae3115] font-bold">Personalizado</span>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            {[
              {
                id: 'weather',
                title: 'Alertas meteorológicos em tempo real',
                desc: 'Avisos de chuva, vento no rio e mudanças súbitas de temperatura.'
              },
              {
                id: 'crowds',
                title: 'Sugestões preditivas de filas',
                desc: 'Ajuste de horário sugerido quando a fila ultrapassar 25 minutos.'
              },
              {
                id: 'flights',
                title: 'Mudanças de voo & portão de embarque',
                desc: 'Notificações antecipadas da companhia aérea sincronizada.'
              },
              {
                id: 'bookings',
                title: 'Lembretes de reservas de restaurantes',
                desc: 'Aviso 45 minutos antes com rota a pé calculada.'
              },
              {
                id: 'coupons',
                title: 'Dicas de economia e cupons de atração',
                desc: 'Avisos quando estiver próximo de monumentos gratuitos ou com desconto.'
              }
            ].map((toggle) => (
              <div
                key={toggle.id}
                onClick={() => toggleSwitch(toggle.id)}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#f2f4f6] cursor-pointer transition-colors"
              >
                <div className="flex flex-col pr-3">
                  <span className="text-[13px] font-bold text-[#191c1e]">{toggle.title}</span>
                  <span className="text-[11px] text-[#72777e]">{toggle.desc}</span>
                </div>

                <div
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    activeToggles[toggle.id] ? 'bg-[#ae3115]' : 'bg-[#c2c7ce]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      activeToggles[toggle.id] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
