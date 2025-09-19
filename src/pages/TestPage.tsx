import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { 
  TestTube, 
  Database, 
  Users, 
  Calendar, 
  Image, 
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  RefreshCw
} from 'lucide-react';
import Button from '../components/ui/Button';
import { 
  createTestUser, 
  signInTestUser, 
  createSampleEvents, 
  createSampleStories,
  runFullTest,
  cleanupTestData,
  checkEmailExists,
  listAllUsers
} from '../utils/testData';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

const TestPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { ...t, status, message, details } : t);
      } else {
        return [...prev, { name, status, message, details }];
      }
    });
  };

  const runDatabaseTest = async () => {
    updateTest('Database Connection', 'running', 'Test de connexion...');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      
      updateTest('Database Connection', 'success', 'Connexion réussie à Supabase');
    } catch (error: any) {
      updateTest('Database Connection', 'error', `Erreur: ${error.message}`);
    }
  };

  const runAuthTest = async () => {
    updateTest('Authentication', 'running', 'Test d\'authentification...');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        updateTest('Authentication', 'success', `Utilisateur connecté: ${user.email}`);
      } else {
        updateTest('Authentication', 'success', 'Aucun utilisateur connecté (normal)');
      }
    } catch (error: any) {
      updateTest('Authentication', 'error', `Erreur: ${error.message}`);
    }
  };

  const runTablesTest = async () => {
    updateTest('Tables Structure', 'running', 'Vérification des tables...');
    
    try {
      const tables = ['profiles', 'events', 'media', 'stories'];
      const results = [];
      
      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          if (error) throw error;
          results.push(`${table}: ${count || 0} enregistrements`);
        } catch (error: any) {
          results.push(`${table}: ERREUR - ${error.message}`);
        }
      }
      
      updateTest('Tables Structure', 'success', 'Tables vérifiées', results);
    } catch (error: any) {
      updateTest('Tables Structure', 'error', `Erreur: ${error.message}`);
    }
  };

  const runStorageTest = async () => {
    updateTest('Storage', 'running', 'Test du stockage...');
    
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) throw error;
      
      const mediaBucket = buckets.find(b => b.name === 'media');
      const avatarsBucket = buckets.find(b => b.name === 'avatars');
      
      const results = [
        `Bucket media: ${mediaBucket ? '✅ Existe' : '❌ Manquant'}`,
        `Bucket avatars: ${avatarsBucket ? '✅ Existe' : '❌ Manquant'}`
      ];
      
      updateTest('Storage', 'success', 'Stockage vérifié', results);
    } catch (error: any) {
      updateTest('Storage', 'error', `Erreur: ${error.message}`);
    }
  };

  const runTestUserCreation = async () => {
    updateTest('Test User Creation', 'running', 'Création d\'utilisateur test...');
    
    try {
      const result = await createTestUser();
      updateTest('Test User Creation', result.success ? 'success' : 'error', result.message);
    } catch (error: any) {
      updateTest('Test User Creation', 'error', `Erreur: ${error.message}`);
    }
  };

  const runSampleDataCreation = async () => {
    updateTest('Sample Data', 'running', 'Création de données d\'exemple...');
    
    try {
      const eventsResult = await createSampleEvents();
      const storiesResult = await createSampleStories();
      
      const success = eventsResult.success && storiesResult.success;
      const message = `Événements: ${eventsResult.message}, Récits: ${storiesResult.message}`;
      
      updateTest('Sample Data', success ? 'success' : 'error', message);
    } catch (error: any) {
      updateTest('Sample Data', 'error', `Erreur: ${error.message}`);
    }
  };

  const runEmailCheck = async () => {
    updateTest('Email Check', 'running', 'Vérification des emails...');
    
    try {
      const result = await checkEmailExists('test@souviens-toi.fr');
      updateTest('Email Check', 'success', result.message, result.details);
    } catch (error: any) {
      updateTest('Email Check', 'error', `Erreur: ${error.message}`);
    }
  };

  const runUsersList = async () => {
    updateTest('Users List', 'running', 'Liste des utilisateurs...');
    
    try {
      const result = await listAllUsers();
      updateTest('Users List', result.success ? 'success' : 'error', result.message, result.details);
    } catch (error: any) {
      updateTest('Users List', 'error', `Erreur: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);
    
    try {
      await runDatabaseTest();
      await runAuthTest();
      await runTablesTest();
      await runStorageTest();
      await runEmailCheck();
      await runUsersList();
      
      showToast('Tous les tests terminés', 'success');
    } catch (error) {
      showToast('Erreur lors des tests', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const runFullTestSuite = async () => {
    setIsRunning(true);
    updateTest('Full Test Suite', 'running', 'Exécution du test complet...');
    
    try {
      const result = await runFullTest();
      updateTest('Full Test Suite', result.success ? 'success' : 'error', result.message, result.details);
      showToast(result.message, result.success ? 'success' : 'error');
    } catch (error: any) {
      updateTest('Full Test Suite', 'error', `Erreur: ${error.message}`);
      showToast('Erreur lors du test complet', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const cleanupTests = async () => {
    updateTest('Cleanup', 'running', 'Nettoyage des données de test...');
    
    try {
      const result = await cleanupTestData();
      updateTest('Cleanup', result.success ? 'success' : 'error', result.message);
      showToast(result.message, result.success ? 'success' : 'error');
    } catch (error: any) {
      updateTest('Cleanup', 'error', `Erreur: ${error.message}`);
      showToast('Erreur lors du nettoyage', 'error');
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <TestTube className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary-800">
              🧪 Page de Tests - SOUVIENS_TOI
            </h1>
            <p className="text-neutral-600">
              Tests et diagnostics de l'application de chronologie familiale
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-vintage p-6 mb-8 border border-primary-100">
          <h2 className="text-xl font-serif font-bold text-primary-800 mb-4">
            👤 Informations Utilisateur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-700">État de connexion:</p>
              <p className="text-lg">{currentUser ? '✅ Connecté' : '❌ Non connecté'}</p>
            </div>
            {currentUser && (
              <>
                <div>
                  <p className="text-sm font-medium text-neutral-700">Email:</p>
                  <p className="text-lg">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-700">ID Utilisateur:</p>
                  <p className="text-sm font-mono">{currentUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-700">Créé le:</p>
                  <p className="text-lg">{new Date(currentUser.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-vintage p-6 mb-8 border border-primary-100">
          <h2 className="text-xl font-serif font-bold text-primary-800 mb-4">
            🎮 Contrôles de Test
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              variant="primary"
              icon={<Play size={18} />}
            >
              Tests Système
            </Button>
            <Button
              onClick={runFullTestSuite}
              disabled={isRunning}
              variant="outline"
              icon={<TestTube size={18} />}
            >
              Test Complet
            </Button>
            <Button
              onClick={runTestUserCreation}
              disabled={isRunning}
              variant="outline"
              icon={<Users size={18} />}
            >
              Utilisateur Test
            </Button>
            <Button
              onClick={cleanupTests}
              disabled={isRunning}
              variant="outline"
              icon={<RefreshCw size={18} />}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Nettoyer
            </Button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-vintage border border-primary-100">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-serif font-bold text-primary-800">
              📊 Résultats des Tests
            </h2>
          </div>
          <div className="p-6">
            {tests.length === 0 ? (
              <div className="text-center py-8">
                <TestTube className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">Aucun test exécuté</p>
                <p className="text-sm text-neutral-500">Cliquez sur un bouton ci-dessus pour commencer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-neutral-800">{test.name}</h3>
                      {getStatusIcon(test.status)}
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{test.message}</p>
                    {test.details && (
                      <div className="bg-neutral-50 rounded p-3 mt-2">
                        <pre className="text-xs text-neutral-700 whitespace-pre-wrap">
                          {typeof test.details === 'string' 
                            ? test.details 
                            : Array.isArray(test.details)
                            ? test.details.join('\n')
                            : JSON.stringify(test.details, null, 2)
                          }
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 rounded-lg p-6">
          <div className="text-center">
            <TestTube className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
              🔧 Actions Rapides
            </h3>
            <p className="text-neutral-700 mb-6">
              Outils de diagnostic et de test pour SOUVIENS_TOI
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={runDatabaseTest}
                disabled={isRunning}
                className="flex items-center justify-center px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                <Database className="h-4 w-4 mr-2" />
                Base de Données
              </button>
              <button
                onClick={runAuthTest}
                disabled={isRunning}
                className="flex items-center justify-center px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Authentification
              </button>
              <button
                onClick={runTablesTest}
                disabled={isRunning}
                className="flex items-center justify-center px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Tables
              </button>
              <button
                onClick={runStorageTest}
                disabled={isRunning}
                className="flex items-center justify-center px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                <Image className="h-4 w-4 mr-2" />
                Stockage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
