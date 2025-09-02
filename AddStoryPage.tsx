import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft } from 'lucide-react';

const AddStoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      showToast('Veuillez remplir tous les champs requis', 'error');
      return;
    }

    if (!currentUser) {
      showToast('Vous devez être connecté pour créer un récit', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('stories')
        .insert([
          {
            title: title.trim(),
            content: content.trim(),
            created_by: currentUser.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      showToast('Récit créé avec succès !', 'success');
      navigate(`/stories/${data.id}`);
    } catch (error) {
      console.error('Error creating story:', error);
      showToast('Erreur lors de la création du récit', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/stories')}
            className="flex items-center text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft size={18} className="mr-2" />
            Retour aux récits
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-vintage p-6 sm:p-8">
          <h1 className="text-3xl font-bold font-serif text-primary-800 mb-6">
            Ajouter un nouveau récit
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                Titre
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du récit"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-1">
                Contenu
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrivez votre récit..."
                rows={10}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/stories')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Création...' : 'Créer le récit'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStoryPage;