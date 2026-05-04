# 📦 AppStore - Bibliothèque d'Applications

Une application web simple et moderne pour gérer votre bibliothèque d'applications personnelle. Construite en HTML, CSS et JavaScript vanilla, sans framework.

## 📂 Structure du Projet

```
appstore/
├── index.html           # Page principale - Affichage des applications (Utilisateurs)
├── admin.html           # Page admin - Gestion des applications (Admin)
├── app-detail.html      # Page de détails d'une application
├── style.css            # Styles (responsive + dark mode)
├── script.js            # Logique JavaScript (localStorage, webhooks, DOM)
├── sample-apps.json     # Format JSON pour ajouter une application
└── README.md           # Ce fichier
```

## ✨ Fonctionnalités

### 🎯 Gestion des Applications
- ➕ **Ajouter une application** via une modal avec formulaire
- 👁️ **Voir les détails** - Page dédiée pour chaque application
- 🚀 **Lancer l'application** - Ouvre l'URL dans un nouvel onglet
- 📥 **Télécharger** - Lien direct pour télécharger le fichier raw
- 🗑️ **Supprimer** - Supprime l'application de la bibliothèque
- 🚩 **Signaler** - Signale une application problématique

### 💾 Stockage
- Données sauvegardées automatiquement avec **localStorage**
- Aucun backend requis
- Données persistantes entre les sessions

### 🌐 Webhooks
- Configurations d'URL webhook personnalisable
- Envoi de webhooks POST sur toutes les actions :
  - ✅ `added` - Application ajoutée
  - 👁️ `view` - Application consultée
  - 📥 `launch` - Application lancée
  - 🗑️ `deleted` - Application supprimée
  - 🚩 `reported` - Application signalée

### 🔍 Recherche
- Recherche en temps réel dans les applications
- Filtre par nom et description

### 📱 Design
- **Responsive** - Mobile, tablette et desktop
- **Moderne** - Gradients, animations fluides
- **Dark mode** - Support automatique du thème sombre
- **Accessible** - Structure HTML sémantique

## 🚀 Guide d'Utilisation

## 🚀 Guide d'Utilisation

### Accès

- **Utilisateurs** : Ouvrez `index.html` pour voir les applications
- **Admin** : Ouvrez `admin.html` pour gérer les applications

### Pour les Utilisateurs

1. Ouvrez `index.html` dans un navigateur web
2. Visualisez la liste des applications approuvées
3. Cliquez sur **"👁️ Voir détails"** pour plus d'informations
4. Cliquez sur **"🚀 Lancer l'App"** pour ouvrir l'application
5. Cliquez sur **"➕ Ajouter une App"** pour soumettre une nouvelle application à l'admin

### Pour l'Admin

#### Ajouter une Application

1. Ouvrez `admin.html`
2. Allez à la section **"➕ Ajouter une application"**
3. Collez le JSON d'une application dans le textarea (voir [Format JSON](#format-json) ci-dessous)
4. Cliquez **"Ajouter depuis JSON"**
5. L'application apparaît instantanément dans la liste et un webhook est envoyé

#### Format JSON à Copier-Coller

```json
{
  "name": "Google Drive",
  "description": "Service de stockage cloud et de collaboration",
  "url": "https://drive.google.com",
  "imageUrl": "https://example.com/image.png",
  "downloadUrl": "https://example.com/download.zip"
}
```

#### Gérer les Applications

- Visualisez toutes les applications dans **"📦 Applications validées"**
- Supprimez une app avec le bouton **🗑️ Supprimer**
- Webhook envoyé automatiquement à chaque action

#### Configurer le Webhook Admin

1. Allez à **"⚙️ Configuration Webhook"**
2. Entrez votre URL de webhook
3. Cliquez **"Enregistrer"**
4. L'admin reçoit les webhooks pour toutes les actions

## 📋 Format des Données

### Structure d'une Application (à copier-coller)

```json
{
  "name": "Google Drive",
  "description": "Service de stockage cloud",
  "url": "https://drive.google.com",
  "imageUrl": "https://example.com/image.png",
  "downloadUrl": "https://example.com/download.zip"
}
```

### Structure stockée dans localStorage (avec ID et date)

