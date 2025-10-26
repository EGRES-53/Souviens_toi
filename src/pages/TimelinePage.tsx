import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { Plus, Search, Trees as Tree, Trash2, Calendar, FileDown, Download, Eye } from 'lucide-react';
import { Image } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TimelinePDF from '../components/timeline/TimelinePDF';
import { format } from 'date-fns';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  precise_date?: boolean;
  location?: string;
  media_count?: number;
}

const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPDF, setShowPDF] = useState(false);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [currentUser, showToast]);

  const fetchEvents = async () => {
    if (!currentUser) {
      showToast('Vous devez être connecté pour voir les événements', 'error');
      setLoading(false);
      return;
    }

    try {
      // Get the current session to ensure we're authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Erreur de session');
      }

      if (!session) {
        throw new Error('Session non trouvée');
      }

      // Fetch events with media count
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          media_count:media(count)
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Transform the data to include media count
        const eventsWithMediaCount = data.map(event => ({
          ...event,
          media_count: event.media_count?.[0]?.count || 0
        }));
        setEvents(eventsWithMediaCount);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de la chronologie';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!currentUser) {
      showToast('Vous devez être connecté pour supprimer un événement', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter(event => event.id !== eventId));
      showToast('Événement supprimé avec succès', 'success');
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Erreur lors de la suppression de l\'événement', 'error');
    }
  };

  const formatDate = (dateString: string, precise: boolean = true) => {
    const date = new Date(dateString);
    if (precise) {
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric'
    });
  };

  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      (event.location && event.location.toLowerCase().includes(searchLower))
    );
  });

  if (showPDF) {
    return (
      <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowPDF(false)}
              icon={<Calendar size={18} />}
            >
              Retour à la chronologie
            </Button>
          </div>
          <TimelinePDF events={filteredEvents} mode="viewer" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-neutral-800 mb-2">
            Chronique Familiale Ancestrale
          </h1>
          <p className="text-neutral-600">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="bg-[#f9f5eb] rounded-lg shadow-vintage p-8 border border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <Input
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
                icon={<Search className="text-neutral-400" size={18} />}
              />
            </div>
          <div className="w-full">
  <div className="flex justify-center gap-3">
    <Link to="/event/new" className="inline-flex">
      <Button variant="primary" icon={<Plus size={18} />}>
        Ajouter un événement
      </Button>
    </Link>

    <span className="inline-flex">
      <Button
        variant="secondary"
        icon={<Eye size={18} />}
        onClick={() => setShowPDF(true)}
      >
        Aperçu PDF
      </Button>
    </span>

    <span className="inline-flex">
      <TimelinePDF 
        events={filteredEvents} 
        mode="download"
        fileName={`chronologie-familiale-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
      />
    </span>
  </div>
</div>

          </div>

          <div className="text-center mb-12">
            <Tree className="w-16 h-16 mx-auto text-primary-600 mb-4" />
            <h2 className="text-3xl font-serif italic mb-2">Chronique des Ancêtres</h2>
            <p className="text-neutral-600 font-serif">
              Tes racines profondes, une mémoire vivante
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">
                {!currentUser ? 'Connecte-toi pour voir les événements' : 'Aucun événement trouvé'}
              </p>
              {!currentUser && (
                <Link to="/login" className="inline-block mt-4">
                  <Button variant="primary">Se connecter</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-primary-300"></div>
              
              <div className="space-y-8">
                {filteredEvents.map((event, index) => {
                  const eventYear = new Date(event.date).getFullYear();
                  const previousEventYear = index > 0 ? new Date(filteredEvents[index - 1].date).getFullYear() : null;
                  const showYearHeader = index === 0 || eventYear !== previousEventYear;

                  return (
                    <div key={event.id}>
                      {showYearHeader && (
                        <div className="relative mb-6">
                          <div className="absolute left-[-10px] top-0 w-[42px] h-[42px] rounded-full bg-primary-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">{eventYear}</span>
                          </div>
                          <div className="pl-12">
                            <h3 className="text-2xl font-serif font-bold text-primary-800 mb-2">
                              {eventYear}
                            </h3>
                            <div className="h-[2px] bg-primary-200 w-full"></div>
                          </div>
                        </div>
                      )}
                      <div className="relative pl-12">
                        <div className="absolute left-[-5px] top-6 w-[12px] h-[12px] rounded-full bg-primary-500 border-4 border-white"></div>
                        <div className="bg-white rounded-lg p-6 shadow-vintage hover:shadow-vintage-lg transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <Link to={`/event/${event.id}`} className="flex-grow">
                              <h3 className="text-2xl font-bold font-serif text-neutral-800 flex items-center gap-3">
                                {event.title}
                                {event.media_count > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
                                      <Image size={14} className="mr-1" />
                                      {event.media_count}
                                    </div>
                                  </div>
                                )}
                              </h3>
                            </Link>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="Supprimer l'événement"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          <div className="flex items-center text-neutral-600 mb-3">
                            <Calendar size={18} className="mr-2 text-primary-600" />
                            {formatDate(event.date, event.precise_date)}
                          </div>

                          {event.location && (
                            <div className="text-sm text-neutral-600 mb-2">
                              <strong>Lieu:</strong> {event.location}
                            </div>
                          )}
                          
                          <div className="text-neutral-700">
                            <strong>Description:</strong> {event.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
