/**
 * Inicialização do Firebase Admin SDK — SmartTrip (EXCLUSIVAMENTE SERVER-SIDE)
 * 
 * DIRETRIZES DE SEGURANÇA (SPEC-FB-001):
 * 1. Este módulo NUNCA deve ser importado por componentes ou módulos executados no navegador.
 * 2. As credenciais da Conta de Serviço (FIREBASE_PRIVATE_KEY) nunca trafegam para o bundle do cliente.
 * 3. Utilizado apenas em Server Actions, Route Handlers do Next.js ou scripts de backend Node.js.
 */

// Trava de segurança imediata para prevenir importação acidental no client bundle
if (typeof window !== 'undefined') {
  throw new Error(
    '[VIOLAÇÃO CRÍTICA DE SEGURANÇA] O módulo Firebase Admin SDK não pode ser executado no navegador! ' +
    'Certifique-se de que este módulo é importado exclusivamente em contextos server-side.'
  );
}

export interface AdminCredentialsConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/**
 * Valida se as variáveis de ambiente necessárias para o Admin SDK estão configuradas.
 */
export function getFirebaseAdminConfig(): AdminCredentialsConfig {
  const projectId = process.env.FIREBASE_PROJECT_ID || '';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
  const privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

  const missing: string[] = [];
  if (!projectId) missing.push('FIREBASE_PROJECT_ID');
  if (!clientEmail) missing.push('FIREBASE_CLIENT_EMAIL');
  if (!privateKey) missing.push('FIREBASE_PRIVATE_KEY');

  if (missing.length > 0) {
    throw new Error(
      `[SmartTrip Firebase Admin Error] Credenciais da Service Account ausentes:\n` +
      missing.map((k) => ` - ${k}`).join('\n') +
      `\n\nConfigure essas variáveis de ambiente no servidor ou na Vercel (escopo restrito ao backend).`
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

/**
 * Singleton conceitual para o Firebase Admin SDK no servidor.
 */
let adminAppInstance: any = null;

export function getAdminApp() {
  if (adminAppInstance) {
    return adminAppInstance;
  }

  const config = getFirebaseAdminConfig();
  
  // Em ambiente server-side com firebase-admin instalado:
  // admin.initializeApp({ credential: admin.credential.cert(config) })
  adminAppInstance = {
    name: '[DEFAULT_ADMIN]',
    options: { projectId: config.projectId },
    isInitialized: true,
  };

  return adminAppInstance;
}
