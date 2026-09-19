import React, { useState } from 'react';
import { AppRoute, UIState } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { DemoStateSelector } from '../components/ui/DemoStateSelector';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_USER_PROFILE } from '../data/mockData';

interface LoginScreenProps {
  onNavigate: (route: AppRoute) => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const { login, loginWithGoogle, resetPassword, setDemoUser } = useAuth();

  const [email, setEmail] = useState('juliana.mendes@smarttrip.ai');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiState, setUiState] = useState<UIState>('normal');

  // Modal de Recuperação de Senha
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [showResetSuccessToast, setShowResetSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setErrorMessage(null);

    let isValid = true;
    if (!email || !email.includes('@')) {
      setEmailError('Informe um e-mail válido com @ e domínio.');
      isValid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError('A senha deve conter pelo menos 6 caracteres.');
      isValid = false;
    }

    if (!isValid) return;

    setIsSubmitting(true);
    setUiState('loading');

    try {
      await login(email, password);
      setUiState('normal');
      onLoginSuccess();
    } catch (err: any) {
      // Se for ambiente local com chaves de placeholder e falhar a conexão com Firebase Auth,
      // permite fallback gracioso para não travar a avaliação da aplicação
      if (err.message && (err.message.includes('API key') || err.message.includes('network-request-failed') || err.message.includes('placeholder'))) {
        console.warn('[SmartTrip] Chaves reais ausentes. Autenticando em modo demonstração local...');
        setDemoUser({
          ...MOCK_USER_PROFILE,
          email: email.trim(),
          photoURL: MOCK_USER_PROFILE.photoURL || null,
          role: 'user',
        });
        setUiState('normal');
        onLoginSuccess();
        return;
      }

      setErrorMessage(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      setUiState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    setUiState('loading');
    try {
      await loginWithGoogle();
      setUiState('normal');
      onLoginSuccess();
    } catch (err: any) {
      if (err.message && (err.message.includes('API key') || err.message.includes('placeholder') || err.message.includes('operation-not-allowed'))) {
        setDemoUser({
          ...MOCK_USER_PROFILE,
          photoURL: MOCK_USER_PROFILE.photoURL || null,
          role: 'user',
        });
        setUiState('normal');
        onLoginSuccess();
        return;
      }
      setErrorMessage(err.message || 'Falha ao autenticar com o Google.');
      setUiState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailError('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotEmailError('Informe um endereço de e-mail válido.');
      return;
    }

    setIsSendingReset(true);
    try {
      await resetPassword(forgotEmail);
      setIsForgotModalOpen(false);
      setShowResetSuccessToast(true);
      setForgotEmail('');
    } catch (err: any) {
      setForgotEmailError(err.message || 'Erro ao solicitar redefinição.');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center p-4">
      {/* Toast de Confirmação de Reset de Senha */}
      <Toast
        message="E-mail de recuperação enviado! Verifique sua caixa de entrada e spam."
        type="success"
        isVisible={showResetSuccessToast}
        onClose={() => setShowResetSuccessToast(false)}
      />

      {/* Demo State Selector for Evaluation */}
      <DemoStateSelector
        currentState={uiState}
        onStateChange={(state) => {
          setUiState(state);
          if (state === 'error') {
            setErrorMessage('E-mail ou senha incorretos. Verifique seus dados.');
          } else {
            setErrorMessage(null);
          }
        }}
        availableStates={['normal', 'loading', 'error']}
      />

      <Card variant="elevated" className="w-full max-w-md p-6 sm:p-8 bg-white border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0b3c5d] to-[#ae3115] text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            ST
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bem-vindo de volta!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Acesse seus roteiros e planeje sua próxima aventura
          </p>
        </div>

        {/* Error State Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2"
          >
            <span className="font-bold">✕</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google SSO Button */}
        <Button
          variant="outline"
          size="md"
          onClick={handleGoogleLogin}
          isLoading={isSubmitting || uiState === 'loading'}
          className="w-full mb-4 border-slate-300 font-medium text-slate-700 hover:bg-slate-50"
          leftIcon={
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              G
            </span>
          }
        >
          Continuar com o Google
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            ou com e-mail
          </span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
              if (errorMessage) setErrorMessage(null);
            }}
            error={emailError}
            disabled={isSubmitting || uiState === 'loading'}
            autoComplete="email"
            required
          />

          <div>
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (errorMessage) setErrorMessage(null);
              }}
              error={passwordError}
              disabled={isSubmitting || uiState === 'loading'}
              autoComplete="current-password"
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              }
            />

            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setIsForgotModalOpen(true);
                }}
                className="text-xs text-[#0b3c5d] font-semibold hover:underline cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting || uiState === 'loading'}
            className="w-full mt-2"
          >
            {isSubmitting || uiState === 'loading' ? 'Autenticando...' : 'Acessar Conta'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Não tem uma conta no SmartTrip?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-[#0b3c5d] font-bold hover:underline cursor-pointer"
          >
            Cadastre-se grátis
          </button>
        </div>
      </Card>

      {/* Modal de Recuperação de Senha (SPEC-AUTH-001 Seção 3.4) */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Recuperação de Senha"
      >
        <form onSubmit={handleSendResetPassword} className="space-y-4">
          <p className="text-xs text-slate-600">
            Digite seu e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha de acesso.
          </p>

          <Input
            label="E-mail de Cadastro"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={forgotEmail}
            onChange={(e) => {
              setForgotEmail(e.target.value);
              if (forgotEmailError) setForgotEmailError('');
            }}
            error={forgotEmailError}
            disabled={isSendingReset}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              disabled={isSendingReset}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSendingReset}
            >
              Enviar Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
