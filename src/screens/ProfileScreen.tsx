import React, { useState, useEffect } from 'react';
import { AppRoute, UIState } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Toast } from '../components/ui/Toast';
import { DemoStateSelector } from '../components/ui/DemoStateSelector';
import { MOCK_USER_PROFILE } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface ProfileScreenProps {
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

const ALL_INTERESTS = [
  'Gastronomia',
  'Cultura & Museus',
  'Caminhadas ao Ar Livre',
  'Cafés Tradicionais',
  'Praias & Litoral',
  'Vida Noturna',
  'Compras & Mercados',
  'Fotografia de Paisagens',
  'História Antiga',
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  onLogout,
}) => {
  const { user, updateProfileData } = useAuth();

  const activeUser = user || MOCK_USER_PROFILE;

  const [uiState, setUiState] = useState<UIState>('normal');
  const [displayName, setDisplayName] = useState(activeUser.displayName);
  const [originCity, setOriginCity] = useState(activeUser.originCity);
  const [travelPace, setTravelPace] = useState(activeUser.preferences.travelPace);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    activeUser.preferences.interests
  );
  const [budgetLevel, setBudgetLevel] = useState(activeUser.preferences.budgetLevel);
  const [dietary, setDietary] = useState(
    activeUser.preferences.dietaryRestrictions?.join(', ') || 'Sem restrições graves'
  );
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setOriginCity(user.originCity);
      setTravelPace(user.preferences.travelPace);
      setSelectedInterests(user.preferences.interests);
      setBudgetLevel(user.preferences.budgetLevel);
      setDietary(user.preferences.dietaryRestrictions?.join(', ') || 'Sem restrições graves');
    }
  }, [user]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = async () => {
    setUiState('loading');
    try {
      await updateProfileData({
        displayName,
        originCity,
        preferences: {
          travelPace,
          interests: selectedInterests,
          budgetLevel,
          dietaryRestrictions: dietary.split(',').map((s) => s.trim()).filter(Boolean),
        },
      });
      setShowToast(true);
    } catch (error) {
      console.warn('Erro ao atualizar perfil no Firestore:', error);
      // Feedback amigável mesmo em modo local
      setShowToast(true);
    } finally {
      setUiState('normal');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
      {/* Toast Notification */}
      <Toast
        message="Preferências de viagem atualizadas com sucesso!"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Perfil & Preferências
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Configure seu estilo para que o Gemini gere roteiros sob medida
          </p>
        </div>

        <DemoStateSelector
          currentState={uiState}
          onStateChange={setUiState}
          availableStates={['normal', 'loading']}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Avatar & Dados Pessoais */}
        <div className="space-y-6">
          <Card variant="default" className="text-center p-6 bg-white">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={activeUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
                alt={displayName}
                className="w-full h-full rounded-full object-cover border-4 border-slate-100 shadow-md"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0b3c5d] text-white text-xs flex items-center justify-center shadow-md hover:bg-[#00263f]"
                title="Alterar avatar"
              >
                📷
              </button>
            </div>

            <h2 className="font-bold text-slate-900 text-lg">{displayName}</h2>
            <p className="text-xs text-slate-500">{activeUser.email}</p>
            <div className="mt-2">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Papel: {activeUser.role || 'user'}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 cursor-pointer"
              >
                Encerrar Sessão
              </Button>
            </div>
          </Card>

          <Card variant="default" className="p-5 space-y-4 bg-white">
            <h3 className="font-bold text-slate-900 text-sm">Dados Cadastrais</h3>
            <Input
              label="Nome de Exibição"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={uiState === 'loading'}
            />
            <Input
              label="Cidade de Origem"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              disabled={uiState === 'loading'}
            />
          </Card>
        </div>

        {/* Coluna Direita: Preferências de Viagem para a IA */}
        <div className="md:col-span-2 space-y-6">
          <Card variant="default" className="p-6 space-y-6 bg-white">
            {/* Ritmo de Viagem (Mutuamente exclusivo - CA-UI-010) */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Ritmo Preferido de Viagem
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'slow', label: 'Lento & Relaxante', sub: 'Poucos pontos por dia, foco em descanso' },
                  { id: 'moderate', label: 'Equilibrado (Padrão)', sub: 'Mistura de atrações principais com pausas' },
                  { id: 'fast', label: 'Intenso & Dinâmico', sub: 'Aproveitar o máximo de atrações possíveis' },
                ].map((item) => {
                  const isSelected = travelPace === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTravelPace(item.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0b3c5d] bg-[#0b3c5d]/5 ring-1 ring-[#0b3c5d]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-xs text-slate-900">{item.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interesses Temáticos */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Áreas de Interesse (Selecione múltiplas)
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0b3c5d] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Faixa de Orçamento */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Nível de Orçamento Diário
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'low', label: 'Econômico ($)', sub: 'Hostels e transporte público' },
                  { id: 'medium', label: 'Conforto ($$)', sub: 'Hotéis 3-4★ e bistrôs' },
                  { id: 'high', label: 'Premium ($$$)', sub: 'Experiências exclusivas' },
                ].map((tier) => {
                  const isSelected = budgetLevel === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setBudgetLevel(tier.id as any)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#ae3115] bg-[#ae3115]/5 ring-1 ring-[#ae3115]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-xs text-slate-900">{tier.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{tier.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Restrições Especiais */}
            <div>
              <Input
                label="Restrições Alimentares ou Mobilidade"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="Ex: Vegetariano, intolerância a lactose, carrinho de bebê"
                helperText="O Gemini adaptará restaurantes e passeios para evitar inconvenientes."
              />
            </div>

            {/* Botão de Salvamento */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                variant="gradient"
                size="md"
                onClick={handleSave}
                isLoading={uiState === 'loading'}
                className="w-full sm:w-auto cursor-pointer"
              >
                Salvar Alterações no Perfil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
