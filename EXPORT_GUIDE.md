# 📦 Guide d'Exportation - Application SOUVIENS_TOI

## 🎯 Vue d'ensemble
Ce guide vous explique comment exporter et configurer localement l'application SOUVIENS_TOI (application de chronologie familiale).

## 📋 Prérequis

### Outils nécessaires :
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Git** (optionnel, pour le versioning)
- **Compte Supabase** (gratuit)

## 🚀 Étapes d'Exportation

### 1. 📁 Télécharger le Code Source

#### Option A : Téléchargement Direct
1. Cliquez sur le bouton **"Download"** ou **"Export"** dans Bolt
2. Extrayez l'archive ZIP dans votre dossier de projets

#### Option B : Copie Manuelle
1. Créez un nouveau dossier : `souviens-toi`
2. Copiez tous les fichiers du projet Bolt dans ce dossier

### 2. 🔧 Installation des Dépendances

```bash
# Naviguez dans le dossier du projet
cd souviens-toi

# Installez les dépendances
npm install

# Ou avec yarn
yarn install
```

### 3. 🗄️ Configuration de Supabase

#### A. Créer un Projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Créez un nouveau projet
4. Notez l'URL et la clé API anonyme

#### B. Configurer les Variables d'Environnement
1. Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-ici
```

#### C. Appliquer les Migrations
1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Exécutez les migrations dans l'ordre chronologique :
   - Commencez par `20250513074019_round_salad.sql`
   - Terminez par `20250125120000_cleanup_unused_tables.sql`

### 4. 🎨 Configuration du Projet

#### Structure des Dossiers :
```
souviens-toi/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   ├── pages/
│   └── utils/
├── supabase/
│   └── migrations/
├── package.json
├── .env
└── README.md
```

### 5. 🚀 Lancement de l'Application

```bash
# Démarrer le serveur de développement
npm run dev

# Ou avec yarn
yarn dev
```

L'application sera accessible sur `http://localhost:5173`

## 🔐 Configuration de Sécurité Supabase

### 1. Authentification
- **Email/Password** : Activé par défaut
- **Confirmation d'email** : Désactivée (pour simplifier)

### 2. Storage Buckets
Créez ces buckets dans Supabase Storage :
- `media` (public) - Pour les photos/documents
- `avatars` (public) - Pour les photos de profil

### 3. Politiques RLS
Les politiques sont automatiquement créées par les migrations.

## 📊 Tables de Base de Données

### Tables Principales :
- `profiles` - Profils utilisateurs
- `events` - Événements de la timeline
- `media` - Photos et documents
- `stories` - Récits familiaux

### Tables Système :
- `auth.users` - Authentification (Supabase)
- `storage.objects` - Fichiers (Supabase)

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Aperçu de la build
npm run preview

# Linting
npm run lint

# Tests
npm run test
```

## 🌐 Déploiement

### Option 1 : Netlify
1. Connectez votre repo GitHub à Netlify
2. Configurez les variables d'environnement
3. Build command : `npm run build`
4. Publish directory : `dist`

### Option 2 : Vercel
1. Importez le projet sur Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

## 🔧 Personnalisation

### Thème et Couleurs
Modifiez `tailwind.config.js` pour personnaliser :
- Couleurs primaires
- Polices
- Espacements

### Fonctionnalités
L'application inclut :
- ✅ Timeline interactive
- ✅ Upload de médias
- ✅ Récits familiaux
- ✅ Export PDF
- ✅ Profils utilisateurs

## 🐛 Dépannage

### Problèmes Courants :

#### 1. Erreur de connexion Supabase
- Vérifiez les variables d'environnement
- Confirmez que les migrations sont appliquées

#### 2. Erreur d'upload de fichiers
- Vérifiez que les buckets Storage existent
- Confirmez les politiques RLS

#### 3. Erreur d'authentification
- Vérifiez la configuration auth dans Supabase
- Confirmez que la table `profiles` existe

## 📞 Support

### Ressources :
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation React](https://react.dev/)

### Logs Utiles :
```bash
# Voir les logs de développement
npm run dev

# Voir les erreurs de build
npm run build
```

## 🎉 Félicitations !

Votre application SOUVIENS_TOI est maintenant configurée localement ! 

Vous pouvez :
- Créer des événements familiaux
- Uploader des photos et documents
- Écrire des récits
- Exporter en PDF
- Gérer votre profil

**Bon développement ! 🚀**