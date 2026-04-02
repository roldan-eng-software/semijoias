'use client';
 
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
