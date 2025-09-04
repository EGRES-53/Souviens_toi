import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import { 
  Play, 
  User, 
  Calendar, 
  BookOpen, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Database,
  TestTube
} from 'lucide-react';
import {
  createTestUser,
  signInTestUser,
  createSampleEvents,
  createSampleStories,
  runFullTest,
  cleanupTestData,
  checkEmailExists,
  listAllUsers,
  TEST_USER
} from '../utils/testData';

const TestPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [emailToCheck, setEmailToCheck] = useState('');
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [testResults, setTestResults] = useState<{
    user?: { success: boolean; message: string };
    events?: { success: boolean; message: string; count?: number };
    stories?: { success: boolean; message: string; count?: number };
    fullTest?: { success: boolean; message: string; details: string[] };
  }>({});

  const handleCreateTestUser = async () => {
    setLoading('user');
    try {
      const result = await createTestUser();
      setTestResults(prev => ({ ...prev, user: result }));
      showToast(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showToast('Erreur lors de la création de l\'utilisateur test', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleSignInTestUser = async () => {
    setLoading('signin');
    try {
      const result = await signInTestUser();
      showToast(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showToast('Erreur lors de la connexion', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleCreateSampleEvents = async () => {
    setLoading('events');
    try {
      const result = await createSampleEvents();
      setTestResults(prev => ({ ...prev, events: result }));
      showToast(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showToast('Erreur lors de la création des événements', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleCreateSampleStories = async () => {
    setLoading('stories');
    try {
      const result = await createSampleStories();
      setTestResults(prev => ({ ...prev, stories: result }));
      showToast(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showToast('Erreur lors de la création des récits', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleRunFullTest = async () => {
    setLoading('fulltest');
    try {
      const result = await runFullTest();
      setTestResults(prev => ({ ...prev, fullTest: result }));
      showToast(result.message, result.success ? 'success' : 'warning');
    } catch (error) {
      showToast('Erreur lors du test complet', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleCleanup = async () => {
    setLoading('cleanup');
    try {
      const result = await cleanupTestData();
      showToast(result.message, result.success ? 'success' : 'error');
      if (result.success) {
        setTestResults({});
      }
    } catch (error) {
      showToast('Erreur lors du nettoyage', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleCheckEmail = async () => {
    if (!emailToCheck.trim()) {
      showToast('Veuillez entrer un email à vérifier', 'error');
      return;
    }
    
    setLoading('checkemail');
    try {
      const result = await checkEmailExists(emailToCheck.trim());
      setDiagnosticResults(result);
      showToast('Vérification terminée', result.success ? 'success' : 'error');
    } catch (error) {
      showToast('Erreur lors de la vérification', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleListAllUsers = async () => {
    setLoading('listusers');
    try {
      const result = await listAllUsers();
      setDiagnosticResults(result);
      showToast('Liste récupérée', result.success ? 'success' : 'error');
    } catch (error) {
      showToast('Erreur lors de la récupération', 'error');
    } finally {
      setLoading(null);
    }
  };

  const ResultIcon: React.FC<{ success?: boolean }> = ({ success }) => {
    if (success === undefined) return null;
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-800">
            <ArrowLeft size={18} className="mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-vintage p-6 sm:p-8 border border-primary-100">
          <div className="flex items-center mb-6">
            <TestTube className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold font-serif text-primary-800">
              Tests d'Authentification
            </h1>
          </div>

          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Informations de Test
            </h2>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>E-mail:</strong> {currentUser.email}</p>
              <p><strong>Mot de passe:</strong> {TEST_USER.password}</p>
              <p><strong>Nom:</strong> {TEST_USER.displayName}</p>
            </div>
          </div>

          {currentUser && (
            <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Utilisateur Connecté
              </h2>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>ID:</strong> {currentUser.id}</p>
              </div>
            </div>
          )}

          {/* Diagnostic Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary-600" />
              Diagnostic Base de Données
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Vérifier si un email existe
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={emailToCheck}
                    onChange={(e) => setEmailToCheck(e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCheckEmail}
                    isLoading={loading === 'checkemail'}
                  >
                    Vérifier
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Test rapide avec l'email problématique
                </label>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEmailToCheck('test.user.sdo53@bluewin.ch');
                    handleCheckEmail();
                  }}
                  isLoading={loading === 'checkemail'}
                  className="w-full"
                >
                  Tester test.user.sdo53@bluewin.ch
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={handleListAllUsers}
                  isLoading={loading === 'listusers'}
                  icon={<User size={16} />}
                  className="w-full"
                >
                  Lister tous les utilisateurs
                </Button>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDiagnosticResults(null);
                    setEmailToCheck('');
                  }}
                  className="w-full"
                >
                  Effacer les résultats
                </Button>
              </div>
            </div>
            
            {diagnosticResults && (
              <div className="mt-4 p-4 bg-neutral-50 rounded-lg border">
                <h4 className="font-semibold mb-2">Résultats du diagnostic:</h4>
                <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
                  {diagnosticResults.message}
                </pre>
                {diagnosticResults.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-primary-600">
                      Détails techniques
                    </summary>
                    <pre className="mt-2 text-xs text-neutral-600 whitespace-pre-wrap bg-white p-2 rounded border">
                      {JSON.stringify(diagnosticResults.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Test User Creation */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary-600" />
                  Utilisateur Test
                </h3>
                <ResultIcon success={testResults.user?.success} />
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Créer ou connecter l'utilisateur de test
              </p>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateTestUser}
                  isLoading={loading === 'user'}
                  icon={<User size={16} />}
                  className="w-full"
                >
                  Créer Utilisateur
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignInTestUser}
                  isLoading={loading === 'signin'}
                  icon={<User size={16} />}
                  className="w-full"
                >
                  Se Connecter
                </Button>
              </div>
              {testResults.user && (
                <p className={`text-xs mt-2 ${testResults.user.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.user.message}
                </p>
              )}
            </div>

            {/* Sample Events */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  Événements
                </h3>
                <ResultIcon success={testResults.events?.success} />
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Créer 6 événements d'exemple
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateSampleEvents}
                isLoading={loading === 'events'}
                icon={<Calendar size={16} />}
                className="w-full"
                disabled={!currentUser}
              >
                Créer Événements
              </Button>
              {testResults.events && (
                <p className={`text-xs mt-2 ${testResults.events.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.events.message}
                </p>
              )}
            </div>

            {/* Sample Stories */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
                  Récits
                </h3>
                <ResultIcon success={testResults.stories?.success} />
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Créer 3 récits d'exemple
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateSampleStories}
                isLoading={loading === 'stories'}
                icon={<BookOpen size={16} />}
                className="w-full"
                disabled={!currentUser}
              >
                Créer Récits
              </Button>
              {testResults.stories && (
                <p className={`text-xs mt-2 ${testResults.stories.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.stories.message}
                </p>
              )}
            </div>

            {/* Full Test */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <Play className="h-5 w-5 mr-2 text-primary-600" />
                  Test Complet
                </h3>
                <ResultIcon success={testResults.fullTest?.success} />
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Exécuter tous les tests automatiquement
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRunFullTest}
                isLoading={loading === 'fulltest'}
                icon={<Play size={16} />}
                className="w-full"
              >
                Lancer Test Complet
              </Button>
              {testResults.fullTest && (
                <div className="mt-2">
                  <p className={`text-xs ${testResults.fullTest.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.fullTest.message}
                  </p>
                  {testResults.fullTest.details && (
                    <ul className="text-xs text-neutral-600 mt-1 space-y-1">
                      {testResults.fullTest.details.map((detail, index) => (
                        <li key={index}>• {detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cleanup Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-700 flex items-center">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Nettoyage
                </h3>
                <p className="text-sm text-neutral-600">
                  Supprimer toutes les données de test créées
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleCleanup}
                isLoading={loading === 'cleanup'}
                icon={<Trash2 size={16} />}
                className="text-red-600 hover:bg-red-50"
                disabled={!currentUser}
              >
                Nettoyer
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Navigation Rapide</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/timeline" className="text-center p-3 border rounded-lg hover:bg-primary-50">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                <span className="text-sm">Chronologie</span>
              </Link>
              <Link to="/gallery" className="text-center p-3 border rounded-lg hover:bg-primary-50">
                <Database className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                <span className="text-sm">Galerie</span>
              </Link>
              <Link to="/stories" className="text-center p-3 border rounded-lg hover:bg-primary-50">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                <span className="text-sm">Récits</span>
              </Link>
              <Link to="/profile" className="text-center p-3 border rounded-lg hover:bg-primary-50">
                <User className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                <span className="text-sm">Profil</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;