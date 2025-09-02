import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Menu, X, User, Baseline as Timeline, Image, LogOut, Home, Database, BookOpen, TestTube, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Vous avez été déconnecté avec succès', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Erreur lors de la déconnexion', 'error');
    }
  };

  const handleSupabaseConnect = async () => {
    try {
      console.log('Testing Supabase connection...');
      console.log('Supabase URL:', supabase.supabaseUrl);
      console.log('Project reference:', supabase.supabaseUrl.split('.')[0].split('//')[1]);
      
      const { data, error } = await supabase.from('events').select('*').limit(1);
      
      if (error) {
        console.error('Supabase connection error:', error);
        showToast(`Erreur de connexion Supabase: ${error.message}. Vérifiez votre configuration .env`, 'error');
        return;
      }
      
      const projectRef = supabase.supabaseUrl.split('.')[0].split('//')[1];
      showToast(`Connexion Supabase établie avec succès! Projet: ${projectRef}`, 'success');
    } catch (error) {
      console.error('Supabase connection failed:', error);
      showToast('Erreur de connexion Supabase. Vérifiez votre configuration.', 'error');
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-serif text-2xl font-bold text-primary-600">
                SOUVIENS_TOI
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleSupabaseConnect}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Database className="h-4 w-4 mr-2" />
              Connect to Supabase
            </button>

            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary-600"
            >
              Accueil
            </Link>
            
            <Link 
              to="/timeline" 
              className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary-600"
            >
              Chronologie
            </Link>
            
            <Link 
              to="/gallery" 
              className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary-600"
            >
              Galerie
            </Link>

            <Link 
              to="/stories" 
              className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary-600"
            >
              Récits
            </Link>

            <Link 
              to="/admin" 
              className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary-600"
            >
              Admin
            </Link>

            <Link 
              to="/test" 
              className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary-600"
            >
              Tests
            </Link>

            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary-600"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">{isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={handleSupabaseConnect}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Database className="h-5 w-5 mr-2" />
              Connect to Supabase
            </button>

            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Accueil
              </div>
            </Link>
            
            <Link 
              to="/timeline" 
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Timeline className="mr-2 h-5 w-5" />
                Chronologie
              </div>
            </Link>
            
            <Link 
              to="/gallery" 
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Image className="mr-2 h-5 w-5" />
                Galerie
              </div>
            </Link>

            <Link 
              to="/stories" 
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Récits
              </div>
            </Link>

            <Link 
              to="/admin" 
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Admin
              </div>
            </Link>

            <Link 
              to="/test" 
              className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <TestTube className="mr-2 h-5 w-5" />
                Tests
              </div>
            </Link>

            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profil
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;