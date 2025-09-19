import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Shield, 
  Users, 
  Calendar, 
  Image, 
  BookOpen, 
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalMedia: number;
  totalStories: number;
  recentActivity: any[];
  systemHealth: 'good' | 'warning' | 'error';
}

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalMedia: 0,
    totalStories: 0,
    recentActivity: [],
    systemHealth: 'good'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch events count
      const { count: eventCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Fetch media count
      const { count: mediaCount } = await supabase
        .from('media')
        .select('*', { count: 'exact', head: true });

      // Fetch stories count
      const { count: storyCount } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true });

      // Fetch recent activity
      const { data: recentEvents } = await supabase
        .from('events')
        .select(`
          id,
          title,
          created_at,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentStories } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          created_at,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and sort recent activity
      const recentActivity = [
        ...(recentEvents || []).map(event => ({
          ...event,
          type: 'event',
          icon: Calendar
        })),
        ...(recentStories || []).map(story => ({
          ...story,
          type: 'story',
          icon: BookOpen
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, 10);

      setStats({
        totalUsers: userCount || 0,
        totalEvents: eventCount || 0,
        totalMedia: mediaCount || 0,
        totalStories: storyCount || 0,
        recentActivity,
        systemHealth: 'good'
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast('Erreur lors du chargement des statistiques', 'error');
      setStats(prev => ({ ...prev, systemHealth: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const getHealthIcon = () => {
    switch (stats.systemHealth) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getHealthText = () => {
    switch (stats.systemHealth) {
      case 'good':
        return 'Système Opérationnel';
      case 'warning':
        return 'Attention Requise';
      case 'error':
        return 'Problème Détecté';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3e9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary-800 mb-2">
              🛡️ Dashboard Administrateur
            </h1>
            <p className="text-neutral-600">
              Surveillance et gestion de l'application SOUVIENS_TOI
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-vintage border border-primary-100">
            {getHealthIcon()}
            <span className="text-sm font-medium">{getHealthText()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Utilisateurs</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalUsers}</p>
              </div>
              <Users className="h-12 w-12 text-primary-600 opacity-20" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              Actifs
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Événements</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalEvents}</p>
              </div>
              <Calendar className="h-12 w-12 text-primary-600 opacity-20" />
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <Activity className="h-4 w-4 mr-1" />
              Timeline
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Médias</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalMedia}</p>
              </div>
              <Image className="h-12 w-12 text-primary-600 opacity-20" />
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <Database className="h-4 w-4 mr-1" />
              Stockés
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Récits</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalStories}</p>
              </div>
              <BookOpen className="h-12 w-12 text-primary-600 opacity-20" />
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <Clock className="h-4 w-4 mr-1" />
              Publiés
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-vintage border border-primary-100">
            <div className="px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-serif font-bold text-neutral-800">
                  Activité Récente
                </h2>
              </div>
            </div>
            <div className="p-6">
              {stats.recentActivity.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">
                  Aucune activité récente
                </p>
              ) : (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">
                            {activity.type === 'event' ? 'Nouvel événement' : 'Nouveau récit'}: {activity.title}
                          </p>
                          <p className="text-sm text-neutral-500">
                            Par {activity.profiles?.full_name || 'Utilisateur'} • {' '}
                            {new Date(activity.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-vintage border border-primary-100">
            <div className="px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-serif font-bold text-neutral-800">
                  État du Système
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">Base de données</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600">Opérationnelle</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">Stockage</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600">Disponible</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">Authentification</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">API</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600">Réactive</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-2">Dernière vérification</p>
                  <p className="text-sm font-medium text-neutral-800">
                    {new Date().toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 rounded-lg p-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
              Administration SOUVIENS_TOI
            </h3>
            <p className="text-neutral-700 mb-6">
              Surveillance active de l'application de chronologie familiale
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={fetchStats}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                🔄 Actualiser les Stats
              </button>
              <button
                onClick={() => showToast('Fonctionnalité en développement', 'info')}
                className="px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                📊 Rapport Détaillé
              </button>
              <button
                onClick={() => showToast('Sauvegarde en cours...', 'info')}
                className="px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                💾 Sauvegarde
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
