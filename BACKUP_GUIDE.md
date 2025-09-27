# 💾 Guide de Sauvegarde des Données Supabase

Ce guide explique comment faire une copie locale complète de tes données Supabase pour l'application SOUVIENS_TOI.

## 🎯 Méthodes de Sauvegarde

### **1. 📊 Export SQL via Dashboard Supabase (Recommandé)**

#### **A. Export des Tables :**
1. **Connecte-toi** à ton dashboard Supabase
2. **Va dans** `SQL Editor`
3. **Utilise ces méthodes alternatives** car `COPY TO STDOUT` ne fonctionne pas dans l'interface web :

## **🎯 Méthode 1 : SELECT Simple (Recommandée pour Dashboard)**

### **Requêtes à utiliser dans le SQL Editor :**

**Pour la table `events` :**
```sql
SELECT 
  id,
  title,
  date,
  description,
  location,
  precise_date,
  created_by,
  created_at,
  updated_at
FROM events
ORDER BY date;
```

**Pour la table `profiles` :**
```sql
SELECT 
  id,
  full_name,
  avatar_url,
  created_at,
  updated_at
FROM profiles
ORDER BY created_at;
```

**Pour la table `media` :**
```sql
SELECT 
  id,
  title,
  url,
  type,
  event_id,
  created_by,
  created_at,
  uploaded_at
FROM media
ORDER BY uploaded_at DESC;
```

**Pour la table `stories` :**
```sql
SELECT 
  id,
  title,
  content,
  created_by,
  created_at,
  updated_at
FROM stories
ORDER BY created_at DESC;
```

