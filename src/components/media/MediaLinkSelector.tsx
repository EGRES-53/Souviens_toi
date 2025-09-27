import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { Link, FileText, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/Button';

interface Media {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'document';
}

interface MediaLinkSelectorProps {
  eventId: string;
  onLinkComplete: () => void;
}

const MediaLinkSelector: React.FC<MediaLinkSelectorProps> = ({ eventId, onLinkComplete }) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .is('event_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      showToast('Erreur lors du chargement des médias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkMedia = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from('media')
        .update({ event_id: eventId })
        .eq('id', mediaId);

      if (error) throw error;

      showToast('Média lié avec succès', 'success');
      onLinkComplete();
    } catch (error) {
      console.error('Error linking media:', error);
      showToast('Erreur lors de la liaison du média', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <p className="text-neutral-500 text-center py-4">
        Aucun média disponible à lier
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {media.map((item) => (
        <div key={item.id} className="flex items-center p-4 border rounded-lg hover:bg-primary-50">
          <div className="flex-shrink-0 mr-4">
            {item.type === 'image' ? (
              <ImageIcon className="h-8 w-8 text-primary-600" />
            ) : (
              <FileText className="h-8 w-8 text-primary-600" />
            )}
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-medium">{item.title}</h3>
            <p className="text-xs text-neutral-500">{item.type}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLinkMedia(item.id)}
            icon={<Link size={16} />}
          >
            Lier
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MediaLinkSelector;