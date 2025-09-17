// Stories utility functions for SOUVIENS_TOI application

export interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export const filterStories = (stories: Story[], searchTerm: string): Story[] => {
  if (!searchTerm.trim()) return stories;
  
  const term = searchTerm.toLowerCase();
  return stories.filter(story => 
    story.title.toLowerCase().includes(term) ||
    story.content.toLowerCase().includes(term)
  );
};

export const formatStoryDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Date invalide';
  }
};

export const validateStoryContent = (content: string): boolean => {
  return content.trim().length >= 20; // Minimum 20 characters
};
