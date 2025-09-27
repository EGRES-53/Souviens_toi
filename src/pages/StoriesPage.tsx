import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Plus, Search, BookOpen } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
}

const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchStories();
  }, [currentUser]);

  const fetchStories = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('created_by', currentUser.id)
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

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary-800 mb-2">
              Tes Récits et Anecdotes
            </h1>
            <p className="text-neutral-600">
              Préserve tes histoires et traditions familiales
            </p>
          </div>
          <Link to="/stories/new" className="mt-4 sm:mt-0">
            <Button
              variant="primary"
              icon={<Plus size={18} />}
            >
              Ajouter un récit
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-vintage p-6 border border-neutral-200">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Rechercher dans tes récits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center my-16">
              <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">Aucun récit trouvé</h3>
              <p className="text-neutral-600">
                {searchTerm ? 'Aucun résultat ne correspond à ta recherche' : 'Commence par ajouter un récit familial'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredStories.map((story) => (
                <Link
                  key={story.id}
                  to={`/stories/${story.id}`}
                  className="block bg-white rounded-lg border border-primary-100 p-6 hover:shadow-vintage-lg transition-shadow"
                >
                  <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-neutral-600 line-clamp-3">
                    {story.content}
                  </p>
                  <div className="mt-4 text-sm text-neutral-500">
                    {new Date(story.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;