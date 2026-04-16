import { supabase } from './supabase';

interface BackupData {
  events: any[];
  stories: any[];
  media: any[];
  profiles: any[];
  timestamp: string;
}

export async function createFullBackup(): Promise<BackupData | null> {
  try {
    // Récupérer tous les événements
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*');
    
    if (eventsError) throw eventsError;

    // Récupérer tous les récits
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('*');
    
    if (storiesError) throw storiesError;

    // Récupérer tous les médias
    const { data: media, error: mediaError } = await supabase
      .from('media')
      .select('*');
    
    if (mediaError) throw mediaError;

    // Récupérer les profils
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;

    const backupData: BackupData = {
      events: events || [],
      stories: stories || [],
      media: media || [],
      profiles: profiles || [],
      timestamp: new Date().toISOString()
    };

    // Télécharger le fichier de sauvegarde
    const filename = `backup_souviens_toi_${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(backupData, filename);

    return backupData;
  } catch (error) {
    console.error('Erreur lors de la création de la sauvegarde:', error);
    throw error;
  }
}

export function downloadJSON(data: any, filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<boolean> {
  try {
    const content = await file.text();
    const backupData: BackupData = JSON.parse(content);

    // Validation basique
    if (!backupData.events || !backupData.stories || !backupData.profiles) {
      throw new Error('Format de sauvegarde invalide');
    }

    console.log('Sauvegarde importée avec succès:', backupData);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'import de la sauvegarde:', error);
    throw error;
  }
}
