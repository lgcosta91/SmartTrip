import React, { useState } from 'react';
import { ScreenId } from '../types';
import { APP_ASSETS } from '../data/mockData';

interface AtraçaoDetalhesScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
}

export const AtraçaoDetalhesScreen: React.FC<AtraçaoDetalhesScreenProps> = ({
  onNavigate,
  onBack
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [inItinerary, setInItinerary] = useState<boolean>(true);
  const [activePhoto, setActivePhoto] = useState<string>(APP_ASSETS.mosteiroHeroDetail);
  const [activeReviewFilter, setActiveReviewFilter] = useState<string>('Todas (2.4k)');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f7f9fb] pb-32">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#00263f] text-white shadow-xl text-[13px] font-semibold flex items-center gap-2 animate-fade-in pointer-events-none">
          <span className="material-symbols-outlined text-[17px] text-[#fd6a49]">
            auto_awesome
          </span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-40 pt-safe">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#00263f] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Link da atração copiado!')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#00263f] active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button
              onClick={() => {
                setIsSaved(!isSaved);
                showToast(isSaved ? 'Removido dos favoritos' : 'Salvo nos favoritos!');
              }}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center active:scale-95 transition-transform"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isSaved ? 'text-[#ae3115] fill-1' : 'text-[#00263f]'
                }`}
              >
                favorite
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Photography & Gallery */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative h-80 w-full overflow-hidden">
          <img
            className="w-full h-full object-cover transition-all duration-300"
            src={activePhoto}
            alt="Mosteiro dos Jerónimos"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>

          {/* Badges on Photo */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#00263f] text-[11px] font-bold shadow-sm">
              <span className="material-symbols-outlined text-[15px] text-[#ae3115]">
                verified
              </span>
              <span>Patrimônio Mundial UNESCO</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">photo_library</span>
              340+ fotos
            </span>
          </div>
        </div>

        {/* Thumbnail Selector */}
        <div className="px-4 py-2.5 bg-white border-b border-[#eceef0] flex items-center gap-2.5 overflow-x-auto no-scrollbar">
          {[
            APP_ASSETS.mosteiroHeroDetail,
            APP_ASSETS.mosteiroThumb1,
            APP_ASSETS.mosteiroThumb2,
            APP_ASSETS.mosteiroThumb3
          ].map((thumb, index) => (
            <button
              key={index}
              onClick={() => setActivePhoto(thumb)}
              className={`relative rounded-xl overflow-hidden shrink-0 w-16 h-12 border-2 transition-all ${
                activePhoto === thumb ? 'border-[#ae3115] scale-105 shadow-sm' : 'border-transparent opacity-75'
              }`}
            >
              <img
                src={thumb}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-md mx-auto w-full px-4 flex flex-col gap-4 mt-3">
        {/* Title, Category and Rating */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-2">
          <span className="text-[12px] font-bold text-[#ae3115] uppercase tracking-wider">
            Monumento Histórico • Século XVI, Estilo Manuelino
          </span>
          <h1 className="text-[24px] font-extrabold text-[#00263f] leading-tight">
            Mosteiro dos Jerónimos
          </h1>

          <div className="flex items-center gap-3 pt-0.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad2] text-[#3d0600]">
              <span className="material-symbols-outlined text-[16px] text-[#ae3115] fill-1">
                star
              </span>
              <span className="text-[13px] font-extrabold">4.8</span>
            </div>
            <span className="text-[13px] text-[#42474e]">
              (2.450+ avaliações no SmartTrip)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#f2f4f6]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00263f] text-[18px]">
                location_on
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#72777e]">Localização</span>
                <span className="text-[12px] font-bold text-[#191c1e] truncate">
                  Praça do Império, Belém
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                schedule
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#72777e]">Funcionamento</span>
                <span className="text-[12px] font-bold text-emerald-700">
                  Aberto agora • 17:30
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SmartTrip AI Insight Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#0b3c5d] to-[#00263f] text-white shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ae3115] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <h3 className="text-[15px] font-bold text-white">Dica Inteligente SmartTrip</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-[#cee5ff] font-bold">
              IA Preditiva
            </span>
          </div>

          <div className="flex flex-col gap-2 text-[12px] text-[#e0e3e5] leading-relaxed">
            <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs">
              <span className="material-symbols-outlined text-[16px] text-[#fd6a49] shrink-0 mt-0.5">
                wb_sunny
              </span>
              <span>
                <strong>Melhor horário:</strong> Entre 10:00 e 11:30 a iluminação natural nos claustros é espetacular e a fila de entrada é 40% menor.
              </span>
            </div>

            <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs">
              <span className="material-symbols-outlined text-[16px] text-[#fd6a49] shrink-0 mt-0.5">
                savings
              </span>
              <span>
                <strong>Economia:</strong> Entrada gratuita com o Lisboa Card. Se você for visitar a Torre de Belém no mesmo dia, o combo economiza €8.
              </span>
            </div>

            <div className="flex items-start gap-2 bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs">
              <span className="material-symbols-outlined text-[16px] text-[#fd6a49] shrink-0 mt-0.5">
                photo_camera
              </span>
              <span>
                <strong>Dica de foto:</strong> O segundo andar do claustro oferece o melhor enquadramento dos arcos rendilhados sem multidões.
              </span>
            </div>
          </div>
        </div>

        {/* About & History Description */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-2">
          <h3 className="text-[16px] font-bold text-[#00263f]">Sobre o Monumento</h3>
          <p className="text-[13px] text-[#42474e] leading-relaxed">
            Iniciado em 1501 por ordem do Rei D. Manuel I para celebrar o regresso de Vasco da Gama da Índia, o Mosteiro dos Jerónimos é o ápice da arquitetura manuelina no mundo. Abriga os túmulos do próprio Vasco da Gama e do poeta Luís de Camões.
          </p>
        </div>

        {/* Community Reviews Section */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eceef0] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#00263f]">
              Avaliações da Comunidade
            </h3>
            <span className="text-[12px] text-[#ae3115] font-bold">Ver Todas (2.4k)</span>
          </div>

          {/* Rating Breakdown */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#f2f4f6]">
            <div className="flex flex-col items-center justify-center shrink-0">
              <span className="text-[28px] font-black text-[#00263f] leading-none">4.8</span>
              <div className="flex text-[#ae3115] text-[14px] mt-1">★★★★★</div>
              <span className="text-[10px] text-[#72777e] mt-0.5">98% recomendam</span>
            </div>

            <div className="flex-1 flex flex-col gap-1 text-[11px] text-[#42474e]">
              <div className="flex items-center gap-2">
                <span>5★</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#e0e3e5] overflow-hidden">
                  <div className="h-full bg-[#ae3115] w-[82%]"></div>
                </div>
                <span className="text-[10px] text-[#72777e]">82%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>4★</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#e0e3e5] overflow-hidden">
                  <div className="h-full bg-[#00263f] w-[14%]"></div>
                </div>
                <span className="text-[10px] text-[#72777e]">14%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>3★</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#e0e3e5] overflow-hidden">
                  <div className="h-full bg-[#a3cbf2] w-[4%]"></div>
                </div>
                <span className="text-[10px] text-[#72777e]">4%</span>
              </div>
            </div>
          </div>

          {/* Reviews Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {['Todas (2.4k)', 'Com Fotos (840)', 'Brasileiros (310)', 'Dicas Úteis (190)'].map(
              (pill) => (
                <button
                  key={pill}
                  onClick={() => setActiveReviewFilter(pill)}
                  className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    activeReviewFilter === pill
                      ? 'bg-[#00263f] text-white'
                      : 'bg-[#f2f4f6] text-[#42474e] hover:bg-[#e6e8ea]'
                  }`}
                >
                  {pill}
                </button>
              )
            )}
          </div>

          {/* Individual Reviews */}
          <div className="flex flex-col gap-3 pt-1">
            {/* Review 1 */}
            <div className="p-3 rounded-2xl bg-[#f2f4f6] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={APP_ASSETS.reviewerMariana}
                    alt="Mariana Fontes"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-[#191c1e]">
                      Mariana Fontes
                    </span>
                    <span className="text-[10px] text-[#72777e]">São Paulo • Set 2024</span>
                  </div>
                </div>
                <span className="text-[#ae3115] text-[12px]">★★★★★</span>
              </div>
              <p className="text-[12px] text-[#42474e] leading-relaxed">
                "Absolutamente deslumbrante! Os detalhes de pedra talhada nos claustros parecem renda. O ingresso antecipado sem filas poupou mais de 45 minutos no sol."
              </p>
              <img
                src={APP_ASSETS.reviewCloisterPhoto1}
                alt="Foto do Claustro"
                className="w-24 h-16 rounded-xl object-cover border border-white"
              />
            </div>

            {/* Review 2 */}
            <div className="p-3 rounded-2xl bg-[#f2f4f6] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={APP_ASSETS.reviewerLucas}
                    alt="Lucas Meireles"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-[#191c1e]">
                      Lucas Meireles
                    </span>
                    <span className="text-[10px] text-[#72777e]">Belo Horizonte • Ago 2024</span>
                  </div>
                </div>
                <span className="text-[#ae3115] text-[12px]">★★★★★</span>
              </div>
              <p className="text-[12px] text-[#42474e] leading-relaxed">
                "A dica do SmartTrip sobre o horário foi certeira! Cheguei às 10:15 e entrei direto. Depois atravessei a praça e fui almoçar no Vela Latina."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#eceef0] p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setInItinerary(!inItinerary);
              showToast(
                inItinerary ? 'Removido do roteiro atual' : 'Adicionado ao roteiro do Dia 2!'
              );
            }}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-full border text-[13px] font-bold transition-all shrink-0 ${
              inItinerary
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-[#f2f4f6] text-[#42474e] border-[#eceef0]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {inItinerary ? 'check_circle' : 'add_circle'}
            </span>
            <span>{inItinerary ? 'No Roteiro' : 'Adicionar'}</span>
          </button>

          <button
            onClick={() => onNavigate('checkout')}
            className="flex-1 py-3 px-6 rounded-full bg-[#ae3115] text-white text-[14px] font-bold shadow-md shadow-[#ae3115]/30 hover:bg-[#fd6a49] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Reservar • € 12</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
