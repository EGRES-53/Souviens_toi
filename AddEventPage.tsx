import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import MediaUpload from '../components/media/MediaUpload';
import { Calendar, MapPin, Save, ArrowLeft } from 'lucide-react';

interface EventFormData {
  title: string;
  date: string;
  description: string;
  location?: string;
  precise_date: boolean;
}

const AddEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    location: '',
    precise_date: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: formData.title,
          date: formData.date,
          description: formData.description,
          location: formData.location || null,
          precise_date: formData.precise_date
        }])
        .select()
        .single();

      if (error) throw error;

      setEventId(data.id);
      showToast('Événement créé avec succès. Vous pouvez maintenant ajouter des médias.', 'success');
    } catch (error: any) {
      console.error('Erreur:', error);
      showToast(`Erreur lors de la création de l'événement: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleUploadComplete = () => {
    showToast('Médias ajoutés avec succès', 'success');
    navigate('/timeline');
  };

  const handleUploadError = (message: string) => {
    showToast(`Erreur lors de l'upload: ${message}`, 'error');
  };

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/timeline')}
          className="flex items-center text-primary-600 hover:text-primary-800 mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Retour à la chronologie
        </button>

        <div className="bg-white rounded-lg shadow-vintage p-6 sm:p-8 border border-primary-100">
          <h1 className="text-3xl font-bold font-serif text-primary-800 mb-6">
            Ajouter un événement
          </h1>

          {!eventId ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Titre de l'événement"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Mariage de Pierre et Marie"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="date"
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Lieu"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ex: Lyon, France"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  required
                  placeholder="Décrivez l'événement..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="precise_date"
                  name="precise_date"
                  checked={formData.precise_date}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="precise_date" className="ml-2 block text-sm text-neutral-700">
                  Date précise connue
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  icon={<Save size={18} />}
                >
                  Créer l'événement
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-neutral-800 mb-4">
                Ajouter des médias à l'événement
              </h2>
              <MediaUpload
                eventId={eventId}
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
              />
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => navigate('/timeline')}
                >
                  Terminer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEventPage;