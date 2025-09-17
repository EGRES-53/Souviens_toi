import React from 'react';

const TimelinePagePublic: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-serif text-primary-800 mb-4">
            🎉 Timeline Publique Fonctionnelle !
          </h1>
          <p className="text-lg text-neutral-600">
            Cette page est accessible sans connexion - Test réussi !
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
            <div className="text-2xl font-bold text-primary-600 mb-1">6</div>
            <div className="text-sm text-neutral-600">Événements</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
            <div className="text-2xl font-bold text-primary-600 mb-1">74</div>
            <div className="text-sm text-neutral-600">Années d'Histoire</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
            <div className="text-2xl font-bold text-primary-600 mb-1">3</div>
            <div className="text-sm text-neutral-600">Générations</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
            <div className="text-2xl font-bold text-primary-600 mb-1">12</div>
            <div className="text-sm text-neutral-600">Photos</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 border border-primary-100">
          <h2 className="text-2xl font-bold font-serif text-primary-800 mb-6">
            Chronologie Familiale
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-4 h-4 bg-primary-600 rounded-full mt-2 mr-4"></div>
              <div className="flex-grow">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-bold text-primary-800 mb-2">🎉 Naissance de Grand-père Pierre</h3>
                  <p className="text-sm text-primary-600 mb-2">15 mars 1950 • Lyon, France</p>
                  <p className="text-neutral-700">Naissance de Pierre Dupont, qui deviendra le patriarche de notre famille.</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-4 h-4 bg-primary-600 rounded-full mt-2 mr-4"></div>
              <div className="flex-grow">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-bold text-primary-800 mb-2">💒 Mariage de Pierre et Marie</h3>
                  <p className="text-sm text-primary-600 mb-2">20 juin 1975 • Église Saint-Jean, Lyon</p>
                  <p className="text-neutral-700">Union de Pierre Dupont et Marie Martin, marquant le début de notre lignée.</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-4 h-4 bg-primary-600 rounded-full mt-2 mr-4"></div>
              <div className="flex-grow">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-bold text-primary-800 mb-2">👶 Ma naissance</h3>
                  <p className="text-sm text-primary-600 mb-2">22 avril 2008 • Paris, France</p>
                  <p className="text-neutral-700">Ma naissance à l'hôpital Saint-Antoine, nouvelle génération de la famille.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
              ✨ Prêt à créer ta propre chronologie ?
            </h3>
            <p className="text-neutral-700 mb-6">
              Crée ton compte gratuit et commence à préserver l'histoire de ta famille !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                🚀 Commencer Gratuitement
              </a>
              <a 
                href="/login"
                className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-medium border-2 border-primary-600 hover:bg-primary-50 transition-colors"
              >
                🔑 J'ai déjà un compte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePagePublic;
