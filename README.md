# 🏛️ SOUVIENS_TOI - Application de Chronologie Familiale

Une application web moderne pour documenter, organiser et partager l'histoire de votre famille.

## ✨ Fonctionnalités

### 📅 Timeline Interactive
- Chronologie visuelle des événements familiaux
- Navigation par années
- Dates précises ou approximatives
- Localisation des événements

### 📸 Galerie Multimédia
- Upload de photos et documents
- Liaison avec les événements
- Visualisation optimisée (images et PDFs)
- Stockage sécurisé

### 📖 Récits et Anecdotes
- Rédaction d'histoires familiales
- Préservation des traditions
- Recherche dans les contenus

### 📄 Export PDF
- Génération automatique de chronologies
- Mise en page professionnelle
- Indicateurs de médias
- Téléchargement instantané

### 👤 Profils Utilisateurs
- Gestion des comptes
- Photos de profil
- Données personnalisées

## 🛠️ Technologies

- **Frontend :** React 18 + TypeScript
- **Styling :** Tailwind CSS
- **Routing :** React Router
- **Backend :** Supabase
- **Storage :** Supabase Storage
- **PDF :** React-PDF
- **Build :** Vite

## 🚀 Installation Rapide

```bash
# Cloner le projet
git clone [votre-repo]
cd souviens-toi

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Lancer l'application
npm run dev
```

## 📊 Base de Données

### Tables Principales
- `profiles` - Profils utilisateurs
- `events` - Événements timeline
- `media` - Photos/documents
- `stories` - Récits familiaux

### Storage Buckets
- `media` - Fichiers multimédia
- `avatars` - Photos de profil

## 🔐 Sécurité

- Authentification par email/mot de passe
- Row Level Security (RLS) sur toutes les tables
- Politiques d'accès granulaires
- Stockage sécurisé des fichiers

## 📱 Interface

### Design
- Interface vintage et chaleureuse
- Couleurs terre et sépia
- Typographie élégante (Playfair Display + Lato)
- Responsive design

### UX/UI
- Navigation intuitive
- Feedback utilisateur (toasts)
- États de chargement
- Gestion d'erreurs

## 🌐 Déploiement

### Netlify (Recommandé)
```bash
# Build de production
npm run build

# Configuration netlify.toml incluse
# Variables d'environnement à configurer
```

### Variables d'Environnement
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu de la build
npm run lint     # Vérification du code
npm run test     # Tests unitaires
```

## 🎨 Personnalisation

### Thème
Modifiez `tailwind.config.js` pour :
- Couleurs personnalisées
- Polices alternatives
- Espacements spécifiques

### Fonctionnalités
Architecture modulaire permettant :
- Ajout de nouveaux types d'événements
- Extension des métadonnées
- Intégration d'APIs externes

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage
```

Tests inclus pour :
- Utilitaires de timeline
- Fonctions de galerie
- Logique des récits

## 📚 Documentation

### Structure du Code
```
src/
├── components/     # Composants réutilisables
├── contexts/       # Contextes React
├── lib/           # Configuration (Supabase)
├── pages/         # Pages de l'application
├── utils/         # Fonctions utilitaires
└── tests/         # Tests unitaires
```

### Composants Principaux
- `TimelinePage` - Affichage chronologique
- `MediaUpload` - Upload de fichiers
- `TimelinePDF` - Génération PDF
- `AuthContext` - Gestion authentification

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🙏 Remerciements

- Supabase pour l'infrastructure backend
- React team pour le framework
- Tailwind CSS pour le styling
- Lucide React pour les icônes

---

**Préservez votre histoire familiale avec SOUVIENS_TOI ! 🏛️**