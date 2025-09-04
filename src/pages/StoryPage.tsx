import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
}

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
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
    if (!story) return;

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold font-serif text-primary-800 mb-4">
            Récit non trouvé
          </h1>
          <Link to="/stories">
            <Button variant="primary" icon={<ArrowLeft size={18} />}>
              Retour aux récits
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/stories" className="inline-flex items-center text-primary-600 hover:text-primary-800">
            <ArrowLeft size={18} className="mr-2" />
            Retour aux récits
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-vintage p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold font-serif text-primary-800">
              {story.title}
            </h1>
            <div className="flex gap-2">
              <Link to={`/stories/${story.id}/edit`}>
                <Button variant="outline" size="sm" icon={<Edit size={16} />}>
                  Modifier
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-50"
              >
                Supprimer
              </Button>
            </div>
          </div>

          <div className="text-sm text-neutral-500 mb-6">
            Ajouté le {new Date(story.created_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="prose max-w-none">
            {story.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-neutral-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;