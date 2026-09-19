import React, { useState, useEffect } from 'react';
import { AppRoute, TimeOffPeriod, UIState } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { Toast } from '../components/ui/Toast';
import { DemoStateSelector } from '../components/ui/DemoStateSelector';
import { useAuth } from '../contexts/AuthContext';
import { getTimeOffs, createTimeOff, deleteTimeOff } from '../services/firebase/firestoreService';

interface AvailabilityScreenProps {
  onNavigate: (route: AppRoute) => void;
  onSelectTimeOffForTrip?: (timeOff: TimeOffPeriod) => void;
}

export const AvailabilityScreen: React.FC<AvailabilityScreenProps> = ({
  onNavigate,
  onSelectTimeOffForTrip,
}) => {
  const { user } = useAuth();
  const [uiState, setUiState] = useState<UIState>('loading');
  const [timeOffs, setTimeOffs] = useState<TimeOffPeriod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Folga cadastrada com sucesso!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega folgas reais do Firestore
  const loadTimeOffs = async () => {
    if (!user?.uid) return;
    try {
      setUiState('loading');
      const data = await getTimeOffs(user.uid);
      setTimeOffs(data);
      setUiState(data.length === 0 ? 'empty' : 'normal');
    } catch (err) {
      console.error('Erro ao carregar folgas do Firestore:', err);
      setUiState('error');
    }
  };

  useEffect(() => {
    loadTimeOffs();
  }, [user?.uid]);

  // Calculate days in real-time (CA-UI-012)
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e.getTime() - s.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculatedDays = calculateDays(startDate, endDate);

  const handleCreateTimeOff = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateError('');

    if (!title.trim()) {
      setDateError('Dê um nome para o seu período de folga.');
      return;
    }

    if (!startDate || !endDate) {
      setDateError('Selecione as datas de início e término.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setDateError('A data de término não pode ser anterior à data de início.');
      return;
    }

    if (!user?.uid) return;

    setIsSubmitting(true);
    try {
      const created = await createTimeOff(user.uid, {
        title: title.trim(),
        startDate,
        endDate,
        totalDays: calculatedDays,
        status: 'upcoming',
      });

      const updated = [...timeOffs, created].sort((a, b) => a.startDate.localeCompare(b.startDate));
      setTimeOffs(updated);
      setUiState('normal');
      setIsModalOpen(false);
      setTitle('');
      setStartDate('');
      setEndDate('');
      setToastMessage('Período de folga salvo com sucesso no banco!');
      setShowToast(true);
    } catch (err) {
      console.error('Erro ao salvar folga no Firestore:', err);
      setDateError('Não foi possível salvar a folga no momento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTimeOff(id);
      const remaining = timeOffs.filter((t) => t.id !== id);
      setTimeOffs(remaining);
      if (remaining.length === 0) setUiState('empty');
      setToastMessage('Folga excluída com sucesso.');
      setShowToast(true);
    } catch (err) {
      console.error('Erro ao excluir folga no Firestore:', err);
    }
  };

  const handlePlanTrip = (timeOff: TimeOffPeriod) => {
    if (onSelectTimeOffForTrip) {
      onSelectTimeOffForTrip(timeOff);
    }
    onNavigate('/explore');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Folgas & Disponibilidade
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Cadastre seus períodos livres no banco para a IA encontrar as melhores viagens
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
            onClick={() => setIsModalOpen(true)}
            leftIcon={<span>+</span>}
            className="cursor-pointer"
          >
            Adicionar Folga
          </Button>
        </div>
      </div>

      {/* State: Loading */}
      {uiState === 'loading' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="default" className="p-5 space-y-4 bg-white">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-1/2 rounded-xl" />
                <Skeleton className="h-8 w-1/2 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* State: Error */}
      {uiState === 'error' && (
        <Card variant="bordered" className="p-8 text-center bg-red-50/50 border-red-200">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-sm font-bold text-red-900 mt-2">Falha na Conexão com o Banco</h3>
          <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">
            Não foi possível carregar suas folgas do Cloud Firestore.
          </p>
          <Button variant="outline" size="sm" onClick={loadTimeOffs} className="mt-4">
            Tentar Novamente
          </Button>
        </Card>
      )}

      {/* State: Empty */}
      {uiState === 'empty' && (
        <Card variant="default" className="p-12 text-center bg-white border border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-3">
            📅
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Nenhuma folga cadastrada no banco
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Adicione seus feriados, pontes ou férias para que o SmartTrip cruze automaticamente com o clima e preços ideais.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="mt-5"
          >
            Cadastrar Primeira Folga
          </Button>
        </Card>
      )}

      {/* State: Normal List of Real Time Offs */}
      {uiState === 'normal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeOffs.map((period) => (
            <Card
              key={period.id}
              variant="elevated"
              className="p-5 bg-white border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm">{period.title}</h3>
                  <Badge variant={period.status === 'upcoming' ? 'success' : 'neutral'}>
                    {period.status === 'upcoming' ? 'Agendada' : 'Passada'}
                  </Badge>
                </div>

                <p className="text-xs font-medium text-slate-600">
                  🗓 {period.startDate} até {period.endDate}
                </p>
                <p className="text-xs font-bold text-[#0b3c5d] mt-1">
                  ⏱ Duração: {period.totalDays} {period.totalDays === 1 ? 'dia' : 'dias'} livres
                </p>
              </div>

              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePlanTrip(period)}
                  className="flex-1 text-xs"
                >
                  Planejar com IA
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(period.id)}
                  className="text-xs text-slate-400 hover:text-red-600 px-2"
                  title="Excluir folga"
                >
                  ✕
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Cadastro Real de Folga */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Período de Folga"
      >
        <form onSubmit={handleCreateTimeOff} className="space-y-4">
          <Input
            label="Título da Folga / Ocasião"
            placeholder="Ex: Feriado Tiradentes, Férias de Julho"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data de Início"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <Input
              label="Data de Término"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {startDate && endDate && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">Duração calculada: </span>
              <span className="font-bold text-[#0b3c5d]">
                {calculatedDays > 0 ? `${calculatedDays} dias consecutivos` : 'Data inválida'}
              </span>
            </div>
          )}

          {dateError && (
            <p className="text-xs text-red-600 font-medium">{dateError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
            >
              Gravar no Banco
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