```json
{
  "id": 1693478400000,
  "name": "Google Drive",
  "description": "Service de stockage cloud",
  "url": "https://drive.google.com",
  "imageUrl": "https://example.com/image.png",
  "downloadUrl": "https://example.com/download.zip",
  "dateAdded": "03/05/2026 14:30:00"
}
```

### Webhooks Envoyés

#### Utilisateur - Soumet une app (action: `create_request`)
```json
{
  "action": "create_request",
  "timestamp": "2026-05-04T14:30:00.000Z",
  "app": { /* données de l'app */ },
  "user": "user",
  "message": "Nouvelle application soumise pour approbation..."
}
```

#### Admin - Ajoute une app (action: `app_approved`)
```json
{
  "action": "app_approved",
  "timestamp": "2026-05-04T14:30:00.000Z",
  "app": { /* données de l'app */ },
  "admin": "admin"
}
```

#### Admin - Supprime une app (action: `app_deleted`)
```json
{
  "action": "app_deleted",
  "timestamp": "2026-05-04T14:30:00.000Z",
  "app": { /* données de l'app */ },
  "admin": "admin"
}
```

#### Utilisateur - Consulte une app (action: `view`)
```json
{
  "action": "view",
  "timestamp": "2026-05-04T14:30:00.000Z",
  "app": { /* données de l'app */ }
}
```

#### Utilisateur - Lance une app (action: `launch`)
```json
{
  "action": "launch",
  "timestamp": "2026-05-04T14:30:00.000Z",
  "app": { /* données de l'app */ }
}
```

#### Utilisateur - Signale une app (action: `reported`)
```json
{
  "action": "reported",
  "timestamp": "2026-05-04T14:30:00.000Z",
  "app": { /* données de l'app */ },
  "reason": "User reported"
}
```

## 🔧 Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes, animations, responsive
- **JavaScript (Vanilla)** - Logique, localStorage, fetch API
- **LocalStorage** - Persistance des données
- **Fetch API** - Communication webhooks

## 📝 Code

### Importants Fichiers

#### `script.js` - Logique Principale
- Classe `App` pour représenter une application
- Fonctions de gestion du localStorage
- Gestion des webhooks avec `fetch()`
- Gestion des événements DOM
- Recherche et filtrage

#### `style.css` - Styles
- Design responsive avec CSS Grid
- Animations fluides
- Support du dark mode
- Variables CSS réutilisables

#### `index.html` - Interface
- Modal pour ajouter une application
- Grille d'applications
- Barre de recherche
- Configuration des webhooks

#### `app-detail.html` - Page Détails
- Affichage complet d'une application
- Boutons d'action
- Gestion des webhooks

## ⚙️ Sécurité

- ✅ **Validation des URLs** - Vérifie la validité des URLs saisies
- ✅ **Sanitization XSS** - Échappe les caractères HTML
- ✅ **Gestion des erreurs** - Messages clairs en cas d'erreur
- ✅ **HTTPS recommandé** - Pour les webhooks et ressources externes

## 🐛 Dépannage

### Les applications ne s'affichent pas
- Ouvrez la console (F12) et vérifiez les erreurs
- Vérifiez que localStorage est activé dans votre navigateur

### Les webhooks ne s'envoient pas
- Vérifiez que l'URL du webhook est valide
- Ouvrez la console pour voir les erreurs
- Utilisez un service comme `webhook.site` pour tester

### Les images ne s'affichent pas
- Assurez-vous que l'URL est un lien direct (raw)
- Les URLs contenant des redirections peuvent ne pas fonctionner
- Vérifiez la CORS si l'image provient d'un autre domaine

## 📦 Fichier sample-apps.json

Ce fichier contient un exemple de format JSON. **Copiez simplement son contenu et collez-le dans le textarea de la page admin** pour ajouter l'application.

Format simple et facile à utiliser :
```json
{
  "name": "Nom de l'app",
  "description": "Description courte",
  "url": "https://app.example.com",
  "imageUrl": "https://example.com/image.png",
  "downloadUrl": "https://example.com/download.zip"
}
```

## 📄 Licence

Libre d'utilisation - Pas de restrictions

## 🎨 Améliorations Futures

- Édition d'applications existantes
- Export/Import des données
- Catégories d'applications
- Favoris/Épingles
- Statistiques d'utilisation
- Synchronisation cloud

---

**Créé le 04/05/2026** | Made with ❤️
