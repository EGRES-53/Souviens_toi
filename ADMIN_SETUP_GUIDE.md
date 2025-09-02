# 👑 Guide Administrateur Unique - SOUVIENS_TOI

## 🎯 Configuration pour être le Seul Administrateur

### **1. 🔐 Sécurisation de l'Accès Supabase**

#### **A. Dashboard Supabase :**
1. **Connecte-toi** à [supabase.com](https://supabase.com)
2. **Va dans** ton projet SOUVIENS_TOI
3. **Settings** → **General** → **Access Control**
4. **Assure-toi** que seul ton email a accès au projet

#### **B. Gestion des Membres :**
1. **Settings** → **Team**
2. **Supprime** tous les autres membres (s'il y en a)
3. **Garde** seulement ton compte comme Owner

### **2. 🛡️ Sécurisation de l'Application**

#### **A. Variables d'Environnement :**
```env
# Garde ces clés secrètes et ne les partage jamais
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ta-cle-anonyme
SUPABASE_SERVICE_ROLE_KEY=ta-cle-service-role
```

#### **B. Contrôle d'Accès à l'Application :**
- ✅ Seuls les utilisateurs avec un compte peuvent accéder
- ✅ Chaque utilisateur ne voit que ses propres données
- ✅ Les politiques RLS protègent les données

### **3. 🔒 Désactiver les Inscriptions (Optionnel)**

Si tu veux être le SEUL utilisateur :

#### **Dans Supabase Dashboard :**
1. **Authentication** → **Settings**
2. **Désactive** "Enable email confirmations"
3. **Désactive** "Enable sign ups"

#### **Ou via SQL :**
```sql
-- Désactiver les inscriptions
UPDATE auth.config 
SET enable_signup = false;
```

### **4. 👤 Gestion des Utilisateurs Existants**

#### **A. Voir tous les utilisateurs :**
```sql
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at;
```

#### **B. Supprimer un utilisateur (si nécessaire) :**
```sql
-- ATTENTION: Cela supprime définitivement l'utilisateur et ses données
DELETE FROM auth.users WHERE email = 'email-a-supprimer@example.com';
```

### **5. 🔐 Sécurisation Avancée**

#### **A. Politiques RLS Strictes :**
Les politiques actuelles garantissent que :
- ✅ Chaque utilisateur ne voit que ses données
- ✅ Impossible d'accéder aux données d'autres utilisateurs
- ✅ Seuls les utilisateurs authentifiés peuvent créer du contenu

#### **B. Audit des Accès :**
```sql
-- Voir les dernières connexions
SELECT 
  email,
  last_sign_in_at,
  sign_in_count
FROM auth.users
ORDER BY last_sign_in_at DESC;
```

### **6. 🚀 Déploiement Sécurisé**

#### **A. Variables d'Environnement de Production :**
- ✅ Ne jamais commiter les fichiers `.env`
- ✅ Utiliser les variables d'environnement du service de déploiement
- ✅ Régénérer les clés si elles sont compromises

#### **B. Domaine Personnalisé :**
- Configure un domaine personnalisé
- Utilise HTTPS obligatoire
- Configure les CORS correctement

### **7. 📊 Monitoring et Contrôle**

#### **A. Surveillance des Données :**
```sql
-- Statistiques de l'application
SELECT 
  'Utilisateurs' as type, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Profils' as type, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Événements' as type, COUNT(*) as count FROM events
UNION ALL
SELECT 'Médias' as type, COUNT(*) as count FROM media
UNION ALL
SELECT 'Récits' as type, COUNT(*) as count FROM stories;
```

#### **B. Logs d'Activité :**
- Supabase Dashboard → **Logs**
- Surveille les connexions et activités

### **8. 🔄 Sauvegarde Régulière**

#### **A. Backup Automatisé :**
```bash
# Sauvegarde quotidienne
npm run backup
```

#### **B. Sauvegarde Manuelle :**
- Export des données via dashboard
- Téléchargement des fichiers storage
- Sauvegarde des variables d'environnement

## ⚠️ Points Critiques de Sécurité

### **🔐 À Faire :**
- ✅ Garde tes clés API secrètes
- ✅ Utilise des mots de passe forts
- ✅ Active l'authentification 2FA sur Supabase
- ✅ Surveille régulièrement les accès
- ✅ Fais des sauvegardes régulières

### **❌ À Éviter :**
- ❌ Partager tes clés API
- ❌ Utiliser des mots de passe faibles
- ❌ Laisser des comptes inutilisés actifs
- ❌ Négliger les mises à jour de sécurité

## 🎯 Configuration Recommandée

### **👨‍👩‍👧‍👦 Configuration Usage Familial Contrôlé (Recommandée) :**
1. **Garde** les inscriptions activées
2. **Crée** les comptes manuellement
3. **Partage** les identifiants de façon sécurisée
4. **Forme** les utilisateurs aux bonnes pratiques
5. **Surveille** l'activité régulièrement
6. **Configure** des alertes de sécurité

#### **🔧 Configuration Détaillée :**

##### **A. Paramètres Supabase :**
```sql
-- Garder les inscriptions activées mais surveillées
-- Dans Authentication → Settings :
-- ✅ Enable sign ups: ON
-- ✅ Enable email confirmations: ON (sécurité)
-- ✅ Enable phone confirmations: OFF
```

##### **B. Surveillance Active :**
```sql
-- Requête de surveillance quotidienne
SELECT 
  u.email,
  u.created_at as inscription,
  u.last_sign_in_at as derniere_connexion,
  u.email_confirmed_at as email_confirme,
  p.full_name as nom_complet,
  (SELECT COUNT(*) FROM events WHERE created_by = u.id) as nb_evenements,
  (SELECT COUNT(*) FROM stories WHERE created_by = u.id) as nb_recits,
  (SELECT COUNT(*) FROM media WHERE created_by = u.id) as nb_medias
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
```

##### **C. Gestion des Membres Familiaux :**
```sql
-- Voir l'activité récente (dernières 24h)
SELECT 
  u.email,
  u.last_sign_in_at,
  CASE 
    WHEN u.last_sign_in_at > NOW() - INTERVAL '24 hours' THEN '🟢 Actif'
    WHEN u.last_sign_in_at > NOW() - INTERVAL '7 days' THEN '🟡 Récent'
    ELSE '🔴 Inactif'
  END as statut
FROM auth.users u
ORDER BY u.last_sign_in_at DESC;
```

##### **D. Alertes de Sécurité :**
```sql
-- Détecter les comptes suspects
SELECT 
  u.email,
  u.created_at,
  u.email_confirmed_at,
  CASE 
    WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email non confirmé'
    WHEN u.created_at > NOW() - INTERVAL '1 hour' THEN '🆕 Nouveau compte'
    ELSE '✅ Normal'
  END as alerte
FROM auth.users u
WHERE u.email_confirmed_at IS NULL 
   OR u.created_at > NOW() - INTERVAL '24 hours'
ORDER BY u.created_at DESC;
```

### **📊 Dashboard de Surveillance Familiale :**

#### **🎯 Métriques Importantes :**
- **Nombre total de membres** de la famille
- **Activité récente** (connexions, créations)
- **Contenu créé** par chaque membre
- **Comptes non confirmés** ou suspects

#### **📅 Routine de Surveillance Recommandée :**

##### **Quotidienne (2 minutes) :**
- Vérifier les nouvelles inscriptions
- Contrôler l'activité récente
- Valider les comptes non confirmés

##### **Hebdomadaire (10 minutes) :**
- Analyser les statistiques d'usage
- Vérifier les sauvegardes
- Nettoyer les comptes inactifs si nécessaire

##### **Mensuelle (30 minutes) :**
- Audit complet de sécurité
- Mise à jour des permissions
- Formation des nouveaux membres

### **🔐 Bonnes Pratiques Familiales :**

#### **👨‍👩‍👧‍👦 Pour les Membres de la Famille :**
1. **Mots de passe forts** obligatoires
2. **Confirmation d'email** requise
3. **Formation** sur l'utilisation de l'app
4. **Respect** des données des autres membres

#### **👑 Pour l'Administrateur (Toi) :**
1. **Surveillance** régulière mais discrète
2. **Sauvegardes** automatiques
3. **Support** technique pour la famille
4. **Décisions** finales sur la sécurité

### **🚨 Procédures d'Urgence :**

#### **En cas de Compte Compromis :**
```sql
-- Désactiver temporairement un utilisateur
UPDATE auth.users 
SET email_confirmed_at = NULL 
WHERE email = 'email-suspect@example.com';
```

#### **En cas de Problème Technique :**
1. **Backup immédiat** des données
2. **Isolation** du problème
3. **Restauration** si nécessaire
4. **Communication** avec la famille

### **Pour Usage Personnel Strict :**
1. **Désactive** les inscriptions
2. **Supprime** les autres utilisateurs
3. **Configure** des sauvegardes automatiques
4. **Surveille** les logs régulièrement

## 🚀 Commandes Utiles

```bash
# Vérifier la configuration
npm run test

# Sauvegarde complète
npm run backup

# Restauration si nécessaire
npm run restore ./backups/2024-01-15
```

---

**Tu es maintenant le seul maître de ton application SOUVIENS_TOI ! 👑**