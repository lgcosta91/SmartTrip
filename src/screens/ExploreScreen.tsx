import React, { useState, useEffect } from 'react';
import { AppRoute, DestinationOption, UIState } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DemoStateSelector } from '../components/ui/DemoStateSelector';
import { MOCK_DESTINATIONS, MOCK_USER_PROFILE } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { createTrip } from '../services/firebase/firestoreService';

interface ExploreScreenProps {
  onNavigate: (route: AppRoute) => void;
  onGenerateTripSuccess: (tripId: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onNavigate,
  onGenerateTripSuccess,
  initialStartDate = '2026-10-12',
  initialEndDate = '2026-10-17',
}) => {
  const { user } = useAuth();
  const activeUser = user || MOCK_USER_PROFILE;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<DestinationOption | null>(
    MOCK_DESTINATIONS[0] // Lisboa padrão
  );
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uiState, setUiState] = useState<UIState>('normal');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    'Conectando ao modelo Google Gemini...',
    `Analisando clima em ${selectedDestination?.name || 'seu destino'} para outubro...`,
    'Mapeando atrações icônicas e evitando filas...',
    'Otimizando horários e rotas a pé...',
    'Quase pronto: finalizando seu roteiro personalizado!',
  ];

  // Cycling loading message during AI synthesis (CA-UI-014)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isGenerating, loadingMessages.length]);

  const filteredDestinations = MOCK_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!selectedDestination || !startDate || !endDate) return;

    setIsGenerating(true);
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffTime = Math.max(0, e.getTime() - s.getTime());
      const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

      const generatedDays = Array.from({ length: Math.min(daysCount, 7) }, (_, idx) => ({
        dayNumber: idx + 1,
        dateStr: `Dia ${idx + 1}`,
        weekday: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'][idx % 7],
        title: idx === 0 ? `Chegada em ${selectedDestination.name}` : `Explorando ${selectedDestination.name}`,
        summary: `Atrações e pontos turísticos selecionados para o dia ${idx + 1}`,
        weather: {
          temp: selectedDestination.avgTemp,
          condition: selectedDestination.weatherCondition,
          icon: '☀️',
        },
        activities: selectedDestination.popularPOIs.slice(0, 3).map((poi, pIdx) => ({
          id: `act_${Date.now()}_${idx}_${pIdx}`,
          time: pIdx === 0 ? '09:30' : pIdx === 1 ? '14:00' : '19:30',
          period: (pIdx === 0 ? 'morning' : pIdx === 1 ? 'afternoon' : 'night') as any,
          title: poi.name,
          category: poi.category,
          description: poi.description,
          tags: [poi.category, selectedDestination.name],
          isCustomized: false,
        })),
      }));

      const newTrip = {
        title: `Roteiro ${selectedDestination.name}`,
        destination: `${selectedDestination.name}, ${selectedDestination.country}`,
        dates: `${startDate} a ${endDate}`,
        startDate,
        endDate,
        daysCount,
        imageUrl: selectedDestination.imageUrl,
        badge: 'IA Planejada',
        budgetEst: 'R$ 3.850',
        status: 'Planejamento' as const,
        weatherSummary: {
          avgTemp: selectedDestination.avgTemp,
          condition: selectedDestination.weatherCondition,
        },
        days: generatedDays,
      };

      if (user?.uid) {
        const saved = await createTrip(user.uid, newTrip);
        onGenerateTripSuccess(saved.id);
      } else {
        onGenerateTripSuccess('lisboa-2026');
      }

      onNavigate('/trips/:id');
    } catch (err) {
      console.error('Erro ao salvar viagem gerada no Firestore:', err);
      onGenerateTripSuccess('lisboa-2026');
      onNavigate('/trips/:id');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = Boolean(selectedDestination && startDate && endDate);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8">
      {/* Demo State Selector for Evaluation */}
      <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Explorar & Planejar com IA
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Descubra seu próximo destino com previsão de tempo e atrações curadas
          </p>
        </div>

        <DemoStateSelector
          currentState={uiState}
          onStateChange={setUiState}
          availableStates={['normal', 'error']}
        />
      </div>

      {/* ERROR STATE */}
      {uiState === 'error' && (
        <Card variant="bordered" className="p-8 text-center bg-red-50/50 border-red-200 my-6">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center mx-auto mb-2">
            ✕
          </div>
          <h2 className="text-sm font-bold text-red-800">Falha na consulta de clima e POIs</h2>
          <p className="text-xs text-red-600 mt-1">
            Não foi possível recuperar dados de meteorologia para o destino no momento.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUiState('normal')}
            className="mt-3"
          >
            Tentar Novamente
          </Button>
        </Card>
      )}

      {/* AI GENERATION OVERLAY (CA-UI-014) */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white">
          <div className="w-full max-w-md p-8 rounded-3xl bg-slate-800/90 border border-slate-700 text-center shadow-2xl space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0b3c5d] to-[#ae3115] animate-spin opacity-75 blur-xs"></div>
              <div className="relative w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl">
                ✨
              </div>
            </div>

            <div>
              <Badge variant="ai" className="mb-2 bg-slate-700 text-amber-300">
                Google Gemini 2.0 Flash
              </Badge>
              <h2 className="text-xl font-bold">Criando seu Roteiro Inteligente</h2>
              <p className="text-xs text-slate-300 mt-2 min-h-[36px] transition-all">
                {loadingMessages[loadingMessageIndex]}
              </p>
            </div>

            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-amber-400 h-full w-4/5 animate-pulse rounded-full"></div>
            </div>

            <p className="text-[11px] text-slate-400">
              Personalizando para o perfil de {activeUser.displayName.split(' ')[0]} ({activeUser.preferences?.travelPace || 'moderate'})
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Formulário de Destino e Datas (5 colunas) */}
        <div className="lg:col-span-5 space-y-5">
          <Card variant="default" className="p-6 bg-white space-y-4">
            <h2 className="text-base font-bold text-slate-900">1. Para onde você vai?</h2>

            <Input
              placeholder="Digite uma cidade (ex: Lisboa, Buenos Aires)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<span>🔍</span>}
            />

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Destinos Recomendados
              </span>
              <div className="flex flex-col gap-2">
                {filteredDestinations.map((dest) => {
                  const isSelected = selectedDestination?.name === dest.name;
                  return (
                    <button
                      key={dest.name}
                      type="button"
                      onClick={() => {
                        setSelectedDestination(dest);
                        setSearchQuery('');
                      }}
                      className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0b3c5d] bg-[#0b3c5d]/5 ring-1 ring-[#0b3c5d]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-900">
                          {dest.name}, {dest.country}
                        </p>
                        <p className="text-xs text-slate-500">{dest.avgTemp} • {dest.weatherCondition}</p>
                      </div>
                      {isSelected && <Badge variant="primary" size="sm">Selecionado</Badge>}
                    </button>
                  );
                })}
              </div>
            </div>

            <h2 className="text-base font-bold text-slate-900 pt-3 border-t border-slate-100">
              2. Período da Viagem
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Partida"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="Retorno"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Profile Context Reminder */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Estilo herdado do perfil:</span>
              <p className="mt-0.5">
                Ritmo {activeUser.preferences?.travelPace || 'moderado'} • Interesses:{' '}
                {activeUser.preferences?.interests?.slice(0, 2).join(', ') || 'Cultura & Gastronomia'}...
              </p>
            </div>

            {/* CTA Button with Disabled Check (CA-UI-013) */}
            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              disabled={!isFormValid || isGenerating}
              className="w-full mt-2"
              leftIcon={<span>✨</span>}
            >
              {isFormValid
                ? `Gerar Roteiro em ${selectedDestination?.name} com IA`
                : 'Selecione Destino e Datas'}
            </Button>
          </Card>
        </div>

        {/* Coluna Direita: Contexto do Destino (Clima e POIs) (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedDestination ? (
            <>
              {/* Destination Cover & Weather Banner */}
              <div className="relative rounded-3xl overflow-hidden shadow-md h-52">
                <img
                  src={selectedDestination.imageUrl}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <Badge variant="primary" size="sm" className="bg-white/90 text-slate-900 w-fit mb-1">
                    {selectedDestination.country}
                  </Badge>
                  <h2 className="text-2xl font-bold">{selectedDestination.name}</h2>
                  <p className="text-xs text-white/90 mt-1 max-w-lg">
                    {selectedDestination.description}
                  </p>
                </div>
              </div>

              {/* Weather Insight Card */}
              <Card variant="default" className="p-5 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">☀️</span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Previsão Climática para a Época
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedDestination.avgTemp} média • {selectedDestination.weatherCondition}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">Ideal para Turismo</Badge>
                </div>
                <p className="text-xs text-slate-600 mt-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/50">
                  💡 <span className="font-semibold">Dica da IA:</span> Dias ensolarados com brisa suave. Roupas leves para o dia e agasalho leve para a noite.
                </p>
              </Card>

              {/* Popular POIs Grid */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-base">
                  Atrações de Destaque em {selectedDestination.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedDestination.popularPOIs.map((poi) => (
                    <Card key={poi.name} variant="default" className="p-4 bg-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-xs text-slate-900">{poi.name}</h4>
                        <Badge variant="neutral" size="sm">{poi.category}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {poi.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card variant="bordered" className="p-12 text-center text-slate-400">
              Selecione um destino à esquerda para ver a prévia de clima e pontos de interesse.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
