import React, { useState } from 'react';
import { ScreenId } from '../types';
import { APP_ASSETS, INITIAL_CHECKLIST, SAVED_TRIPS } from '../data/mockData';

interface SalvosCompartilharScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SalvosCompartilharScreen: React.FC<SalvosCompartilharScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'shared' | 'saved'>('shared');
  const [defaultPermission, setDefaultPermission] = useState<'view' | 'edit'>('edit');
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [toastMessage, setToastMessage] = useState<{ text: string; icon: string } | null>(null);

  const showToast = (text: string, icon = 'check_circle') => {
    setToastMessage({ text, icon });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
    showToast('Item atualizado na bagagem!');
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f9fb] pt-20 pb-28">
      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#2d3133] text-[#eff1f3] shadow-xl flex items-center gap-2 text-[13px] font-semibold animate-fade-in pointer-events-none">
          <span className="material-symbols-outlined text-[18px] text-[#fd6a49]">
            {toastMessage.icon}
          </span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-4">
        {/* Segment Switcher Header */}
        <div className="pt-1">
          <div className="flex items-center p-1 rounded-full bg-[#e6e8ea] border border-[#eceef0]">
            <button
              onClick={() => setActiveTab('shared')}
              className={`flex-1 py-2 rounded-full text-[13px] font-bold transition-all duration-200 text-center ${
                activeTab === 'shared'
                  ? 'text-white bg-[#00263f] shadow-sm'
                  : 'text-[#42474e] hover:text-[#191c1e]'
              }`}
            >
              Viagem Compartilhada
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 rounded-full text-[13px] font-bold transition-all duration-200 text-center ${
                activeTab === 'saved'
                  ? 'text-white bg-[#00263f] shadow-sm'
                  : 'text-[#42474e] hover:text-[#191c1e]'
              }`}
            >
              Salvos (3)
            </button>
          </div>
        </div>

        {/* View 1: Shared Live Trip */}
        {activeTab === 'shared' && (
          <div className="flex flex-col gap-4">
            {/* Hero Card */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-sm bg-white border border-[#eceef0]">
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={APP_ASSETS.eurotripHero}
                  alt="Eurotrip Lisboa & Porto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00263f] via-[#00263f]/40 to-transparent"></div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-[#00263f] uppercase tracking-wider">
                    Ao Vivo
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex flex-col">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fd6a49]/90 text-white w-fit mb-1 shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">groups</span>
                    <span className="text-[10px] font-bold">Colaborativo (3 participantes)</span>
                  </div>
                  <h2 className="text-[20px] text-white font-bold tracking-tight drop-shadow-sm">
                    Eurotrip: Lisboa & Porto 🇵🇹
                  </h2>
                  <p className="text-[12px] text-white/80">14 Out - 22 Out • 8 dias de descobertas</p>
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ae3115] text-[22px]">
                    diversity_3
                  </span>
                  <h3 className="text-[17px] font-bold text-[#00263f]">Membros da Viagem</h3>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#e6e8ea] text-[#42474e] font-bold">
                  3 ativos
                </span>
              </div>

              {/* Members Rows */}
              <div className="flex flex-col gap-2 pt-1">
                {/* Mariana */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f2f4f6]">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        className="w-10 h-10 rounded-full object-cover border border-white"
                        src={APP_ASSETS.memberMariana}
                        alt="Mariana"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00263f] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                        ★
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#191c1e]">Mariana</span>
                      <span className="text-[11px] text-[#ae3115] font-semibold">
                        Criadora / Você
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#cee5ff] text-[#001d32]">
                    Admin Total
                  </span>
                </div>

                {/* Lucas S. */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f2f4f6]">
                  <div className="flex items-center gap-2.5">
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-white"
                      src={APP_ASSETS.memberLucas}
                      alt="Lucas S."
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#191c1e]">Lucas S.</span>
                      <span className="text-[11px] text-[#72777e]">Conectado há 12 min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e0e3e5] text-[#191c1e]">
                    <span className="material-symbols-outlined text-[14px] text-[#00263f]">
                      edit
                    </span>
                    <span className="text-[11px] font-bold">Pode editar</span>
                  </div>
                </div>

                {/* Beatriz M. */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f2f4f6]">
                  <div className="flex items-center gap-2.5">
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-white"
                      src={APP_ASSETS.memberBeatriz}
                      alt="Beatriz M."
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#191c1e]">Beatriz M.</span>
                      <span className="text-[11px] text-[#72777e]">Acesso compartilhado</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eceef0] text-[#42474e]">
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    <span className="text-[11px] font-bold">Visualizador</span>
                  </div>
                </div>
              </div>

              {/* Invite Control Box */}
              <div className="pt-2">
                <div className="p-3.5 rounded-2xl bg-[#eceef0] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#191c1e] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#00263f]">
                        lock_open
                      </span>
                      Nível padrão para novos links
                    </span>

                    {/* Permission segmented switch */}
                    <div className="flex p-0.5 rounded-full bg-[#e0e3e5]">
                      <button
                        onClick={() => {
                          setDefaultPermission('view');
                          showToast('Permissão alterada para "Apenas ver"', 'visibility');
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                          defaultPermission === 'view'
                            ? 'bg-[#00263f] text-white'
                            : 'text-[#42474e]'
                        }`}
                      >
                        Apenas ver
                      </button>
                      <button
                        onClick={() => {
                          setDefaultPermission('edit');
                          showToast('Permissão alterada para "Pode editar"', 'edit');
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                          defaultPermission === 'edit'
                            ? 'bg-[#00263f] text-white'
                            : 'text-[#42474e]'
                        }`}
                      >
                        Pode editar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => showToast('Link de convite copiado!', 'link')}
                      className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-full bg-[#0b3c5d] text-white text-[12px] font-bold active:scale-95 transition-transform shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">link</span>
                      <span>Copiar Convite</span>
                    </button>
                    <button
                      onClick={() => showToast('Abrindo WhatsApp com convite...', 'share')}
                      className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-full bg-[#ae3115] text-white text-[12px] font-bold active:scale-95 transition-transform shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                      <span>Via WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Export & Sync Section */}
            <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00263f] text-[22px]">
                  cloud_sync
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-[#00263f]">Exportar & Sincronizar</h3>
                  <p className="text-[11px] text-[#42474e]">
                    Acesse tudo no avião ou adicione à sua rotina
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                {/* PDF Offline */}
                <button
                  onClick={() => showToast('Gerando PDF offline da Eurotrip...', 'download')}
                  className="flex items-center justify-between w-full p-3 rounded-2xl bg-[#f2f4f6] hover:bg-[#e6e8ea] transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#cee5ff] flex items-center justify-center text-[#00263f] shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        picture_as_pdf
                      </span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] font-bold text-[#191c1e]">
                        Baixar Roteiro em PDF Offline
                      </span>
                      <span className="text-[11px] text-[#42474e]">
                        Mapas, reservas e contatos de emergência
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#00263f] text-[20px]">
                    download
                  </span>
                </button>

                {/* Calendar Sync */}
                <button
                  onClick={() =>
                    showToast('8 eventos enviados para sua Agenda!', 'event_available')
                  }
                  className="flex items-center justify-between w-full p-3 rounded-2xl bg-[#f2f4f6] hover:bg-[#e6e8ea] transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffdad2] flex items-center justify-center text-[#ae3115] shrink-0">
                      <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] font-bold text-[#191c1e]">
                        Sincronizar com Calendário
                      </span>
                      <span className="text-[11px] text-[#42474e]">
                        Google Agenda & Apple Calendar (.ics)
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#ae3115] text-[20px]">
                    sync
                  </span>
                </button>

                {/* Interactive Link */}
                <button
                  onClick={() => showToast('Link web interativo copiado!', 'content_copy')}
                  className="flex items-center justify-between w-full p-3 rounded-2xl bg-[#f2f4f6] hover:bg-[#e6e8ea] transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#191c1e] shrink-0">
                      <span className="material-symbols-outlined text-[20px]">devices</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[13px] font-bold text-[#191c1e]">
                        Copiar Link Interativo
                      </span>
                      <span className="text-[11px] text-[#42474e]">
                        Visualização web em tempo real
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#191c1e] text-[20px]">
                    content_copy
                  </span>
                </button>
              </div>
            </div>

            {/* Smart Checklist */}
            <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00263f] to-[#ae3115] flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#00263f]">Checklist Inteligente</h3>
                    <span className="text-[11px] text-[#42474e]">
                      Baseado em Lisboa a 22°C (Ventos costeiros)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eceef0] text-[#00263f]">
                  <span className="material-symbols-outlined text-[16px] text-[#ae3115]">
                    wb_sunny
                  </span>
                  <span className="text-[11px] font-bold">22°C</span>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="flex flex-col gap-2 pt-1">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f2f4f6] cursor-pointer hover:bg-[#e6e8ea] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                          item.checked
                            ? 'bg-[#00263f] text-white'
                            : 'border-2 border-[#c2c7ce] bg-white text-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className={`text-[13px] font-bold truncate ${
                            item.checked
                              ? 'line-through text-[#72777e]'
                              : 'text-[#191c1e]'
                          }`}
                        >
                          {item.text}
                        </span>
                        <span className="text-[11px] text-[#72777e]">{item.category}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.checked
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#ffdad2] text-[#3d0600]'
                      }`}
                    >
                      {item.checked ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View 2: Saved Past Itineraries */}
        {activeTab === 'saved' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className="text-[18px] font-bold text-[#00263f]">Roteiros Guardados</h3>
                <p className="text-[12px] text-[#42474e]">
                  Reviva ou duplique para futuras viagens
                </p>
              </div>
              <button
                onClick={() => showToast('Nova pasta criada!', 'create_new_folder')}
                className="p-2 rounded-full bg-[#e6e8ea] text-[#00263f] hover:bg-[#e0e3e5] transition-colors"
                title="Criar nova pasta"
              >
                <span className="material-symbols-outlined text-[20px]">
                  create_new_folder
                </span>
              </button>
            </div>

            {SAVED_TRIPS.map((trip) => (
              <div
                key={trip.id}
                className="p-4 rounded-3xl bg-white shadow-sm border border-[#eceef0] flex flex-col gap-3"
              >
                <div className="flex gap-3">
                  <div
                    className="w-24 h-24 rounded-2xl bg-cover bg-center shrink-0 shadow-xs border border-[#eceef0]"
                    style={{ backgroundImage: `url('${trip.imageUrl}')` }}
                  ></div>
                  <div className="flex flex-col justify-between py-0.5 min-w-0">
                    <div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eceef0] text-[#42474e] mb-1">
                        <span className="material-symbols-outlined text-[12px]">
                          calendar_today
                        </span>
                        <span className="text-[10px] font-bold">{trip.dates}</span>
                      </div>
                      <h4 className="text-[16px] font-bold text-[#00263f] truncate">
                        {trip.title}
                      </h4>
                      <p className="text-[12px] text-[#42474e]">
                        {trip.daysCount} dias • {trip.budgetEst}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#ae3115] font-bold">{trip.badge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-[#f2f4f6]">
                  <button
                    onClick={() => showToast('Roteiro duplicado com sucesso!', 'content_copy')}
                    className="flex-1 h-9 rounded-full bg-[#0b3c5d] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                    <span>Duplicar Roteiro</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('Reativando IA para atualizar este roteiro...', 'auto_awesome');
                      setTimeout(() => onNavigate('roteiro'), 800);
                    }}
                    className="h-9 px-3 rounded-full bg-[#eceef0] text-[#00263f] text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-[#e6e8ea] active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                    <span>Reativar IA</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
