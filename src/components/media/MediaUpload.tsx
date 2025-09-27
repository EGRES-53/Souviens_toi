import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabase';
import { Plus, Upload, X } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface MediaUploadProps {
  eventId: string;
  onUploadComplete: () => void;
  onError: (message: string) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ eventId, onUploadComplete, onError }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!currentUser) {
      onError('Vous devez être connecté pour télécharger des fichiers');
      navigate('/login');
      return;
    }

    setUploading(true);
    const uploadedFileNames: string[] = [];

    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `${eventId === 'gallery' ? 'general' : eventId}/${fileName}`;

        console.log('Uploading file:', fileName, 'to path:', filePath);

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        console.log('File uploaded, public URL:', publicUrl);

        const { data: mediaData, error: dbError } = await supabase
          .from('media')
          .insert({
            title: file.name,
            url: publicUrl,
            type: file.type.startsWith('image/') ? 'image' : 'document',
            event_id: eventId === 'gallery' ? null : eventId,
            created_by: currentUser.id,
            created_at: new Date().toISOString(),
            uploaded_at: new Date().toISOString()
          })
          .select();

        if (mediaData) {
          console.log('Media record created:', mediaData[0]);
        }

        if (dbError) {
          await supabase.storage
            .from('media')
            .remove([filePath]);
          throw new Error(`Erreur lors de l'enregistrement: ${dbError.message}`);
        }
        
        uploadedFileNames.push(file.name);
      }

      setUploadedFiles(uploadedFileNames);
      console.log('All files uploaded successfully:', uploadedFileNames);
      onUploadComplete();
    } catch (error: any) {
      onError(error.message || 'Une erreur est survenue lors du téléchargement');
    } finally {
      setUploading(false);
    }
  }, [eventId, onUploadComplete, onError, navigate, currentUser]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    disabled: uploading
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400'
      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-3"></div>
            <p className="text-primary-600">Upload en cours...</p>
            {uploadedFiles.length > 0 && (
              <div className="mt-2 text-sm text-green-600">
                <p>Fichiers uploadés:</p>
                <ul className="list-disc list-inside">
                  {uploadedFiles.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : isDragActive ? (
          <>
            <Upload className="h-12 w-12 text-primary-500 mb-3" />
            <p className="text-primary-600">Déposez les fichiers ici...</p>
          </>
        ) : (
          <>
            <Plus className="h-12 w-12 text-neutral-400 mb-3" />
            <p className="text-neutral-600">
              Glissez-déposez des fichiers ici ou cliquez pour sélectionner
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              Images (PNG, JPG, GIF) et Documents (PDF)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;