const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Récupérer le dossier de backup depuis les arguments
const backupPath = process.argv[2];

if (!backupPath) {
  console.error('❌ Veuillez spécifier le chemin du backup');
  console.log('Usage: node restore.js ./backups/2024-01-15');
  process.exit(1);
}

if (!fs.existsSync(backupPath)) {
  console.error(`❌ Le dossier de backup n'existe pas: ${backupPath}`);
  process.exit(1);
}

async function restoreTable(tableName, backupPath) {
  console.log(`📊 Restauration de la table ${tableName}...`);
  
  const filePath = path.join(backupPath, 'database', `${tableName}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier de backup non trouvé pour ${tableName}`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data || data.length === 0) {
      console.log(`📊 ${tableName}: Aucune donnée à restaurer`);
      return;
    }

    // Insérer les données par petits lots pour éviter les timeouts
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      try {
        const { error } = await supabase
          .from(tableName)
          .upsert(batch, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error(`❌ Erreur lors de l'insertion du lot ${i}-${i + batch.length} de ${tableName}:`, error);
          errorCount += batch.length;
        } else {
          insertedCount += batch.length;
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'insertion du lot de ${tableName}:`, error);
        errorCount += batch.length;
      }
    }

    console.log(`✅ ${tableName}: ${insertedCount} enregistrements restaurés, ${errorCount} erreurs`);
  } catch (error) {
    console.error(`❌ Erreur lors de la restauration de ${tableName}:`, error);
  }
}

async function restoreStorageBucket(bucketName, backupPath) {
  console.log(`📁 Restauration du bucket ${bucketName}...`);
  
  const bucketDir = path.join(backupPath, 'storage', bucketName);
  
  if (!fs.existsSync(bucketDir)) {
    console.log(`⚠️  Dossier de backup non trouvé pour le bucket ${bucketName}`);
    return;
  }

  try {
    const files = fs.readdirSync(bucketDir);
    
    if (files.length === 0) {
      console.log(`📁 ${bucketName}: Aucun fichier à restaurer`);
      return;
    }

    let uploadedCount = 0;
    let errorCount = 0;

    for (const fileName of files) {
      try {
        const filePath = path.join(bucketDir, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        
        // Vérifier si le fichier existe déjà
        const { data: existingFile } = await supabase.storage
          .from(bucketName)
          .list('', { search: fileName });

        if (existingFile && existingFile.length > 0) {
          // Remplacer le fichier existant
          const { error: updateError } = await supabase.storage
            .from(bucketName)
            .update(fileName, fileBuffer);

          if (updateError) {
            console.error(`❌ Erreur mise à jour ${fileName}:`, updateError);
            errorCount++;
          } else {
            uploadedCount++;
          }
        } else {
          // Uploader le nouveau fichier
          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer);

          if (uploadError) {
            console.error(`❌ Erreur upload ${fileName}:`, uploadError);
            errorCount++;
          } else {
            uploadedCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'upload de ${fileName}:`, error);
        errorCount++;
      }
    }

    console.log(`✅ ${bucketName}: ${uploadedCount} fichiers restaurés, ${errorCount} erreurs`);
  } catch (error) {
    console.error(`❌ Erreur lors de la restauration du bucket ${bucketName}:`, error);
  }
}

async function loadMetadata(backupPath) {
  const metadataPath = path.join(backupPath, 'metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('⚠️  Fichier metadata.json non trouvé');
    return null;
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log('📋 Métadonnées du backup:');
    console.log(`   Date: ${new Date(metadata.timestamp).toLocaleString()}`);
    console.log(`   App: ${metadata.app}`);
    console.log(`   Version: ${metadata.version}`);
    return metadata;
  } catch (error) {
    console.error('❌ Erreur lors de la lecture des métadonnées:', error);
    return null;
  }
}

async function main() {
  console.log('🔄 Début de la restauration SOUVIENS_TOI...');
  console.log(`📁 Dossier de backup: ${backupPath}`);
  
  const startTime = Date.now();
  
  // Charger les métadonnées
  console.log('\n📋 === MÉTADONNÉES ===');
  const metadata = await loadMetadata(backupPath);
  
  // Confirmation avant restauration
  console.log('\n⚠️  === ATTENTION ===');
  console.log('Cette opération va remplacer les données existantes.');
  console.log('Assurez-vous d\'avoir fait un backup de vos données actuelles.');
  
  // En mode production, vous pourriez ajouter une confirmation interactive ici
  
  // Restauration des tables
  console.log('\n📊 === RESTAURATION DES TABLES ===');
  const tables = ['profiles', 'events', 'media', 'stories'];
  
  for (const table of tables) {
    await restoreTable(table, backupPath);
  }
  
  // Restauration des buckets storage
  console.log('\n📁 === RESTAURATION DU STORAGE ===');
  await restoreStorageBucket('media', backupPath);
  await restoreStorageBucket('avatars', backupPath);
  
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  console.log('\n🎉 === RESTAURATION TERMINÉE ===');
  console.log(`⏱️  Durée: ${duration} secondes`);
  console.log(`📁 Source: ${backupPath}`);
  
  console.log('\n✅ Restauration complète !');
  console.log('Vérifiez que toutes vos données sont correctement restaurées.');
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

// Lancer la restauration
main().catch(error => {
  console.error('❌ Erreur lors de la restauration:', error);
  process.exit(1);
});