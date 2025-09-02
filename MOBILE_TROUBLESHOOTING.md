# 🔧 Dépannage Connexion Mobile - SOUVIENS_TOI

## ❌ Problème : "Connection Timed Out"

### 🎯 Solutions par Ordre de Priorité

#### **1. 🔥 Pare-feu Windows (Cause #1)**

**Désactiver temporairement :**
1. **Windows** → **Paramètres** → **Mise à jour et sécurité**
2. **Sécurité Windows** → **Pare-feu et protection réseau**
3. **Désactive** temporairement le pare-feu
4. **Teste** la connexion mobile
5. **Réactive** le pare-feu après

**Ou créer une exception :**
1. **Pare-feu Windows** → **Paramètres avancés**
2. **Règles de trafic entrant** → **Nouvelle règle**
3. **Port** → **TCP** → **5173**
4. **Autoriser la connexion**

#### **2. 🌐 Vérification Réseau**

**A. Même WiFi :**
```bash
# Sur ton PC
ipconfig

# Sur ton téléphone (paramètres WiFi)
# Vérifie que l'IP commence pareil (ex: 192.168.1.XXX)
```

**B. Test de connectivité :**
```bash
# Sur ton PC, teste si ton téléphone peut te joindre
ping IP-DE-TON-TELEPHONE

# Sur ton téléphone, teste une app de ping vers ton PC
# Ping vers 192.168.1.XXX (ton IP PC)
```

#### **3. 🔧 Configuration Vite Forcée**

**Relance avec configuration stricte :**
```bash
npm run dev-mobile
```

**Ou manuellement :**
```bash
npx vite --host 0.0.0.0 --port 5173
```

#### **4. 📱 Test avec Navigateur Mobile**

**Essaie différents navigateurs :**
- Chrome mobile
- Firefox mobile  
- Safari (iOS)
- Edge mobile

#### **5. 🔄 Méthode Alternative : Partage de Connexion**

**Si rien ne marche :**
1. **Active** le partage de connexion de ton téléphone
2. **Connecte** ton PC au WiFi de ton téléphone
3. **Lance** `npm run dev` (sans --host)
4. **Utilise** `http://localhost:5173` sur ton téléphone

#### **6. 🌐 Solution Tunnel Gratuite : LocalTunnel**

**Alternative à ngrok :**
```bash
# Installe localtunnel
npm install -g localtunnel

# Terminal 1 : Lance ton app
npm run dev

# Terminal 2 : Lance le tunnel
lt --port 5173
```

#### **7. 🔍 Diagnostic Complet**

**Vérifications étape par étape :**

```bash
# 1. Vérifier que Vite écoute bien
netstat -an | findstr 5173

# 2. Vérifier ton IP
ipconfig | findstr "IPv4"

# 3. Tester depuis ton PC
curl http://localhost:5173
curl http://TON-IP:5173
```

### 🚨 **Solutions d'Urgence**

#### **A. Serveur Python Simple**
```bash
# Dans le dossier dist après build
npm run build
cd dist
python -m http.server 8000 --bind 0.0.0.0
```

#### **B. Utiliser un autre port**
```bash
# Essaie le port 3000
npx vite --host 0.0.0.0 --port 3000
```

### 📋 **Checklist de Dépannage**

- [ ] Pare-feu Windows désactivé temporairement
- [ ] Même réseau WiFi (PC et téléphone)
- [ ] IP correcte (192.168.1.XXX)
- [ ] Port 5173 libre
- [ ] Vite lancé avec --host 0.0.0.0
- [ ] Navigateur mobile à jour
- [ ] Pas de VPN actif

### 🎯 **Test Rapide**

1. **Désactive** le pare-feu Windows
2. **Lance** : `npm run dev-mobile`
3. **Note** l'IP affichée dans "Network:"
4. **Teste** sur ton téléphone : `http://IP:5173`

### 📞 **Si Rien ne Marche**

**Utilise LocalTunnel (gratuit) :**
```bash
npm install -g localtunnel
npm run dev
lt --port 5173
```

**Ou partage de connexion :**
1. Partage la connexion de ton téléphone
2. Connecte ton PC au WiFi du téléphone
3. Utilise `http://localhost:5173` directement

---

**La solution la plus courante est le pare-feu Windows ! 🔥**