import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { BookOpen, Plus, Calendar, User, Search } from 'lucide-react';
import Button from '../components/ui/Button';

interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  profiles?: {
    full_name: string;
  };
}

const StoriesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchStories();
    }
  }, [currentUser]);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('created_by', currentUser?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      showToast('Erreur lors du chargement des récits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3e9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold font-serif text-primary-800 mb-2">
              📖 Tes Récits et Anecdotes
            </h1>
            <p className="text-neutral-600">
              Préserve tes histoires et traditions familiales pour les générations futures
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Link to="/stories/add">
              <Button variant="primary" icon={<Plus size={18} />}>
                Nouveau Récit
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher dans tes récits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100">
            <div className="text-2xl font-bold text-primary-600 mb-1">{stories.length}</div>
            <div className="text-sm text-neutral-600">Récits Écrits</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {stories.reduce((total, story) => total + story.content.split(' ').length, 0)}
            </div>
            <div className="text-sm text-neutral-600">Mots Écrits</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-vintage border border-primary-100">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {stories.length > 0 ? new Date().getFullYear() - new Date(Math.min(...stories.map(s => new Date(s.created_at).getTime()))).getFullYear() + 1 : 0}
            </div>
            <div className="text-sm text-neutral-600">Années Documentées</div>
          </div>
        </div>

        {/* Stories List */}
        <div className="bg-white rounded-lg shadow-vintage border border-primary-100">
          {filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">
                {searchTerm ? 'Aucun récit trouvé' : 'Commence ton premier récit'}
              </h3>
              <p className="text-neutral-600 mb-6">
                {searchTerm 
                  ? 'Essaie avec d\'autres mots-clés'
                  : 'Raconte les histoires de ta famille, tes souvenirs d\'enfance, les traditions familiales...'
                }
              </p>
              {!searchTerm && (
                <Link to="/stories/add">
                  <Button variant="primary" icon={<Plus size={18} />}>
                    Écrire mon Premier Récit
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredStories.map((story) => (
                <div key={story.id} className="p-6 hover:bg-primary-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
                      {story.title}
                    </h3>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(story.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <p className="text-neutral-700 mb-4 line-clamp-3">
                    {story.content.substring(0, 200)}
                    {story.content.length > 200 && '...'}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-neutral-500">
                      <User className="h-4 w-4 mr-1" />
                      {story.profiles?.full_name || 'Utilisateur'}
                    </div>
                    <Link to={`/story/${story.id}`}>
                      <Button variant="outline" size="sm">
                        Lire la Suite
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {stories.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
                ✨ Continue à enrichir ton héritage familial
              </h3>
              <p className="text-neutral-700 mb-6">
                Chaque récit que tu écris préserve un morceau précieux de l'histoire de ta famille
              </p>
              <Link to="/stories/add">
                <Button variant="primary" icon={<Plus size={18} />}>
                  Écrire un Nouveau Récit
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;

