import React from 'react';

// This component is no longer needed as we've simplified the database structure
// Family relationships feature has been removed to streamline the application

interface RelationshipListProps {
  relations: any[];
}

const RelationshipList: React.FC<RelationshipListProps> = () => {
  return (
    <div className="text-center py-4">
      <p className="text-neutral-600">
        La fonctionnalité de relations familiales a été simplifiée.
      </p>
    </div>
  );
};

export default RelationshipList;