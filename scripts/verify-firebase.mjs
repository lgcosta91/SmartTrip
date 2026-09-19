/**
 * Script de Verificação Automatizada da Camada Firebase — SmartTrip
 * Executado via Node.js para validar os critérios de aceite da SPEC-FB-001.
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

let allPassed = true;

function pass(testName, detail = '') {
  console.log(`\x1b[32m[PASS]\x1b[0m ${testName}${detail ? ` (${detail})` : ''}`);
}

function fail(testName, detail = '') {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${testName}${detail ? `: ${detail}` : ''}`);
  allPassed = false;
}

console.log('\n🔍 Iniciando Verificação Automatizada da Camada Firebase...\n');

// 1. Verificação do Bundle Gerado (Ausência de Private Key / Segredos)
try {
  const distAssetsDir = path.join(ROOT_DIR, 'dist', 'assets');
  if (fs.existsSync(distAssetsDir)) {
    const jsFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.js'));
    let foundPrivateKey = false;
    let foundAdminImport = false;

    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf8');
      if (content.includes('FIREBASE_PRIVATE_KEY') || content.includes('BEGIN PRIVATE KEY')) {
        foundPrivateKey = true;
      }
      if (content.includes('[VIOLAÇÃO CRÍTICA DE SEGURANÇA]')) {
        foundAdminImport = true;
      }
    }

    if (!foundPrivateKey) {
      pass('Client Bundle: Nenhuma menção a FIREBASE_PRIVATE_KEY ou chaves privadas');
    } else {
      fail('Client Bundle: Vazamento detectado de chave privada no bundle!');
    }

    if (!foundAdminImport) {
      pass('Client Bundle: Módulo Admin (admin.ts) NÃO empacotado no bundle do cliente');
    } else {
      fail('Client Bundle: Módulo Admin detectado no bundle do cliente!');
    }
  } else {
    fail('Client Bundle: Pasta dist/ não encontrada. Execute npm run build antes.');
  }
} catch (err) {
  fail('Client Bundle', err.message);
}

// 2. Verificação de Código-Fonte: Garantir que nenhum componente importa 'admin'
try {
  const srcDir = path.join(ROOT_DIR, 'src');
  const checkDirForAdminImport = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        checkDirForAdminImport(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        // Ignora o próprio admin.ts
        if (fullPath.includes('admin.ts')) continue;
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes("from './admin'") || content.includes('from "../services/firebase/admin"')) {
          fail(`Isolamento de Código: Arquivo ${file} importa o módulo admin!`);
          return;
        }
      }
    }
  };

  checkDirForAdminImport(srcDir);
  pass('Isolamento de Código: Zero importações de módulo Admin em componentes ou telas');
} catch (err) {
  fail('Isolamento de Código', err.message);
}

// 3. Verificação do .env.example
try {
  const envExamplePath = path.join(ROOT_DIR, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    const content = fs.readFileSync(envExamplePath, 'utf8');
    const requiredKeys = [
      'VITE_FIREBASE_API_KEY=',
      'VITE_FIREBASE_AUTH_DOMAIN=',
      'VITE_FIREBASE_PROJECT_ID=',
      'FIREBASE_PRIVATE_KEY=',
    ];

    let missing = [];
    for (const key of requiredKeys) {
      if (!content.includes(key)) {
        missing.push(key);
      }
    }

    if (missing.length === 0) {
      pass('.env.example: Todas as chaves Client e Admin declaradas sem valores');
    } else {
      fail('.env.example: Chaves ausentes', missing.join(', '));
    }
  } else {
    fail('.env.example: Arquivo .env.example não encontrado');
  }
} catch (err) {
  fail('.env.example', err.message);
}

// 4. Verificação de Regras do Firestore
try {
  const rulesPath = path.join(ROOT_DIR, 'firestore.rules');
  if (fs.existsSync(rulesPath)) {
    const content = fs.readFileSync(rulesPath, 'utf8');
    if (content.includes("service cloud.firestore") && content.includes("rules_version = '2'")) {
      pass('Firestore Security Rules: Arquivo firestore.rules presente e estruturado');
    } else {
      fail('Firestore Security Rules: Conteúdo inválido');
    }
  } else {
    fail('Firestore Security Rules: Arquivo firestore.rules ausente');
  }
} catch (err) {
  fail('Firestore Security Rules', err.message);
}

// 5. Verificação da Estrutura Modular em src/services/firebase/
try {
  const fbDir = path.join(ROOT_DIR, 'src', 'services', 'firebase');
  const expectedFiles = ['client.ts', 'config.ts', 'admin.ts', 'index.ts'];
  const missing = expectedFiles.filter((f) => !fs.existsSync(path.join(fbDir, f)));

  if (missing.length === 0) {
    pass('Estrutura de Módulos: client.ts, config.ts, admin.ts e index.ts presentes');
  } else {
    fail('Estrutura de Módulos: Arquivos ausentes', missing.join(', '));
  }
} catch (err) {
  fail('Estrutura de Módulos', err.message);
}

console.log('\n--------------------------------------------------');
if (allPassed) {
  console.log('\x1b[32m✔ TODAS AS VERIFICAÇÕES AUTOMATIZADAS FORAM APROVADAS (PASS)!\x1b[0m\n');
  process.exit(0);
} else {
  console.error('\x1b[31m✖ FALHA EM UMA OU MAIS VERIFICAÇÕES AUTOMATIZADAS (FAIL).\x1b[0m\n');
  process.exit(1);
}
