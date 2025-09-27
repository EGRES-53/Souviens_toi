import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import { 
  Users, 
  Activity, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Calendar,
  BarChart3,
  Database,
  RefreshCw
} from 'lucide-react';

interface UserStats {
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string;
  email_confirmed_at: string;
  events_count: number;
  stories_count: number;
  media_count: number;
  status: 'active' | 'recent' | 'inactive';
}

interface SystemStats {
  total_users: number;
  total_events: number;
  total_stories: number;
  total_media: number;
  new_users_24h: number;
  active_users_24h: number;
}

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user statistics
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          created_at,
          updated_at
        `);

      if (usersError) throw usersError;

      // Get auth data for each user
      const userStatsPromises = users?.map(async (user) => {
        // Get events count
        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id);

        // Get stories count
        const { count: storiesCount } = await supabase
          .from('stories')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id);

        // Get media count
        const { count: mediaCount } = await supabase
          .from('media')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id);

        // Determine status based on activity
        const now = new Date();
        const createdAt = new Date(user.created_at);
        const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
        
        let status: 'active' | 'recent' | 'inactive' = 'inactive';
        if (daysSinceCreation <= 1) status = 'active';
        else if (daysSinceCreation <= 7) status = 'recent';

        return {
          email: `user-${user.id.substring(0, 8)}`, // Anonymized for privacy
          full_name: user.full_name || 'Utilisateur',
          created_at: user.created_at,
          last_sign_in_at: user.updated_at, // Using updated_at as proxy
          email_confirmed_at: user.created_at, // Assuming confirmed
          events_count: eventsCount || 0,
          stories_count: storiesCount || 0,
          media_count: mediaCount || 0,
          status
        };
      }) || [];

      const resolvedUserStats = await Promise.all(userStatsPromises);
      setUserStats(resolvedUserStats);

      // Calculate system statistics
      const totalUsers = users?.length || 0;
      const totalEvents = resolvedUserStats.reduce((sum, user) => sum + user.events_count, 0);
      const totalStories = resolvedUserStats.reduce((sum, user) => sum + user.stories_count, 0);
      const totalMedia = resolvedUserStats.reduce((sum, user) => sum + user.media_count, 0);
      
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const newUsers24h = resolvedUserStats.filter(user => 
        new Date(user.created_at) > yesterday
      ).length;
      
      const activeUsers24h = resolvedUserStats.filter(user => 
        user.status === 'active'
      ).length;

      setSystemStats({
        total_users: totalUsers,
        total_events: totalEvents,
        total_stories: totalStories,
        total_media: totalMedia,
        new_users_24h: newUsers24h,
        active_users_24h: activeUsers24h
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    showToast('Données actualisées', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'recent': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '🟢 Actif';
      case 'recent': return '🟡 Récent';
      case 'inactive': return '🔴 Inactif';
      default: return '⚪ Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary-800 mb-2">
              Dashboard Administrateur
            </h1>
            <p className="text-neutral-600">
              Surveillance et gestion familiale de SOUVIENS_TOI
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleRefresh}
            isLoading={refreshing}
            icon={<RefreshCw size={18} />}
          >
            Actualiser
          </Button>
        </div>

        {/* System Statistics */}
        {systemStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-vintage p-6 border border-primary-100">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-neutral-600">Membres Famille</p>
                  <p className="text-2xl font-bold text-neutral-900">{systemStats.total_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-vintage p-6 border border-primary-100">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-neutral-600">Événements</p>
                  <p className="text-2xl font-bold text-neutral-900">{systemStats.total_events}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-vintage p-6 border border-primary-100">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-neutral-600">Récits</p>
                  <p className="text-2xl font-bold text-neutral-900">{systemStats.total_stories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-vintage p-6 border border-primary-100">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-neutral-600">Actifs 24h</p>
                  <p className="text-2xl font-bold text-neutral-900">{systemStats.active_users_24h}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Alerts */}
        {systemStats && systemStats.new_users_24h > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                <strong>Alerte :</strong> {systemStats.new_users_24h} nouveau(x) membre(s) inscrit(s) dans les dernières 24h
              </p>
            </div>
          </div>
        )}

        {/* User Statistics Table */}
        <div className="bg-white rounded-lg shadow-vintage border border-primary-100">
          <div className="px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-serif font-bold text-neutral-800">
                Membres de la Famille
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Événements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Récits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Médias
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {userStats.map((user, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {user.events_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {user.stories_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {user.media_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-vintage p-6 border border-primary-100">
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-primary-600" />
              Surveillance
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Surveille l'activité familiale en temps réel
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Voir les Logs
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-vintage p-6 border border-primary-100">
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary-600" />
              Sauvegarde
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Crée une sauvegarde des données familiales
            </p>
            <Button variant="primary" size="sm" className="w-full">
              Backup Maintenant
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-vintage p-6 border border-primary-100">
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
              Rapports
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Génère des rapports d'activité détaillés
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              Générer Rapport
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;