import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Save, ArrowLeft } from 'lucide-react';

interface EventFormData {
  title: string;
  date: string;
  description: string;
  location?: string;
  precise_date: boolean;
}

const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    description: '',
    location: '',
    precise_date: true
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          date: data.date,
          description: data.description,
          location: data.location || '',
          precise_date: data.precise_date
        });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      showToast('Erreur lors du chargement de l\'événement', 'error');
      navigate('/timeline');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: formData.title,
          date: formData.date,
          description: formData.description,
          location: formData.location || null,
          precise_date: formData.precise_date
        })
        .eq('id', id);

      if (error) throw error;

      showToast('Événement modifié avec succès', 'success');
      navigate(`/event/${id}`);
    } catch (error) {
      console.error('Error updating event:', error);
      showToast('Erreur lors de la modification de l\'événement', 'error');
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

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/event/${id}`)}
          className="flex items-center text-primary-600 hover:text-primary-800 mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Retour à l'événement
        </button>

        <div className="bg-white rounded-lg shadow-vintage p-6 sm:p-8 border border-primary-100">
          <h1 className="text-3xl font-bold font-serif text-primary-800 mb-6">
            Modifier l'événement
          </h1>

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
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;