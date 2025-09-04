import React, { useState } from 'react';
import { Trash2, FileText, Image as ImageIcon, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Media {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'document';
  uploaded_at?: string;
  created_at?: string;
}

interface MediaGalleryProps {
  media: Media[];
  onDelete: (id: string) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media, onDelete }) => {
  const [pdfStates, setPdfStates] = useState<Record<string, { numPages: number | null; pageNumber: number }>>({});

  const handleDocumentLoadSuccess = (mediaId: string, { numPages }: { numPages: number }) => {
    setPdfStates(prev => ({
      ...prev,
      [mediaId]: { numPages, pageNumber: 1 }
    }));
  };

  const changePage = (mediaId: string, offset: number) => {
    setPdfStates(prev => {
      const current = prev[mediaId];
      if (!current) return prev;

      return {
        ...prev,
        [mediaId]: {
          ...current,
          pageNumber: Math.max(1, Math.min(current.pageNumber + offset, current.numPages || 1))
        }
      };
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {media.map((item) => {
        const pdfState = pdfStates[item.id] || { numPages: null, pageNumber: 1 };

        return (
          <div key={item.id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <Document
                    file={item.url}
                    onLoadSuccess={(pdf) => handleDocumentLoadSuccess(item.id, pdf)}
                    loading={
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                      </div>
                    }
                    error={
                      <div className="flex flex-col items-center justify-center w-full h-full text-red-500">
                        <FileText className="h-12 w-12 mb-2" />
                        <p className="text-sm">Erreur de chargement</p>
                      </div>
                    }
                  >
                    <Page 
                      pageNumber={pdfState.pageNumber} 
                      width={300}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={
                        <div className="flex items-center justify-center w-full h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                      }
                    />
                  </Document>

                  <div className="mt-4 flex items-center justify-center gap-4">
                    {pdfState.numPages && pdfState.numPages > 1 && (
                      <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
                        <button
                          onClick={() => changePage(item.id, -1)}
                          disabled={pdfState.pageNumber <= 1}
                          className="p-1 rounded hover:bg-primary-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                          title="Page précédente"
                        >
                          <ChevronLeft className="h-5 w-5 text-primary-700" />
                        </button>
                        
                        <span className="text-sm text-neutral-600 min-w-[80px] text-center">
                          Page {pdfState.pageNumber} / {pdfState.numPages}
                        </span>

                        <button
                          onClick={() => changePage(item.id, 1)}
                          disabled={pdfState.pageNumber >= pdfState.numPages}
                          className="p-1 rounded hover:bg-primary-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                          title="Page suivante"
                        >
                          <ChevronRight className="h-5 w-5 text-primary-700" />
                        </button>
                      </div>
                    )}

                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors"
                    >
                      <span className="text-sm">Ouvrir</span>
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-neutral-600 truncate flex-1">{item.title}</p>
                <button
                  onClick={() => onDelete(item.id)}
                  className="ml-2 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {item.uploaded_at && (
                <p className="text-xs text-neutral-500 mt-1">
                  Ajouté le {new Date(item.uploaded_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MediaGallery;