### **📋 Procédure :**
1. **Exécute** une requête SELECT
2. **Clique** sur l'onglet "Results"
3. **Utilise** le bouton "Export" (s'il existe) ou copie manuellement
4. **Sauvegarde** dans un fichier CSV

## **🎯 Méthode 2 : Via Table Editor (Plus Simple)**

### **Étapes :**
1. **Va dans** `Table Editor` (menu de gauche)
2. **Sélectionne** une table (ex: `events`)
3. **Clique** sur le bouton "..." ou "Actions"
4. **Cherche** "Export" ou "Download CSV"
5. **Télécharge** le fichier

## **🎯 Méthode 3 : Copie Manuelle des Résultats**

### **Si pas de bouton Export :**
1. **Exécute** la requête SELECT
2. **Sélectionne** tous les résultats dans l'onglet Results
3. **Copie** (Ctrl+C)
4. **Colle** dans Excel/Google Sheets
5. **Sauvegarde** en CSV

## **🎯 Méthode 4 : Format JSON (Alternative)**

**Pour récupérer en JSON :**
```sql
SELECT json_agg(row_to_json(events)) 
FROM (
  SELECT * FROM events ORDER BY date
) events;
```

## **🔧 Méthode 5 : Via pgAdmin (Avancé)**

Si tu as pgAdmin installé :
1. **Connecte-toi** avec les credentials Supabase
2. **Clic droit** sur la table → "Import/Export Data"
3. **Choisis** "Export" et format CSV

## **📊 Test de Connectivité**

**D'abord, vérifie que tu as des données :**
```sql
-- Compter les lignes dans chaque table
SELECT 'events' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'media' as table_name, COUNT(*) as count FROM media
UNION ALL
SELECT 'stories' as table_name, COUNT(*) as count FROM stories;
```

##### **Étape 3 : Récupérer les Données**
1. **Exécute** chaque requête une par une
2. **Copie** le résultat affiché dans l'éditeur
3. **Colle** dans un fichier texte (ex: `profiles.csv`)
4. **Sauvegarde** chaque fichier avec l'extension `.csv`

#### **B. Export SQL Complet (Méthode Avancée) :**

##### **Via pgAdmin ou client PostgreSQL :**
```bash
# Dump complet de la base
pg_dump \
  --host=db.your-project-ref.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --no-password \
  --clean \
  --if-exists \
  --file=souviens_toi_backup.sql
```

##### **Via SQL Editor Supabase :**
```sql
-- Export structure + données d'une table
SELECT 
  'CREATE TABLE ' || schemaname||'.'||tablename||' (' ||
  array_to_string(
    array_agg(
      column_name||' '||data_type||
      case when character_maximum_length is not null 
      then '('||character_maximum_length||')' 
      else '' end
    ), ', '
  ) || ');'
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.tablename
WHERE t.schemaname = 'public' 
  AND t.tablename IN ('profiles', 'events', 'media', 'stories')
GROUP BY schemaname, tablename;
```

#### **C. Export via Interface Graphique (Alternative) :**

##### **Méthode Table Editor :**
1. **Va dans** `Table Editor`
2. **Sélectionne** une table (ex: `events`)
3. **Clique** sur les `...` (menu options)
4. **Cherche** l'option "Export" ou "Download"
5. **Choisis** le format CSV
6. **Télécharge** le fichier

*Note : Cette option peut varier selon la version de Supabase*

#### **B. Sauvegarde Complète :**
```sql
-- Dump complet de la base de données
pg_dump --host=db.your-project.supabase.co \
        --port=5432 \
        --username=postgres \
        --dbname=postgres \
        --no-password \
        --file=souviens_toi_backup.sql
```

### **📋 Exemple Pratique d'Export CSV :**

#### **Résultat attendu pour `events.csv` :**
```csv
id,title,date,description,location,precise_date,created_by,created_at,updated_at
123e4567-e89b-12d3-a456-426614174000,"Naissance de Grand-père Pierre","1920-03-15","Naissance de Pierre Dupont à Lyon","Lyon, France",true,456e7890-e89b-12d3-a456-426614174000,"2024-01-15T10:30:00Z","2024-01-15T10:30:00Z"
789e0123-e89b-12d3-a456-426614174000,"Mariage de Pierre et Marie","1945-06-20","Mariage à l'église Saint-Jean","Lyon, France",true,456e7890-e89b-12d3-a456-426614174000,"2024-01-15T11:00:00Z","2024-01-15T11:00:00Z"
```

#### **Structure des Fichiers de Backup :**
```
backup_2024-01-15/
├── profiles.csv          # Profils utilisateurs
├── events.csv           # Événements timeline
├── media.csv            # Métadonnées des médias
├── stories.csv          # Récits familiaux
├── backup_info.txt      # Informations du backup
└── restore_guide.md     # Guide de restauration
```

### **🔄 Import/Restauration des Données CSV :**

#### **Via SQL Editor :**
```sql
-- Créer une table temporaire
CREATE TEMP TABLE temp_events (
  id uuid,
  title text,
  date date,
  description text,
  location text,
  precise_date boolean,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz
);

-- Importer depuis CSV (copier-coller les données)
COPY temp_events FROM STDIN WITH CSV HEADER;
-- [Coller ici le contenu du fichier CSV]

-- Insérer dans la vraie table
INSERT INTO events SELECT * FROM temp_events;
```

### **2. 🔧 Via CLI Supabase (Avancé)**

#### **Installation :**
```bash
npm install -g supabase
supabase login
```

#### **Export des données :**
```bash
# Export de la structure
supabase db dump --schema-only > schema.sql

# Export des données
supabase db dump --data-only > data.sql

# Export complet
supabase db dump > full_backup.sql
```

### **3. 📁 Via Scripts Node.js (Automatisé)**

Crée un script `backup.js` :

```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function backupData() {
  const backup = {
    timestamp: new Date().toISOString(),
    data: {}
  };

  // Backup profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*');
  backup.data.profiles = profiles;

  // Backup events
  const { data: events } = await supabase
    .from('events')
    .select('*');
  backup.data.events = events;

  // Backup media
  const { data: media } = await supabase
    .from('media')
    .select('*');
  backup.data.media = media;

  // Backup stories
  const { data: stories } = await supabase
    .from('stories')
    .select('*');
  backup.data.stories = stories;

  // Save to file
  fs.writeFileSync(
    `backup_${Date.now()}.json`,
    JSON.stringify(backup, null, 2)
  );

  console.log('✅ Backup completed!');
}

backupData();
```

### **4. 📸 Sauvegarde des Fichiers Storage**

#### **A. Via Dashboard :**
1. **Va dans** `Storage`
2. **Sélectionne** le bucket `media` ou `avatars`
3. **Télécharge** tous les fichiers

#### **B. Via Script :**
```javascript
async function backupStorage() {
  // List all files in media bucket
  const { data: mediaFiles } = await supabase.storage
    .from('media')
    .list();

  // Download each file
  for (const file of mediaFiles) {
    const { data } = await supabase.storage
      .from('media')
      .download(file.name);
    
    // Save locally
    fs.writeFileSync(`./backup/media/${file.name}`, data);
  }

  // Repeat for avatars bucket
  const { data: avatarFiles } = await supabase.storage
    .from('avatars')
    .list();

  for (const file of avatarFiles) {
    const { data } = await supabase.storage
      .from('avatars')
      .download(file.name);
    
    fs.writeFileSync(`./backup/avatars/${file.name}`, data);
  }
}
```

## 🔄 Restauration des Données

### **1. 📊 Import SQL :**
```bash
# Restaurer depuis un dump SQL
psql --host=db.your-new-project.supabase.co \
     --port=5432 \
     --username=postgres \
     --dbname=postgres \
     --file=souviens_toi_backup.sql
```

### **2. 📁 Import JSON :**
```javascript
async function restoreData(backupFile) {
  const backup = JSON.parse(fs.readFileSync(backupFile));

  // Restore profiles
  await supabase.from('profiles').insert(backup.data.profiles);

  // Restore events
  await supabase.from('events').insert(backup.data.events);

  // Restore media
  await supabase.from('media').insert(backup.data.media);

  // Restore stories
  await supabase.from('stories').insert(backup.data.stories);

  console.log('✅ Restore completed!');
}
```

### **3. 📸 Upload Storage :**
```javascript
async function restoreStorage() {
  const mediaFiles = fs.readdirSync('./backup/media/');
  
  for (const fileName of mediaFiles) {
    const fileBuffer = fs.readFileSync(`./backup/media/${fileName}`);
    
    await supabase.storage
      .from('media')
      .upload(fileName, fileBuffer);
  }
}
```

## 🛡️ Stratégie de Sauvegarde Recommandée

### **📅 Fréquence :**
- **Quotidienne :** Pour les données critiques
- **Hebdomadaire :** Pour les fichiers media
- **Avant modifications :** Backup de sécurité

### **📦 Structure de Backup :**
```
backups/
├── 2024-01-15/
│   ├── database/
│   │   ├── full_backup.sql
│   │   ├── data_only.json
│   │   └── schema.sql
│   ├── storage/
│   │   ├── media/
│   │   └── avatars/
│   └── metadata.json
```

### **🔐 Sécurité :**
- **Chiffre** tes backups sensibles
- **Stocke** dans plusieurs endroits
- **Teste** régulièrement la restauration

## 🚀 Script de Backup Automatisé

Crée `auto-backup.js` :

```javascript
const cron = require('node-cron');

// Backup quotidien à 2h du matin
cron.schedule('0 2 * * *', () => {
  console.log('🔄 Starting daily backup...');
  backupData();
  backupStorage();
});

// Backup hebdomadaire complet le dimanche
cron.schedule('0 1 * * 0', () => {
  console.log('🔄 Starting weekly full backup...');
  // Full backup logic here
});
```

## ⚠️ Points Importants

### **🔑 Variables d'Environnement :**
```env
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_PASSWORD=your-db-password
```

### **📋 Checklist Backup :**
- ✅ Tables de données (profiles, events, media, stories)
- ✅ Fichiers storage (photos, documents, avatars)
- ✅ Configuration RLS et politiques
- ✅ Migrations SQL
- ✅ Variables d'environnement

### **🎯 Cas d'Usage :**
- **Migration** vers un autre projet Supabase
- **Développement local** avec données réelles
- **Backup de sécurité** avant modifications
- **Archivage** de versions historiques

Avec ces méthodes, tu peux facilement créer une copie complète de tes données Supabase ! 🎉