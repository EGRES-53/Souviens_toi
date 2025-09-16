import React from 'react';
import { Image, Upload } from 'lucide-react';

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f3e9] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary-800 mb-2">
              Galerie multimédia
            </h1>
            <p className="text-neutral-600">
              Explore les documents et photos de ton histoire familiale
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-vintage p-6 border border-neutral-200">
          <div className="text-center my-16">
            <Image className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold mb-2">Galerie Multimédia</h3>
            <p className="text-neutral-600">
              Tes photos et documents familiaux seront bientôt disponibles ici
            </p>
            <div className="mt-6">
              <div className="flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary-600 mr-2" />
                <span className="text-primary-600 font-medium">Upload de médias à venir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
  );
};

export default GalleryPage;
