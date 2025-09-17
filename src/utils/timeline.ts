// Timeline utility functions for SOUVIENS_TOI application

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location?: string;
  precise_date: boolean;
}

export const formatDate = (dateString: string, precise: boolean = true): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    if (precise) {
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.getFullYear().toString();
    }
  } catch (error) {
    return 'Date invalide';
  }
};

export const sortEvents = (events: TimelineEvent[]): TimelineEvent[] => {
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const filterEvents = (events: TimelineEvent[], searchTerm: string): TimelineEvent[] => {
  if (!searchTerm.trim()) return events;
  
  const term = searchTerm.toLowerCase();
  return events.filter(event => 
    event.title.toLowerCase().includes(term) ||
    event.description.toLowerCase().includes(term) ||
    (event.location && event.location.toLowerCase().includes(term))
  );
};
