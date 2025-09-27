import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { Plus, Search, Filter, Image, Trash2, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import MediaGallery from '../components/media/MediaGallery';
import MediaUpload from '../components/media/MediaUpload';

interface Media {
  id: string;
  title: string;
  description?: string;
  type: 'image' | 'document';
  url: string;
  event_id?: string;
  created_at: string;
  uploaded_at: string;
}

const GalleryPage: React.FC = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      showToast('Erreur lors du chargement de la galerie', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMedia(media.filter(item => item.id !== id));
      showToast('Média supprimé avec succès', 'success');
    } catch (error) {
      console.error('Error deleting media:', error);
      showToast('Erreur lors de la suppression', 'error');
    }
  }

  const handleUploadComplete = async () => {
    setUploading(false);
    await fetchMedia(); // Recharger les médias après l'upload
    showToast('Médias ajoutés avec succès', 'success');
  };

  const handleUploadError = (message: string) => {
    setUploading(false);
    showToast(`Erreur lors de l'upload: ${message}`, 'error');
  };

  const filteredMedia = media.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary-800 mb-2">
              Galerie multimédia
            </h1>
            <p className="text-neutral-600">
              Explore les documents et photos de ton histoire familiale
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Upload size={18} />}
            onClick={() => setShowUpload(!showUpload)}
            className="mt-4 sm:mt-0"
            isLoading={uploading}
          >
            {showUpload ? 'Fermer' : 'Ajouter des médias'}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-vintage p-6 border border-neutral-200">
          {showUpload && (
            <div className="mb-8">
              <h2 className="text-xl font-serif font-bold mb-4">Ajouter des médias</h2>
              <MediaUpload
                eventId="gallery"
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center my-16">
              <Image className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">Aucun média trouvé</h3>
              <p className="text-neutral-600">
                {searchTerm ? 'Aucun résultat ne correspond à ta recherche' : 'Ajoute des médias depuis les événements'}
              </p>
            </div>
          ) : (
            <MediaGallery media={filteredMedia} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;