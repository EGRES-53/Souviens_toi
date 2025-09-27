import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Image, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-100 bg-paper-texture py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary-800 mb-6">
              Souvenirs préservés de ta famille
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto mb-8">
              SOUVIENS_TOI est une application qui te permet de documenter, d'organiser et de partager l'histoire de ta famille
            </p>
            {currentUser ? (
              <Link to="/timeline" className="btn btn-primary text-lg px-8 py-3">
                Chronologie
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                  Commence Gratuitement
                </Link>
                <Link to="/login" className="btn btn-outline text-lg px-8 py-3">
                  Se Connecter
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold font-serif text-center text-primary-800 mb-12">
            Fonctionnalités Principales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link 
              to="/timeline" 
              className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100 hover:shadow-vintage-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <Clock className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-3">Chronologie Interactive</h3>
              <p className="text-neutral-600 text-center">
                Visualise l'histoire de ta famille par une chronologie interactive (XVIe siècle à nos jours).
              </p>
            </Link>
            
            <Link 
              to="/gallery" 
              className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100 hover:shadow-vintage-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <Image className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-3">Galerie Multimédia</h3>
              <p className="text-neutral-600 text-center">
                Stocke et organise tes photos, documents et autres médias liés à l'histoire de ta famille.
              </p>
            </Link>
            
            <Link 
              to="/stories" 
              className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100 hover:shadow-vintage-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-center mb-3">Récits et Anecdotes</h3>
              <p className="text-neutral-600 text-center">
                Documente les histoires et traditions familiales pour les préserver pour les générations futures.
              </p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-serif text-white mb-6">
            Commence à préserver Ton Histoire aujourd'hui
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-3xl mx-auto">
            Ne laisse pas les précieux souvenirs et histoires de ta famille s'estomper avec le temps. SOUVIENS_TOI t'aide à documenter et préserver ton héritage pour les générations futures.
          </p>
          {currentUser ? (
            <Link to="/timeline" className="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-3">
              Accéde à Ta Chronologie
            </Link>
          ) : (
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-3">
              Crée un Compte Gratuit
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;