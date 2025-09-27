import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-8xl font-serif font-bold text-primary-600">404</h1>
          <h2 className="mt-6 text-3xl font-serif font-bold text-neutral-800">
            Page non trouvée
          </h2>
          <p className="mt-2 text-neutral-600">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button variant="primary" icon={<Home size={18} />}>
              Retour à l'accueil
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="outline" icon={<ArrowLeft size={18} />}>
              Page précédente
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;