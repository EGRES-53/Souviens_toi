import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Save, Upload } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at?: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: currentUser?.id || '',
    full_name: '',
    avatar_url: '',
    created_at: undefined
  });

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        // If profile doesn't exist (PGRST116), create a default one
        if (error.code === 'PGRST116') {
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: currentUser.id,
              full_name: '',
              avatar_url: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (upsertError) throw upsertError;
          
          // Re-fetch the newly created profile
          await fetchProfile();
          return;
        }
        throw error;
      }
      
      if (data) {
        setProfile({
          ...profile,
          ...data
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Erreur lors du chargement du profil', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser?.id,
          full_name: profile.full_name,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      showToast('Profil mis à jour avec succès', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!e.target.files || !e.target.files.length) {
        showToast('Aucun fichier sélectionné', 'error');
        return;
      }

      if (!currentUser) {
        showToast('Tu dois être connecté pour télécharger une photo', 'error');
        return;
      }

      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Sélectionne un fichier image', 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('La taille du fichier ne doit pas dépasser 5MB', 'error');
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;

      console.log('Uploading avatar to path:', filePath);
      console.log('File size:', file.size, 'bytes');
      console.log('File type:', file.type);

      // Delete old avatar if it exists
      try {
        const { data: existingFiles } = await supabase.storage
          .from('avatars')
          .list(currentUser.id);
        
        if (existingFiles && existingFiles.length > 0) {
          const filesToDelete = existingFiles.map(file => `${currentUser.id}/${file.name}`);
          await supabase.storage
            .from('avatars')
            .remove(filesToDelete);
        }
      } catch (error) {
        console.log('No existing avatar to delete or error deleting:', error);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erreur de téléchargement: ${uploadError.message}`);
      }

      console.log('Upload successful, getting public URL...');

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error(`Erreur de mise à jour du profil: ${updateError.message}`);
      }

      setProfile({ ...profile, avatar_url: publicUrl });
      showToast('Photo de profil mise à jour avec succès!', 'success');
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      showToast(`Erreur lors du téléchargement: ${errorMessage}`, 'error');
    } finally {
      setUploading(false);
      // Reset the input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-serif text-primary-800 mb-8">
          Profil Utilisateur
        </h1>
        
        <div className="bg-white rounded-lg shadow-vintage p-6 md:p-8 border border-primary-100">
          <div className="flex flex-col md:flex-row md:items-center mb-8">
            <div className="flex-shrink-0 flex justify-center mb-4 md:mb-0 md:mr-6">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full object-cover border-2 border-primary-200"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary-600" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-600"></div>
                  ) : (
                    <Upload className="h-4 w-4 text-primary-600" />
                  )}
                </label>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-serif font-bold text-neutral-800 text-center md:text-left">
                {profile.full_name || 'Utilisateur'}
              </h2>
              <p className="text-neutral-600 text-center md:text-left">
                {currentUser?.email}
              </p>
              <p className="text-sm text-neutral-500 text-center md:text-left mt-1">
                Membre depuis le {profile.created_at ? 
                  new Date(profile.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date inconnue'
                }
              </p>
              {uploading && (
                <p className="text-sm text-primary-600 text-center md:text-left mt-2">
                  Téléchargement de ta photo en cours...
                </p>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Nom complet"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Ton nom complet"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                icon={<Save size={18} />}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;