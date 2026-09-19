import React, { useState, useEffect } from 'react';
import { AppRoute, UIState, SavedTrip, TimeOffPeriod } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { DemoStateSelector } from '../components/ui/DemoStateSelector';
import { MOCK_USER_PROFILE } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { getTrips, getTimeOffs } from '../services/firebase/firestoreService';

interface DashboardScreenProps {
  onNavigate: (route: AppRoute) => void;
  onSelectTrip: (tripId: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onSelectTrip,
}) => {
  const { user: authUser } = useAuth();
  const [uiState, setUiState] = useState<UIState>('loading');
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [timeOffs, setTimeOffs] = useState<TimeOffPeriod[]>([]);

  const user = authUser || MOCK_USER_PROFILE;

  const loadDashboardData = async () => {
    if (!authUser?.uid) return;
    try {
      setUiState('loading');
      const [fetchedTrips, fetchedTimeOffs] = await Promise.all([
        getTrips(authUser.uid),
        getTimeOffs(authUser.uid),
      ]);
      setTrips(fetchedTrips);
      setTimeOffs(fetchedTimeOffs);

      if (fetchedTrips.length === 0 && fetchedTimeOffs.length === 0) {
        setUiState('empty');
      } else {
        setUiState('normal');
      }
    } catch (err) {
      console.error('Erro ao carregar dados do Dashboard no Firestore:', err);
      setUiState('error');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [authUser?.uid]);

  const nextTrip = trips[0];
  const recentTrips = trips;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Demo State Selector for Evaluation */}
      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Olá, {user.displayName.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Pronto para planejar sua próxima aventura?
          </p>
        </div>

        <DemoStateSelector
          currentState={uiState}
          onStateChange={setUiState}
          availableStates={['normal', 'empty', 'loading', 'error']}
        />
      </div>

      {/* ERROR STATE */}
      {uiState === 'error' && (
        <Card variant="bordered" className="p-8 text-center bg-red-50/50 border-red-200 my-6">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 font-bold text-xl flex items-center justify-center mx-auto mb-3">
            ✕
          </div>
          <h2 className="text-base font-bold text-red-800">Falha ao carregar o painel do banco</h2>
          <p className="text-xs text-red-600 mt-1 max-w-md mx-auto">
            Não foi possível recuperar seus dados do Cloud Firestore neste momento.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            className="mt-4 border-red-300 text-red-800 hover:bg-red-100"
          >
            Tentar Novamente
          </Button>
        </Card>
      )}

      {/* LOADING STATE (Skeletons) */}
      {uiState === 'loading' && (
        <div className="space-y-6">
          <Skeleton height="220px" className="w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton height="100px" />
            <Skeleton height="100px" />
            <Skeleton height="100px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton height="160px" />
            <Skeleton height="160px" />
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {uiState === 'empty' && (
        <Card variant="bordered" className="p-12 text-center my-6 bg-white">
          <div className="w-16 h-16 rounded-3xl bg-[#0b3c5d]/10 text-[#0b3c5d] text-2xl flex items-center justify-center mx-auto mb-4">
            ✈️
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Você ainda não tem dados cadastrados no banco
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Comece informando suas folgas ou escolha um destino dos seus sonhos para a IA gerar um roteiro sob medida e salvar na sua conta.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="gradient" size="md" onClick={() => onNavigate('/explore')}>
              Planejar Primeiro Roteiro com IA
            </Button>
            <Button variant="outline" size="md" onClick={() => onNavigate('/availability')}>
              Cadastrar Folga
            </Button>
          </div>
        </Card>
      )}

      {/* NORMAL STATE: REAL DATA FROM FIRESTORE */}
      {uiState === 'normal' && (
        <div className="space-y-6">
          {/* Próxima Viagem ou Banner de Ação */}
          {nextTrip ? (
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800 text-white">
              <img
                src={nextTrip.imageUrl}
                alt={nextTrip.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>

              <div className="relative p-6 sm:p-8 md:p-10 z-10 flex flex-col justify-between min-h-[260px] max-w-2xl">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary">{nextTrip.badge}</Badge>
                    <span className="text-xs text-amber-300 font-semibold tracking-wide">
                      {nextTrip.status === 'Confirmada' ? 'Próxima Partida Confirmada' : 'Rascunho de Viagem'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                    {nextTrip.title}
                  </h2>
                  <p className="text-sm text-slate-200 line-clamp-2">
                    📍 {nextTrip.destination} • 🗓 {nextTrip.dates} ({nextTrip.daysCount} dias)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-6">
                  <Button
                    variant="gradient"
                    size="md"
                    onClick={() => {
                      onSelectTrip(nextTrip.id);
                      onNavigate('/trips/:id');
                    }}
                  >
                    Ver Roteiro Detalhado
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => onNavigate('/explore')}
                  >
                    Gerar Outro Roteiro
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Card variant="elevated" className="p-6 bg-gradient-to-r from-[#0b3c5d] to-[#00263f] text-white flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold">Nenhum roteiro ativo</h2>
                <p className="text-xs text-slate-300 mt-1">Gere agora sua próxima aventura com o Gemini e salve no banco.</p>
              </div>
              <Button variant="gradient" size="md" onClick={() => onNavigate('/explore')}>
                Explorar com IA
              </Button>
            </Card>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="default" className="p-5 flex items-center gap-4 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
                📅
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Folgas Cadastradas</span>
                <p className="text-xl font-extrabold text-slate-900">{timeOffs.length}</p>
              </div>
            </Card>

            <Card variant="default" className="p-5 flex items-center gap-4 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0b3c5d] flex items-center justify-center text-xl font-bold">
                🧳
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Viagens no Banco</span>
                <p className="text-xl font-extrabold text-slate-900">{trips.length}</p>
              </div>
            </Card>

            <Card variant="default" className="p-5 flex items-center gap-4 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
                🧭
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Perfil & Estilo</span>
                <p className="text-sm font-extrabold text-slate-900">
                  {user.preferences?.travelPace === 'moderate' ? 'Equilibrado' : user.preferences?.travelPace === 'slow' ? 'Relaxante' : 'Dinâmico'}
                </p>
              </div>
            </Card>
          </div>

          {/* Viagens Recentes / Próximas Folgas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Folgas */}
            <Card variant="default" className="p-5 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Suas Folgas</h3>
                <button
                  onClick={() => onNavigate('/availability')}
                  className="text-xs text-[#0b3c5d] font-bold hover:underline cursor-pointer"
                >
                  Gerenciar Folgas
                </button>
              </div>

              {timeOffs.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Nenhuma folga cadastrada no banco.</p>
              ) : (
                <div className="space-y-2">
                  {timeOffs.slice(0, 3).map((to) => (
                    <div key={to.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{to.title}</p>
                        <p className="text-[11px] text-slate-500">{to.startDate} a {to.endDate}</p>
                      </div>
                      <Badge variant="primary">{to.totalDays} dias</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Roteiros */}
            <Card variant="default" className="p-5 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Roteiros Salvos</h3>
                <button
                  onClick={() => onNavigate('/trips')}
                  className="text-xs text-[#0b3c5d] font-bold hover:underline cursor-pointer"
                >
                  Ver Todos
                </button>
              </div>

              {recentTrips.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Nenhum roteiro salvo no banco.</p>
              ) : (
                <div className="space-y-2">
                  {recentTrips.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onSelectTrip(t.id);
                        onNavigate('/trips/:id');
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 cursor-pointer transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">{t.title}</p>
                        <p className="text-[11px] text-slate-500">{t.destination} • {t.dates}</p>
                      </div>
                      <Badge variant={t.status === 'Confirmada' ? 'success' : 'neutral'}>
                        {t.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
