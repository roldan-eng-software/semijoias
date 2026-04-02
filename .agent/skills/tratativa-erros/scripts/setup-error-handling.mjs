import fs from 'fs';
import path from 'path';

const isNextProject = fs.existsSync('package.json');
if (!isNextProject) {
  console.error("❌ Erro: Execute este comando na raiz de um projeto Next.js.");
  process.exit(1);
}

const baseDir = fs.existsSync('src') ? 'src' : '.';
const appDir = path.join(baseDir, 'app');
const libDir = path.join(baseDir, 'lib');

// Create directories if they don't exist
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });
if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });

// 1. Logger Utility
const loggerPath = path.join(libDir, 'logger.ts');
const loggerContent = `export const logger = {
  error: (message: string, error?: any) => {
    const isDev = process.env.NODE_ENV === 'development';
    console.error(\`[ERROR] \${message}\`);
    if (isDev && error) {
      console.error(error);
    }
  },
  info: (message: string) => {
    console.log(\`[INFO] \${message}\`);
  }
};
`;

// 2. Error Page
const errorPath = path.join(appDir, 'error.tsx');
const errorContent = `'use client';
import { useEffect } from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in duration-500">
      <div className="card w-full max-w-md bg-base-200 shadow-xl border-t-4 border-error">
        <div className="card-body items-center text-center">
          <div className="p-3 bg-error/10 rounded-full text-error mb-2">
            <AlertCircle size={48} />
          </div>
          <h2 className="card-title text-2xl font-bold">Algo deu errado!</h2>
          <p className="text-base-content/70">
            Encontramos um problema técnico ao carregar esta página. Nossa equipe já foi notificada.
          </p>
          <div className="card-actions mt-6">
            <button 
              onClick={() => reset()} 
              className="btn btn-error btn-outline gap-2"
            >
              <RefreshCcw size={18} />
              Tentar Novamente
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-base-300 rounded text-xs text-left w-full overflow-auto max-h-32">
              <code className="text-secondary">{error.message}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;

// 3. Not Found Page
const notFoundPath = path.join(appDir, 'not-found.tsx');
const notFoundContent = `import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="hero min-h-[70vh] bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          <h2 className="text-3xl font-bold mt-[-40px]">Página não encontrada</h2>
          <p className="py-6 text-base-content/70">
            A página que você está procurando pode ter sido removida ou o endereço está incorreto.
          </p>
          <Link href="/" className="btn btn-primary gap-2">
            <Home size={18} />
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

// 4. Global Error Page
const globalErrorPath = path.join(appDir, 'global-error.tsx');
const globalErrorContent = `'use client';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-base-100 text-base-content">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Erro Crítico de Sistema</h2>
            <p className="mb-8">Um erro fatal interrompeu a aplicação.</p>
            <button className="btn btn-primary" onClick={() => reset()}>Recarregar App</button>
          </div>
        </div>
      </body>
    </html>
  );
}
`;

function writeFile(filePath, content) {
  if (fs.existsSync(filePath)) {
    console.log(`⚠️ Ignorado: ${filePath} já existe.`);
  } else {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Criado: ${filePath}`);
  }
}

console.log("🚀 Iniciando configuração de tratativa de erros...");
writeFile(loggerPath, loggerContent);
writeFile(errorPath, errorContent);
writeFile(notFoundPath, notFoundContent);
writeFile(globalErrorPath, globalErrorContent);
console.log("✨ Sistema de erros configurado com sucesso!");
