import Link from 'next/link';
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
