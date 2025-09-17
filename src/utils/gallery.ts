// Gallery utility functions for SOUVIENS_TOI application

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'document';
  created_at: string;
}

export const filterMedia = (media: MediaItem[], searchTerm: string): MediaItem[] => {
  if (!searchTerm.trim()) return media;
  
  const term = searchTerm.toLowerCase();
  return media.filter(item => 
    item.title.toLowerCase().includes(term)
  );
};

export const sortMediaByDate = (media: MediaItem[]): MediaItem[] => {
  return [...media].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const validateMediaType = (mimeType: string): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf'
  ];
  
  return allowedTypes.includes(mimeType);
};
