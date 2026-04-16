import { supabase } from './supabase';

export interface ActivityLog {
  id: string;
  user_name: string;
  action: string;
  resource_type: 'event' | 'story' | 'media' | 'user';
  timestamp: string;
  details?: string;
}

export async function fetchActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
  try {
    const logs: ActivityLog[] = [];

    // Récupérer les événements récemment créés/modifiés
    const { data: events } = await supabase
      .from('events')
      .select('id, title, created_by, created_at, updated_at, created_by(full_name)')
      .order('updated_at', { ascending: false })
      .limit(limit / 4);

    // Récupérer les récits récemment créés/modifiés
    const { data: stories } = await supabase
      .from('stories')
      .select('id, title, created_by, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit / 4);

    // Récupérer les médias récemment créés
    const { data: media } = await supabase
      .from('media')
      .select('id, filename, created_by, created_at')
      .order('created_at', { ascending: false })
      .limit(limit / 4);

    // Récupérer les nouvelles inscriptions
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(limit / 4);

    // Construire les logs d'activité
    events?.forEach(event => {
      logs.push({
        id: event.id,
        user_name: (event.created_by as any)?.full_name || 'Utilisateur anonyme',
        action: 'a créé/modifié un événement',
        resource_type: 'event',
        timestamp: new Date(event.updated_at).toISOString(),
        details: event.title
      });
    });

    stories?.forEach(story => {
      logs.push({
        id: story.id,
        user_name: 'Utilisateur',
        action: 'a créé/modifié un récit',
        resource_type: 'story',
        timestamp: new Date(story.updated_at).toISOString(),
        details: story.title
      });
    });

    media?.forEach(m => {
      logs.push({
        id: m.id,
        user_name: 'Utilisateur',
        action: 'a téléchargé un média',
        resource_type: 'media',
        timestamp: new Date(m.created_at).toISOString(),
        details: m.filename
      });
    });

    profiles?.forEach(profile => {
      logs.push({
        id: profile.id,
        user_name: profile.full_name || 'Nouvel utilisateur',
        action: 'a créé un compte',
        resource_type: 'user',
        timestamp: new Date(profile.created_at).toISOString()
      });
    });

    // Trier par date (le plus récent en premier)
    return logs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, limit);

  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    throw error;
  }
}

export function exportLogs(logs: ActivityLog[]): void {
  const csv = convertToCSV(logs);
  const filename = `logs_souviens_toi_${new Date().toISOString().split('T')[0]}.csv`;
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertToCSV(logs: ActivityLog[]): string {
  const headers = ['Date', 'Utilisateur', 'Action', 'Type', 'Détails'];
  const rows = logs.map(log => [
    new Date(log.timestamp).toLocaleString('fr-FR'),
    log.user_name,
    log.action,
    log.resource_type,
    log.details || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}
