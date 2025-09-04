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

// Créer le dossier de backup
const backupDir = `./backups/${new Date().toISOString().split('T')[0]}`;
const dataDir = path.join(backupDir, 'database');
const storageDir = path.join(backupDir, 'storage');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

async function backupTable(tableName) {
  console.log(`📊 Backup de la table ${tableName}...`);
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      console.error(`❌ Erreur lors du backup de ${tableName}:`, error);
      return null;
    }

    const fileName = path.join(dataDir, `${tableName}.json`);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    
    console.log(`✅ ${tableName}: ${data?.length || 0} enregistrements sauvegardés`);
    return data;
  } catch (error) {
    console.error(`❌ Erreur lors du backup de ${tableName}:`, error);
    return null;
  }
}

async function backupStorageBucket(bucketName) {
  console.log(`📁 Backup du bucket ${bucketName}...`);
  
  try {
    const bucketDir = path.join(storageDir, bucketName);
    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir, { recursive: true });
    }

    // Lister tous les fichiers du bucket
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      console.error(`❌ Erreur lors de la liste des fichiers de ${bucketName}:`, listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log(`📁 ${bucketName}: Aucun fichier à sauvegarder`);
      return;
    }

    let downloadedCount = 0;
    let errorCount = 0;

    // Télécharger chaque fichier
    for (const file of files) {
      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(bucketName)
          .download(file.name);

        if (downloadError) {
          console.error(`❌ Erreur téléchargement ${file.name}:`, downloadError);
          errorCount++;
          continue;
        }

        // Convertir en Buffer et sauvegarder
        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const filePath = path.join(bucketDir, file.name);
        fs.writeFileSync(filePath, buffer);
        
        downloadedCount++;
      } catch (error) {
        console.error(`❌ Erreur lors du téléchargement de ${file.name}:`, error);
        errorCount++;
      }
    }

    console.log(`✅ ${bucketName}: ${downloadedCount} fichiers téléchargés, ${errorCount} erreurs`);
  } catch (error) {
    console.error(`❌ Erreur lors du backup du bucket ${bucketName}:`, error);
  }
}

async function createBackupMetadata(backupData) {
  const metadata = {
    timestamp: new Date().toISOString(),
    supabase_url: supabaseUrl,
    tables: {},
    storage_buckets: ['media', 'avatars'],
    version: '1.0.0',
    app: 'SOUVIENS_TOI'
  };

  // Ajouter les statistiques des tables
  Object.keys(backupData).forEach(tableName => {
    if (backupData[tableName]) {
      metadata.tables[tableName] = {
        count: backupData[tableName].length,
        backed_up: true
      };
    } else {
      metadata.tables[tableName] = {
        count: 0,
        backed_up: false
      };
    }
  });

  const metadataPath = path.join(backupDir, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log('📋 Métadonnées de backup créées');
}

async function main() {
  console.log('🚀 Début du backup SOUVIENS_TOI...');
  console.log(`📁 Dossier de backup: ${backupDir}`);
  
  const startTime = Date.now();
  
  // Backup des tables
  console.log('\n📊 === BACKUP DES TABLES ===');
  const backupData = {};
  
  const tables = ['profiles', 'events', 'media', 'stories'];
  
  for (const table of tables) {
    backupData[table] = await backupTable(table);
  }
  
  // Backup des buckets storage
  console.log('\n📁 === BACKUP DU STORAGE ===');
  await backupStorageBucket('media');
  await backupStorageBucket('avatars');
  
  // Créer les métadonnées
  console.log('\n📋 === MÉTADONNÉES ===');
  await createBackupMetadata(backupData);
  
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  console.log('\n🎉 === BACKUP TERMINÉ ===');
  console.log(`⏱️  Durée: ${duration} secondes`);
  console.log(`📁 Dossier: ${backupDir}`);
  
  // Résumé
  console.log('\n📊 === RÉSUMÉ ===');
  Object.keys(backupData).forEach(tableName => {
    const count = backupData[tableName]?.length || 0;
    console.log(`   ${tableName}: ${count} enregistrements`);
  });
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

// Lancer le backup
main().catch(error => {
  console.error('❌ Erreur lors du backup:', error);
  process.exit(1);
});