/**
 * Mapeador de Erros de Autenticação — SmartTrip
 * 
 * Traduz códigos nativos do Firebase Auth para mensagens amigáveis em português,
 * prevenindo vazamento de informações sensíveis e orientando o viajante.
 * 
 * Referência: SPEC-AUTH-001 Seção 7
 */

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'O endereço de e-mail informado não é válido.',
  'auth/user-disabled': 'Esta conta de usuário foi desativada temporariamente.',
  'auth/user-not-found': 'E-mail ou senha incorretos. Verifique seus dados.',
  'auth/wrong-password': 'E-mail ou senha incorretos. Verifique seus dados.',
  'auth/invalid-credential': 'E-mail ou senha incorretos. Verifique seus dados.',
  'auth/email-already-in-use': 'Já existe uma conta cadastrada com este e-mail. Faça login.',
  'auth/weak-password': 'A senha deve conter no mínimo 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas sem sucesso. Aguarde alguns minutos antes de tentar novamente.',
  'auth/popup-closed-by-user': 'Autenticação com o Google cancelada. Tente novamente.',
  'auth/popup-blocked': 'A janela de autenticação foi bloqueada pelo navegador. Permita pop-ups para continuar.',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique sua rede e tente novamente.',
  'auth/requires-recent-login': 'Esta operação requer autenticação recente. Faça login novamente.',
  'auth/operation-not-allowed': 'Este método de autenticação não está ativado no Firebase Console.',
};

/**
 * Retorna mensagem de erro em português para qualquer código do Firebase Auth ou erro genérico.
 */
export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return 'Ocorreu um erro inesperado. Tente novamente.';

  const code = error.code || (typeof error === 'string' ? error : '');
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  // Se for mensagem genérica do Firebase com código embutido
  for (const [key, message] of Object.entries(AUTH_ERROR_MESSAGES)) {
    if (typeof error.message === 'string' && error.message.includes(key)) {
      return message;
    }
  }

  return error.message || 'Não foi possível completar a operação de autenticação. Tente novamente.';
}
