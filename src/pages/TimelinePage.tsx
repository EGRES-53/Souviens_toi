import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const TimelinePage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔒 Accès Restreint
          </h2>
          <p className="text-gray-600 mb-6">
            Tu dois être connecté pour voir ta chronologie familiale
          </p>
          <Link 
            to="/login" 
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Se Connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📅 Ma Chronologie Familiale
          </h1>
          <p className="text-gray-600">
            Bienvenue {currentUser.email} ! Voici l'histoire de ta famille.
          </p>
        </div>

        {/* Timeline Demo */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-8">
            {/* Événement 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">1950</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">Naissance de Grand-père Pierre</h3>
                <p className="text-gray-600 mt-1">15 mars 1950 - Lyon, France</p>
                <p className="text-gray-700 mt-2">
                  Naissance de Pierre Dupont, qui deviendra plus tard le patriarche de notre famille.
                </p>
              </div>
            </div>

            {/* Événement 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">1975</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">Mariage de Pierre et Marie</h3>
                <p className="text-gray-600 mt-1">20 juin 1975 - Église Saint-Jean, Lyon</p>
                <p className="text-gray-700 mt-2">
                  Union de Pierre Dupont et Marie Martin, marquant le début de notre lignée familiale.
                </p>
              </div>
            </div>

            {/* Événement 3 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">2000</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">Naissance de la nouvelle génération</h3>
                <p className="text-gray-600 mt-1">Années 2000 - Continuation de l'héritage</p>
                <p className="text-gray-700 mt-2">
                  Les petits-enfants arrivent, perpétuant les traditions familiales.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                🚧 Fonctionnalité en Développement
              </h3>
              <p className="text-amber-700">
                Bientôt tu pourras ajouter tes propres événements, photos et récits !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
