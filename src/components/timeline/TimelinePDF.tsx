import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location?: string;
  precise_date: boolean;
  media_count?: number;
}

interface TimelinePDFProps {
  events: TimelineEvent[];
  mode?: 'viewer' | 'download';
  fileName?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  event: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  eventDescription: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#666',
  },
  yearSection: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  yearTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#8b5cf6',
  },
  mediaBadge: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    fontFamily: 'Helvetica-Bold',
  },
  eventTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});

const TimelinePDFDocument: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  const formatDate = (dateString: string, precise: boolean = true) => {
    const date = new Date(dateString);
    if (precise) {
      return format(date, 'dd MMMM yyyy', { locale: fr });
    }
    return format(date, 'yyyy', { locale: fr });
  };

  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  const years = Object.keys(eventsByYear).map(Number).sort((a, b) => a - b);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Chronologie Familiale</Text>
        <Text style={styles.subtitle}>
          Généré le {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
        </Text>
        <Text style={styles.subtitle}>
          {events.length} événement{events.length > 1 ? 's' : ''} • {years.length} année{years.length > 1 ? 's' : ''}
        </Text>
        
        {years.map((year) => (
          <View key={year} style={styles.yearSection}>
            <Text style={styles.yearTitle}>{year}</Text>
            {eventsByYear[year].map((event) => (
              <View key={event.id} style={styles.event}>
                <View style={styles.eventTitleContainer}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.media_count && event.media_count > 0 && (
                    <Text style={styles.mediaBadge}>
                      📷 {event.media_count}
                    </Text>
                  )}
                </View>
                <Text style={styles.eventDate}>
                  {formatDate(event.date, event.precise_date)}
                </Text>
                {event.location && (
                  <Text style={styles.eventLocation}>{event.location}</Text>
                )}
                <Text style={styles.eventDescription}>{event.description}</Text>
              </View>
            ))}
          </View>
        ))}
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} sur ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

const TimelinePDF: React.FC<TimelinePDFProps> = ({ 
  events, 
  mode = 'viewer', 
  fileName = 'chronologie-familiale.pdf' 
}) => {
  if (mode === 'download') {
    return (
      <PDFDownloadLink 
        document={<TimelinePDFDocument events={events} />} 
        fileName={fileName}
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Génération du PDF...' : 'Télécharger le PDF'
        }
      </PDFDownloadLink>
    );
  }

  return (
    <PDFViewer style={{ width: '100%', height: '800px' }}>
      <TimelinePDFDocument events={events} />
    </PDFViewer>
  );
};

export default TimelinePDF;