import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            📚 SOUVIENS_TOI
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Préserve l'histoire de ta famille pour les générations futures. 
            Crée une chronologie interactive, partage des photos et raconte tes souvenirs.
          </p>
          
          {currentUser ? (
            <div className="space-y-4">
              <p className="text-lg text-green-600">
                ✅ Connecté en tant que {currentUser.email}
              </p>
              <Link 
                to="/timeline" 
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                📅 Voir ma Chronologie
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                to="/register" 
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                🚀 Commencer Gratuitement
              </Link>
              <Link 
                to="/login" 
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
              >
                🔑 Se Connecter
              </Link>
            </div>
          )}
        </div>
        
        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Chronologie Interactive</h3>
            <p className="text-gray-600">Organise les événements de ta famille par ordre chronologique</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">Photos & Documents</h3>
            <p className="text-gray-600">Sauvegarde tes précieux souvenirs et documents familiaux</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-semibold mb-2">Récits Familiaux</h3>
            <p className="text-gray-600">Raconte les histoires et anecdotes de ta famille</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
