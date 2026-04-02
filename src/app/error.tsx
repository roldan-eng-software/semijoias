'use client';
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
