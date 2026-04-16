import { supabase } from './supabase';

export interface ReportData {
  title: string;
  generatedAt: string;
  period: string;
  totalUsers: number;
  totalEvents: number;
  totalStories: number;
  totalMedia: number;
  newUsersThisMonth: number;
  activeUsers: number;
  eventsByMonth: { month: string; count: number }[];
  topContributors: { name: string; contributions: number }[];
  mediaBreakdown: { type: string; count: number }[];
}

export async function generateReport(): Promise<ReportData> {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Récupérer les profils
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*');

    // Récupérer les événements
    const { data: events } = await supabase
      .from('events')
      .select('*');

    // Récupérer les récits
    const { data: stories } = await supabase
      .from('stories')
      .select('*');

    // Récupérer les médias
    const { data: media } = await supabase
      .from('media')
      .select('*');

    const totalUsers = profiles?.length || 0;
    const totalEvents = events?.length || 0;
    const totalStories = stories?.length || 0;
    const totalMedia = media?.length || 0;

    // Utilisateurs inscrits ce mois-ci
    const newUsersThisMonth = profiles?.filter(p => 
      new Date(p.created_at) >= thisMonth
    ).length || 0;

    // Utilisateurs actifs (qui ont créé du contenu)
    const activeUserIds = new Set();
    events?.forEach(e => activeUserIds.add(e.created_by));
    stories?.forEach(s => activeUserIds.add(s.created_by));
    const activeUsers = activeUserIds.size;

    // Événements par mois (12 derniers mois)
    const eventsByMonth = getEventsPerMonth(events || []);

    // Top contributeurs
    const topContributors = getTopContributors(events || [], stories || [], profiles || []);

    // Types de médias
    const mediaBreakdown = getMediaBreakdown(media || []);

    const report: ReportData = {
      title: 'Rapport d\'Activité - Souviens Toi',
      generatedAt: now.toISOString(),
      period: `${thisMonth.toLocaleDateString('fr-FR')} au ${now.toLocaleDateString('fr-FR')}`,
      totalUsers,
      totalEvents,
      totalStories,
      totalMedia,
      newUsersThisMonth,
      activeUsers,
      eventsByMonth,
      topContributors,
      mediaBreakdown
    };

    return report;
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
}

function getEventsPerMonth(events: any[]): { month: string; count: number }[] {
  const months = {};
  const now = new Date();
  
  // Initialiser les 12 derniers mois
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    months[key] = 0;
  }

  // Compter les événements
  events.forEach(event => {
    const eventDate = new Date(event.created_at);
    const key = eventDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    if (key in months) months[key]++;
  });

  return Object.entries(months).map(([month, count]) => ({ month, count: count as number }));
}

function getTopContributors(events: any[], stories: any[], profiles: any[]): { name: string; contributions: number }[] {
  const contributors: { [key: string]: number } = {};

  events.forEach(event => {
    contributors[event.created_by] = (contributors[event.created_by] || 0) + 1;
  });

  stories.forEach(story => {
    contributors[story.created_by] = (contributors[story.created_by] || 0) + 1;
  });

  return Object.entries(contributors)
    .map(([userId, count]) => {
      const profile = profiles.find(p => p.id === userId);
      return {
        name: profile?.full_name || 'Utilisateur anonyme',
        contributions: count
      };
    })
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10);
}

function getMediaBreakdown(media: any[]): { type: string; count: number }[] {
  const breakdown: { [key: string]: number } = {};

  media.forEach(m => {
    const ext = m.filename?.split('.').pop()?.toUpperCase() || 'AUTRE';
    breakdown[ext] = (breakdown[ext] || 0) + 1;
  });

  return Object.entries(breakdown)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

export function downloadReport(report: ReportData): void {
  const html = generateReportHTML(report);
  const filename = `rapport_souviens_toi_${new Date().toISOString().split('T')[0]}.html`;
  
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generateReportHTML(report: ReportData): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${report.title}</title>
      <style>
        body { font-family: serif; margin: 40px; color: #333; }
        h1 { color: #8B6F47; text-align: center; }
        h2 { color: #8B6F47; border-bottom: 2px solid #8B6F47; padding-bottom: 10px; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .stat-box { background: #f8f3e9; padding: 15px; border-radius: 8px; border-left: 4px solid #8B6F47; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .stat-value { font-size: 28px; font-weight: bold; color: #8B6F47; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f0e6d2; color: #8B6F47; font-weight: bold; }
        tr:hover { background: #fefbf7; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${report.title}</h1>
      <p style="text-align: center; color: #666;">
        Période: ${report.period}<br>
        Généré le: ${new Date(report.generatedAt).toLocaleString('fr-FR')}
      </p>

      <h2>📊 Statistiques Générales</h2>
      <div class="stats">
        <div class="stat-box">
          <div class="stat-label">Membres Famille</div>
          <div class="stat-value">${report.totalUsers}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Nouveaux Membres</div>
          <div class="stat-value">${report.newUsersThisMonth}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Total Événements</div>
          <div class="stat-value">${report.totalEvents}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Utilisateurs Actifs</div>
          <div class="stat-value">${report.activeUsers}</div>
        </div>
      </div>

      <h2>👥 Top Contributeurs</h2>
      <table>
        <thead>
          <tr>
            <th>Membre</th>
            <th>Contributions</th>
          </tr>
        </thead>
        <tbody>
          ${report.topContributors.map(c => `
            <tr>
              <td>${c.name}</td>
              <td>${c.contributions}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>📁 Types de Médias</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          ${report.mediaBreakdown.map(m => `
            <tr>
              <td>${m.type}</td>
              <td>${m.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Rapport généré automatiquement par Souviens Toi</p>
      </div>
    </body>
    </html>
  `;
}
