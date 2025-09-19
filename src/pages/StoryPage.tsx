import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import { ArrowLeft, Calendar, User, Edit, Trash2, BookOpen } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  profiles?: {
    full_name: string;
  };
}

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStory();
    }
  }, [id]);

  const fetchStory = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setStory(data);
    } catch (error) {
      console.error('Error fetching story:', error);
      showToast('Erreur lors du chargement du récit', 'error');
      navigate('/stories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!story || !currentUser || story.created_by !== currentUser.id) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce récit ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', story.id);

      if (error) throw error;

      showToast('Récit supprimé avec succès', 'success');
      navigate('/stories');
    } catch (error) {
      console.error('Error deleting story:', error);
      showToast('Erreur lors de la suppression du récit', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f3e9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-serif text-primary-800 mb-4">
            Récit non trouvé
          </h1>
          <p className="text-neutral-600 mb-6">
            Ce récit n'existe pas ou a été supprimé.
          </p>
          <Link to="/stories">
            <Button variant="primary" icon={<ArrowLeft size={18} />}>
              Retour aux récits
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && story.created_by === currentUser.id;
  const wordCount = story.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/stories" className="inline-flex items-center text-primary-600 hover:text-primary-800">
            <ArrowLeft size={18} className="mr-2" />
            Retour aux récits
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-vintage p-6 sm:p-8 border border-primary-100">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-primary-800 leading-tight">
                {story.title}
              </h1>
              {isOwner && (
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={() => navigate(`/story/${story.id}/edit`)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<Trash2 size={16} />}
                    onClick={handleDelete}
                    className="text-red-600 hover:bg-red-50 border-red-300"
                  >
                    Supprimer
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {story.profiles?.full_name || 'Utilisateur'}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Publié le {new Date(story.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {story.updated_at !== story.created_at && (
                <div className="flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Modifié le {new Date(story.updated_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-500 pb-6 border-b border-neutral-200">
              <span>{wordCount} mots</span>
              <span>•</span>
              <span>{readingTime} min de lecture</span>
              <span>•</span>
              <span>{story.content.length} caractères</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-neutral-800 leading-relaxed whitespace-pre-wrap">
              {story.content}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-neutral-600">
                <p className="font-medium mb-1">Merci d'avoir lu ce récit familial</p>
                <p>Chaque histoire préservée enrichit notre héritage commun</p>
              </div>
              <div className="flex gap-3">
                <Link to="/stories">
                  <Button variant="outline">
                    Voir tous les récits
                  </Button>
                </Link>
                <Link to="/stories/add">
                  <Button variant="primary">
                    Écrire un récit
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </article>

        {/* Related Stories or Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-200 rounded-lg p-6">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
              Continue l'aventure
            </h3>
            <p className="text-neutral-700 mb-6">
              Découvre d'autres récits ou partage tes propres souvenirs familiaux
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/stories">
                <Button variant="outline">
                  📚 Tous les Récits
                </Button>
              </Link>
              <Link to="/stories/add">
                <Button variant="primary">
                  ✍️ Écrire un Récit
                </Button>
              </Link>
              <Link to="/timeline">
                <Button variant="outline">
                  📅 Voir la Timeline
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
