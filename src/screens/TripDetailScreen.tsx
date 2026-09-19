import React, { useState, useEffect } from 'react';
import { AppRoute, SavedTrip, ActivityItem, UIState } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Toast } from '../components/ui/Toast';
import { DemoStateSelector } from '../components/ui/DemoStateSelector';
import { MOCK_TRIPS } from '../data/mockData';
import { getTripById } from '../services/firebase/firestoreService';

interface TripDetailScreenProps {
  tripId?: string;
  onNavigate: (route: AppRoute) => void;
}

export const TripDetailScreen: React.FC<TripDetailScreenProps> = ({
  tripId = 'lisboa-2026',
  onNavigate,
}) => {
  const [uiState, setUiState] = useState<UIState>('loading');
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      setUiState('loading');
      try {
        const data = await getTripById(tripId);
        if (data) {
          setTrip(data);
          setUiState('normal');
        } else {
          // Fallback para mock se tripId for de exemplo inicial
          const fallback = MOCK_TRIPS.find((t) => t.id === tripId) || MOCK_TRIPS[0];
          setTrip(fallback);
          setUiState('normal');
        }
      } catch (err) {
        console.error('Erro ao buscar roteiro no Firestore:', err);
        const fallback = MOCK_TRIPS.find((t) => t.id === tripId) || MOCK_TRIPS[0];
        setTrip(fallback);
        setUiState('normal');
      }
    };

    fetchTrip();
  }, [tripId]);

  if (!trip) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <Card variant="default" className="p-8 text-center bg-white">
          <Skeleton className="h-6 w-1/3 mx-auto mb-4" />
          <Skeleton className="h-44 w-full rounded-2xl mb-4" />
          <p className="text-xs text-slate-500">Carregando roteiro do banco...</p>
        </Card>
      </div>
    );
  }

  const currentDay = trip.days.find((d) => d.dayNumber === selectedDayNumber) || trip.days[0] || {
    dayNumber: 1,
    dateStr: 'Dia 1',
    weekday: 'Segunda-feira',
    title: 'Início da Viagem',
    summary: 'Roteiro inicial',
    weather: { temp: '22°C', condition: 'Ensolarado', icon: '☀️' },
    activities: [],
  };

  // Start inline editing (CA-UI-017)
  const startEdit = (act: ActivityItem) => {
    setEditingActivityId(act.id);
    setEditTitle(act.title);
    setEditTime(act.time);
  };

  // Save inline edit (CA-UI-017)
  const saveEdit = (activityId: string) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== selectedDayNumber) return day;
      return {
        ...day,
        activities: day.activities.map((act) => {
          if (act.id !== activityId) return act;
          return {
            ...act,
            title: editTitle.trim() || act.title,
            time: editTime.trim() || act.time,
            isCustomized: true,
          };
        }),
      };
    });

    setTrip({ ...trip, days: updatedDays });
    setEditingActivityId(null);
    setToastMessage('Atividade atualizada manualmente.');
    setShowToast(true);
  };

  // Remove activity (CA-UI-018)
  const removeActivity = (activityId: string) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== selectedDayNumber) return day;
      return {
        ...day,
        activities: day.activities.filter((act) => act.id !== activityId),
      };
    });

    setTrip({ ...trip, days: updatedDays });
    setToastMessage('Atividade removida do itinerário.');
    setShowToast(true);
  };

  // Add new manual activity
  const addActivity = () => {
    const newAct: ActivityItem = {
      id: `act-manual-${Date.now()}`,
      time: '16:00',
      period: 'afternoon',
      title: 'Nova Atividade Personalizada',
      category: 'Lazer & Passeio',
      description: 'Adicionada manualmente durante a revisão humana.',
      priceText: '€15',
      tags: ['Personalizado'],
      isCustomized: true,
    };

    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== selectedDayNumber) return day;
      return {
        ...day,
        activities: [...day.activities, newAct],
      };
    });

    setTrip({ ...trip, days: updatedDays });
    setToastMessage('Nova atividade adicionada para curadoria.');
    setShowToast(true);
  };

  // Confirm and Homologate Trip
  const handleConfirmSave = () => {
    setTrip({ ...trip, status: 'Confirmada' });
    setToastMessage('Roteiro homologado e salvo com sucesso!');
    setShowToast(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8">
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Top Controls and Demo State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <button
          onClick={() => onNavigate('/trips')}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          ← Voltar para Minhas Viagens
        </button>

        <DemoStateSelector currentState={uiState} onStateChange={setUiState} />
      </div>

      {/* ERROR STATE */}
      {uiState === 'error' && (
        <Card variant="bordered" className="p-8 text-center bg-red-50 border-red-200 my-6">
          <h2 className="text-base font-bold text-red-800">Erro ao carregar os dias da viagem</h2>
          <p className="text-xs text-red-600 mt-1">Falha na recuperação dos dados estruturados.</p>
          <Button variant="outline" size="sm" onClick={() => setUiState('normal')} className="mt-3">
            Recarregar
          </Button>
        </Card>
      )}

      {/* LOADING STATE */}
      {uiState === 'loading' && (
        <div className="space-y-6">
          <Skeleton height="200px" className="rounded-3xl" />
          <div className="flex gap-2">
            <Skeleton width="100px" height="40px" />
            <Skeleton width="100px" height="40px" />
          </div>
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </div>
      )}

      {/* NORMAL STATE */}
      {uiState === 'normal' && (
        <div className="space-y-6">
          {/* Trip Hero Header */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-60 sm:h-64">
            <img
              src={trip.imageUrl}
              alt={trip.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 flex flex-col justify-end p-6 sm:p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success" size="sm">
                  {trip.status}
                </Badge>
                <Badge variant="ai" size="sm" className="bg-amber-400 text-slate-900">
                  Curadoria Humana Habilitada
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{trip.title}</h1>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                {trip.destination} • {trip.dates} • Previsão: {trip.weatherSummary?.avgTemp}{' '}
                {trip.weatherSummary?.condition}
              </p>
            </div>
          </div>

          {/* Action Bar (Homologação & Revisão) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900">Revisão Ativa:</span> Você pode editar
              títulos, horários e remover atividades sugeridas pela IA antes de aprovar.
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={addActivity}>
                + Nova Atividade
              </Button>
              <Button variant="gradient" size="sm" onClick={handleConfirmSave}>
                Confirmar e Salvar Roteiro
              </Button>
            </div>
          </div>

          {/* Day Navigation Tabs (CA-UI-019) */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            {trip.days.map((day) => {
              const isSelected = selectedDayNumber === day.dayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#0b3c5d] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Dia {day.dayNumber} • {day.dateStr}
                </button>
              );
            })}
          </div>

          {/* Day Content Overview */}
          {currentDay && (
            <div className="space-y-4">
              <Card variant="bordered" className="p-4 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{currentDay.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{currentDay.summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg">{currentDay.weather.icon}</span>
                  <p className="text-[11px] font-bold text-slate-700">{currentDay.weather.temp}</p>
                </div>
              </Card>

              {/* Activities Timeline */}
              <div className="space-y-3">
                {currentDay.activities.map((act) => {
                  const isEditing = editingActivityId === act.id;

                  return (
                    <Card
                      key={act.id}
                      variant="default"
                      className="p-4 bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
                    >
                      {isEditing ? (
                        /* INLINE EDIT FORM (CA-UI-017) */
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="sm:col-span-1">
                              <Input
                                label="Horário"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <Input
                                label="Título da Atividade"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setEditingActivityId(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => saveEdit(act.id)}
                            >
                              Salvar Alteração
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* NORMAL ACTIVITY CARD VIEW */
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 font-bold text-slate-800 text-xs flex flex-col items-center justify-center shrink-0 border border-slate-200">
                              <span>{act.time}</span>
                              <span className="text-[9px] text-slate-400 font-normal">
                                {act.duration || '1h'}
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-slate-900 text-sm">{act.title}</h4>
                                <Badge variant="neutral" size="sm">
                                  {act.category}
                                </Badge>
                                {act.isCustomized && (
                                  <Badge variant="warning" size="sm">
                                    Editado por Você
                                  </Badge>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {act.description}
                              </p>

                              {act.placeName && (
                                <p className="text-[11px] text-slate-400 mt-1">
                                  📍 {act.placeName} • Custo: {act.priceText || 'Grátis'}
                                </p>
                              )}

                              {act.aiTip && (
                                <p className="text-[11px] text-[#0b3c5d] font-medium mt-1.5 p-1.5 px-2 bg-blue-50/70 rounded-lg w-fit">
                                  💡 Dica da IA: {act.aiTip}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Activity Actions: Edit and Delete (CA-UI-017, CA-UI-018) */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => startEdit(act)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#0b3c5d] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                              title="Editar atividade inline"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => removeActivity(act.id)}
                              className="p-1.5 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover atividade"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
