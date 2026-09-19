import React, { useState, useEffect } from 'react';
import { AppRoute, SavedTrip, UIState } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { Toast } from '../components/ui/Toast';
import { DemoStateSelector } from '../components/ui/DemoStateSelector';
import { useAuth } from '../contexts/AuthContext';
import { getTrips, deleteTrip } from '../services/firebase/firestoreService';

interface TripsScreenProps {
  onNavigate: (route: AppRoute) => void;
  onSelectTrip: (tripId: string) => void;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({
  onNavigate,
  onSelectTrip,
}) => {
  const { user } = useAuth();
  const [uiState, setUiState] = useState<UIState>('loading');
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmada' | 'planejamento' | 'concluido'>('all');
  const [tripToDelete, setTripToDelete] = useState<SavedTrip | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTrips = async () => {
    if (!user?.uid) return;
    try {
      setUiState('loading');
      const data = await getTrips(user.uid);
      setTrips(data);
      setUiState(data.length === 0 ? 'empty' : 'normal');
    } catch (err) {
      console.error('Erro ao carregar viagens do Firestore:', err);
      setUiState('error');
    }
  };

  useEffect(() => {
    loadTrips();
  }, [user?.uid]);

  // Real-time search filter (CA-UI-016)
  const filteredTrips = trips.filter((trip) => {
    const matchesQuery =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (activeFilter === 'confirmada') return trip.status === 'Confirmada';
    if (activeFilter === 'planejamento') return trip.status === 'Planejamento';
    if (activeFilter === 'concluido') return trip.status === 'Concluído';
    return true;
  });

  const confirmDelete = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTrip(tripToDelete.id);
      const remaining = trips.filter((t) => t.id !== tripToDelete.id);
      setTrips(remaining);
      if (remaining.length === 0) setUiState('empty');
      setTripToDelete(null);
      setShowToast(true);
    } catch (err) {
      console.error('Erro ao excluir viagem no Firestore:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
      <Toast
        message="Viagem excluída com sucesso do banco de dados."
        type="info"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Minhas Viagens
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Gerencie, revise e consulte todos os seus itinerários salvos no Cloud Firestore
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoStateSelector
            currentState={uiState}
            onStateChange={setUiState}
            availableStates={['normal', 'empty', 'loading', 'error']}
          />
          <Button
            variant="gradient"
            size="md"
            onClick={() => onNavigate('/explore')}
            leftIcon={<span>+</span>}
            className="cursor-pointer"
          >
            Novo Roteiro
          </Button>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Buscar por destino ou título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'confirmada', label: 'Confirmadas' },
            { id: 'planejamento', label: 'Rascunhos' },
            { id: 'concluido', label: 'Concluídas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#0b3c5d] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {uiState === 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="default" className="overflow-hidden bg-white">
              <Skeleton className="w-full h-44" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-8 w-24 rounded-xl" />
                  <Skeleton className="h-8 w-16 rounded-xl" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {uiState === 'error' && (
        <Card variant="bordered" className="p-8 text-center bg-red-50/50 border-red-200">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-sm font-bold text-red-900 mt-2">Erro ao carregar roteiros do banco</h3>
          <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">
            Não foi possível consultar suas viagens salvas no Firestore.
          </p>
          <Button variant="outline" size="sm" onClick={loadTrips} className="mt-4">
            Tentar Novamente
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {uiState === 'empty' && (
        <Card variant="default" className="p-12 text-center bg-white border border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-2xl mx-auto mb-3">
            🧳
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Nenhuma viagem cadastrada no banco
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Você ainda não possui viagens salvas. Use nossa IA para montar um roteiro detalhado em poucos segundos.
          </p>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => onNavigate('/explore')}
            className="mt-5"
          >
            Explorar e Criar com IA
          </Button>
        </Card>
      )}

      {/* Normal Grid with Real Trips */}
      {uiState === 'normal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              variant="elevated"
              className="group overflow-hidden bg-white border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cover Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3">
                    <Badge variant={trip.status === 'Confirmada' ? 'success' : 'neutral'}>
                      {trip.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] font-medium opacity-90">📍 {trip.destination}</p>
                    <h2 className="font-bold text-base leading-snug drop-shadow-xs">
                      {trip.title}
                    </h2>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>🗓 {trip.dates}</span>
                    <span className="font-bold text-[#0b3c5d]">{trip.daysCount} dias</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500">Orçamento estimado</span>
                    <span className="font-extrabold text-slate-800">{trip.budgetEst}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onSelectTrip(trip.id);
                    onNavigate('/trips/:id');
                  }}
                  className="flex-1 text-xs"
                >
                  Abrir Roteiro
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTripToDelete(trip)}
                  className="text-xs text-slate-400 hover:text-red-600 px-2"
                  title="Excluir viagem"
                >
                  🗑️
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Exclusão */}
      <Modal
        isOpen={Boolean(tripToDelete)}
        onClose={() => setTripToDelete(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Tem certeza que deseja excluir o roteiro{' '}
            <strong className="text-slate-900">{tripToDelete?.title}</strong> do banco de dados?
            Esta ação não poderá ser desfeita.
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTripToDelete(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={confirmDelete}
              isLoading={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 border-none"
            >
              Excluir Viagem
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
