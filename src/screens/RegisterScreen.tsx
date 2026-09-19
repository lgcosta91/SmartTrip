import React, { useState } from 'react';
import { AppRoute, UIState } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { DemoStateSelector } from '../components/ui/DemoStateSelector';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_USER_PROFILE } from '../data/mockData';

interface RegisterScreenProps {
  onNavigate: (route: AppRoute) => void;
  onRegisterSuccess: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigate,
  onRegisterSuccess,
}) => {
  const { register, loginWithGoogle, setDemoUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiState, setUiState] = useState<UIState>('normal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    setGlobalError(null);

    if (!name.trim()) {
      newErrors.name = 'Informe seu nome completo.';
    }
    if (!email || !email.includes('@')) {
      newErrors.email = 'Informe um e-mail válido.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'A senha deve conter no mínimo 6 caracteres.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas informadas não coincidem.';
    }
    if (!termsAccepted) {
      newErrors.terms = 'É obrigatório aceitar os termos de uso para continuar.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setUiState('loading');

    try {
      // O papel (role) NUNCA é passado pelo formulário; sempre 'user' no serviço
      await register(email, password, name);
      setUiState('normal');
      onRegisterSuccess();
    } catch (err: any) {
      // Fallback em caso de chaves placeholder em dev local
      if (err.message && (err.message.includes('API key') || err.message.includes('network-request-failed') || err.message.includes('placeholder'))) {
        console.warn('[SmartTrip] Chaves reais ausentes. Criando conta em modo demonstração local...');
        setDemoUser({
          ...MOCK_USER_PROFILE,
          uid: 'demo_user_' + Date.now(),
          displayName: name.trim(),
          email: email.trim(),
          photoURL: null,
          role: 'user', // Hardcoded
        });
        setUiState('normal');
        onRegisterSuccess();
        return;
      }

      setGlobalError(err.message || 'Erro ao processar cadastro. Tente novamente.');
      setUiState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGlobalError(null);
    setIsSubmitting(true);
    setUiState('loading');
    try {
      await loginWithGoogle();
      setUiState('normal');
      onRegisterSuccess();
    } catch (err: any) {
      if (err.message && (err.message.includes('API key') || err.message.includes('placeholder') || err.message.includes('operation-not-allowed'))) {
        setDemoUser({
          ...MOCK_USER_PROFILE,
          photoURL: MOCK_USER_PROFILE.photoURL || null,
          role: 'user',
        });
        setUiState('normal');
        onRegisterSuccess();
        return;
      }
      setGlobalError(err.message || 'Falha ao autenticar com o Google.');
      setUiState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center p-4">
      <DemoStateSelector
        currentState={uiState}
        onStateChange={(state) => {
          setUiState(state);
          if (state === 'error') {
            setGlobalError('Já existe uma conta cadastrada com este e-mail. Faça login.');
          } else {
            setGlobalError(null);
          }
        }}
        availableStates={['normal', 'loading', 'error']}
      />

      <Card variant="elevated" className="w-full max-w-lg p-6 sm:p-8 bg-white border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Crie sua conta no SmartTrip
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comece a planejar viagens com IA em menos de 1 minuto
          </p>
        </div>

        {globalError && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2"
          >
            <span className="font-bold">✕</span>
            <span>{globalError}</span>
          </div>
        )}

        <Button
          variant="outline"
          size="md"
          onClick={handleGoogleSignup}
          isLoading={isSubmitting || uiState === 'loading'}
          className="w-full mb-4 border-slate-300 font-medium text-slate-700 hover:bg-slate-50"
          leftIcon={
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              G
            </span>
          }
        >
          Cadastrar com o Google
        </Button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            ou preencha os dados
          </span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Nome Completo"
            placeholder="Juliana Mendes"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: '' });
              if (globalError) setGlobalError(null);
            }}
            error={errors.name}
            disabled={isSubmitting || uiState === 'loading'}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="juliana@exemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: '' });
              if (globalError) setGlobalError(null);
            }}
            error={errors.email}
            disabled={isSubmitting || uiState === 'loading'}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 dígitos"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
                if (globalError) setGlobalError(null);
              }}
              error={errors.password}
              disabled={isSubmitting || uiState === 'loading'}
              required
            />

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                if (globalError) setGlobalError(null);
              }}
              error={errors.confirmPassword}
              disabled={isSubmitting || uiState === 'loading'}
              required
            />
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (errors.terms) setErrors({ ...errors, terms: '' });
                }}
                className="mt-0.5 rounded border-slate-300 text-[#0b3c5d] focus:ring-[#0b3c5d]"
              />
              <span>
                Li e concordo com os Termos de Uso e Política de Privacidade do SmartTrip.
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting || uiState === 'loading'}
            className="w-full mt-2"
          >
            {isSubmitting || uiState === 'loading' ? 'Criando conta...' : 'Concluir Cadastro'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Já tem uma conta cadastrada?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-[#0b3c5d] font-bold hover:underline cursor-pointer"
          >
            Fazer login
          </button>
        </div>
      </Card>
    </div>
  );
};
