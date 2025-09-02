# 📱 Guide d'Utilisation Mobile Locale - SOUVIENS_TOI

## 🎯 Utiliser l'Application sur Téléphone en Local

### **🔧 Méthode 1 : Serveur de Développement Accessible**

#### **A. Configuration du Serveur Vite :**

1. **Modifie** le script de développement pour accepter les connexions externes
2. **Lance** le serveur avec l'option `--host`
3. **Accède** via l'IP locale de ton ordinateur

#### **B. Étapes Détaillées :**

##### **1. Trouver l'IP de ton Ordinateur :**

**Sur Windows :**
```bash
ipconfig
# Cherche "Adresse IPv4" (ex: 192.168.1.100)
```

**Sur Mac/Linux :**
```bash
ifconfig | grep inet
# Ou
ip addr show
# Cherche ton IP locale (ex: 192.168.1.100)
```

##### **2. Lancer le Serveur :**
```bash
# Dans le dossier de ton projet
npm run dev -- --host
```

**Ou modifier le package.json :**
```json
{
  "scripts": {
    "dev": "vite --host",
    "dev-mobile": "vite --host 0.0.0.0 --port 5173"
  }
}
```

##### **3. Accéder depuis le Téléphone :**
- **Assure-toi** que ton téléphone est sur le même WiFi
- **Ouvre** le navigateur de ton téléphone
- **Va sur** `http://192.168.1.100:5173` (remplace par ton IP)

### **🔧 Méthode 2 : Tunnel avec ngrok (Recommandé)**

#### **A. Installation de ngrok :**
```bash
# Installer ngrok
npm install -g ngrok

# Ou télécharger depuis https://ngrok.com/
```

#### **B. Utilisation :**
```bash
# Terminal 1 : Lance ton app
npm run dev

# Terminal 2 : Lance ngrok
ngrok http 5173
```

#### **C. Résultat :**
ngrok te donnera une URL publique comme :
```
https://abc123.ngrok.io
```

**Utilise cette URL** sur ton téléphone !

### **🔧 Méthode 3 : Serveur Local avec IP Fixe**

#### **A. Configuration Vite Avancée :**

Crée un fichier `vite.config.mobile.ts` :
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Accepte toutes les connexions
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
```

#### **B. Script Package.json :**
```json
{
  "scripts": {
    "dev-mobile": "vite --config vite.config.mobile.ts"
  }
}
```

### **📱 Optimisations Mobile**

#### **A. Responsive Design :**
L'application est déjà responsive avec Tailwind CSS, mais tu peux ajouter :

```css
/* Dans src/index.css */
@media (max-width: 768px) {
  .timeline-card {
    @apply p-4 text-sm;
  }
  
  .btn {
    @apply px-3 py-2 text-sm;
  }
}

/* Améliorer le touch sur mobile */
.btn, .card, .input {
  @apply touch-manipulation;
}
```

#### **B. Meta Tags Mobile :**
Dans `index.html`, assure-toi d'avoir :
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

### **🔐 Sécurité et Supabase**

#### **A. Variables d'Environnement :**
Tes variables Supabase fonctionneront normalement car elles sont côté client.

#### **B. CORS et Domaines :**
Dans Supabase Dashboard :
1. **Authentication** → **URL Configuration**
2. **Ajoute** ton IP locale : `http://192.168.1.100:5173`
3. **Ou** ton URL ngrok : `https://abc123.ngrok.io`

### **🚀 Méthode Recommandée : ngrok**

#### **Avantages :**
- ✅ **Simple** à configurer
- ✅ **HTTPS** automatique
- ✅ **Accessible** de partout
- ✅ **Pas de config réseau**

#### **Procédure Complète :**
```bash
# 1. Lance ton app
npm run dev

# 2. Dans un autre terminal
ngrok http 5173

# 3. Copie l'URL https://xxx.ngrok.io
# 4. Ouvre cette URL sur ton téléphone
```

### **📱 PWA (Progressive Web App) - Bonus**

Pour une expérience encore plus native, tu peux transformer l'app en PWA :

#### **A. Ajouter un Manifest :**
```json
// public/manifest.json
{
  "name": "SOUVIENS_TOI",
  "short_name": "Souviens",
  "description": "Application de chronologie familiale",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8f3e9",
  "theme_color": "#b0825a",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

#### **B. Service Worker (Optionnel) :**
Pour le cache offline et les notifications.

### **🔧 Dépannage**

#### **Problèmes Courants :**

**1. "Site non accessible" :**
- Vérifie que ton téléphone est sur le même WiFi
- Teste l'IP avec `ping` depuis ton téléphone

**2. "Erreur CORS" :**
- Ajoute ton URL dans Supabase Authentication settings

**3. "App lente sur mobile" :**
- Utilise ngrok pour une connexion plus stable
- Optimise les images et médias

### **📊 Test de Performance Mobile**

```bash
# Tester la vitesse de chargement
npm run build
npm run preview -- --host

# Puis teste avec les DevTools Chrome en mode mobile
```

## 🎯 Recommandation Finale

**Pour commencer rapidement :**
1. **Utilise ngrok** (le plus simple)
2. **Teste** toutes les fonctionnalités sur mobile
3. **Optimise** selon tes besoins

**Commande rapide :**
```bash
# Terminal 1
npm run dev

# Terminal 2  
ngrok http 5173
```

Puis utilise l'URL ngrok sur ton téléphone ! 📱✨