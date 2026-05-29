# BeeMS GED - Gestion Électronique de Documents

## 📋 Description

BeeMS GED est une solution complète de **Gestion Électronique de Documents** conçue pour gérer les références des documents d'une entreprise. Le système permet de :

- **Stocker** les métadonnées des documents dans une base SQLite sur le NAS
- **Rechercher** des documents avec des filtres avancés
- **Créer, modifier, supprimer** des références de documents
- **Gérer les permissions** basées sur les droits d'accès du NAS (Synology)
- **Visualiser** les statistiques d'utilisation

## 🏗️ Architecture

```
BeeMS GED
├── backend/          # API FastAPI (Python)
│   ├── app/          # Code source
│   │   ├── models/   # Modèles SQLAlchemy
│   │   ├── schemas/  # Schémas Pydantic
│   │   ├── routes/   # Endpoints API
│   │   ├── utils/    # Utilitaires (auth, etc.)
│   │   └── main.py   # Point d'entrée
│   └── requirements.txt
│
├── frontend/         # Interface React
│   ├── src/          # Code source
│   │   ├── components/ # Composants réutilisables
│   │   ├── pages/      # Pages principales
│   │   ├── services/   # Appels API
│   │   ├── hooks/      # Hooks React Query
│   │   └── App.jsx     # Routing
│   └── package.json
│
└── database/         # Base de données SQLite
    └── beems_ged.db
```

## 🚀 Installation

### Prérequis

- Python 3.10+
- Node.js 18+
- Un NAS accessible avec des chemins Windows (`\\NAS\...`)

### Backend (FastAPI)

1. Se placer dans le dossier backend :
   ```bash
   cd backend
   ```

2. Créer un environnement virtuel :
   ```bash
   python -m venv venv
   ```

3. Activer l'environnement :
   - Windows : `venv\Scripts\activate`
   - Linux/Mac : `source venv/bin/activate`

4. Installer les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

5. Configurer la base de données (optionnel) :
   ```bash
   # Par défaut, la base est créée dans database/beems_ged.db
   # Pour utiliser un chemin personnalisé sur le NAS :
   set DATABASE_PATH=\\NAS\BeeMS_GED\database\beems_ged.db
   ```

6. Démarrer le serveur :
   ```bash
   python main.py
   # ou
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

Le backend sera accessible sur `http://localhost:8000`

### Frontend (React)

1. Se placer dans le dossier frontend :
   ```bash
   cd frontend
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Démarrer l'application :
   ```bash
   npm run dev
   ```

Le frontend sera accessible sur `http://localhost:3000`

## 🎯 Fonctionnalités

### Backend API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/documents/` | GET | Recherche de documents avec filtres |
| `/api/documents/` | POST | Création d'un nouveau document |
| `/api/documents/{id}` | GET | Obtenir un document par ID |
| `/api/documents/{id}` | PUT | Mettre à jour un document |
| `/api/documents/{id}` | DELETE | Supprimer un document |
| `/api/documents/types` | GET | Liste des types uniques |
| `/api/documents/formats` | GET | Liste des formats uniques |
| `/api/documents/clients` | GET | Liste des clients uniques |
| `/api/documents/projets` | GET | Liste des projets uniques |
| `/api/health` | GET | Vérification de santé |

### Paramètres de recherche

| Paramètre | Type | Description |
|-----------|------|-------------|
| `reference` | string | Filtre sur la référence (supporte `*` pour wildcard) |
| `indice` | string | Filtre sur l'indice |
| `nom` | string | Filtre sur le nom (supporte `*` pour wildcard) |
| `auteur` | string | Filtre sur l'auteur |
| `type` | string | Filtre sur le type |
| `format` | string | Filtre sur le format |
| `client` | string | Filtre sur le client |
| `projet` | string | Filtre sur le projet |
| `date_creation_from` | date | Date de création minimum |
| `date_creation_to` | date | Date de création maximum |
| `date_modification_from` | date | Date de modification minimum |
| `date_modification_to` | date | Date de modification maximum |
| `sort_by` | string | Champ pour le tri |
| `sort_order` | string | Ordre de tri (`asc`/`desc`) |
| `page` | integer | Numéro de page |
| `page_size` | integer | Taille de la page |

### Gestion des permissions

Le système vérifie automatiquement que l'utilisateur a accès au chemin du document sur le NAS avant de retourner les résultats. Cela est fait via :

1. **Vérification des permissions** : Utilisation de `os.access()` pour vérifier l'accès en lecture
2. **Filtrage automatique** : Les documents inaccessibles sont exclus des résultats de recherche
3. **Protection des endpoints** : Les opérations (création, modification, suppression) vérifient les permissions

## 📊 Modèle de données

### Document

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `reference` | string | ✅ | Référence unique du document |
| `indice` | string | ❌ | Indice du document |
| `nom` | string | ✅ | Nom du document |
| `date_creation` | datetime | ❌ | Date de création (auto) |
| `auteur` | string | ✅ | Auteur initial |
| `date_modification` | datetime | ❌ | Date de modification (auto) |
| `auteur_modification` | string | ❌ | Auteur de la modification |
| `type` | string | ❌ | Type de document |
| `format` | string | ❌ | Format du fichier |
| `client` | string | ❌ | Client associé |
| `projet` | string | ❌ | Projet associé |
| `chemin` | string | ✅ | Chemin complet sur le NAS |

## 🎨 Interface Utilisateur

### Pages disponibles

- **Tableau de bord** (`/`) : Vue d'ensemble avec statistiques et actions rapides
- **Recherche avancée** (`/search`) : Recherche avec tous les filtres disponibles
- **Tous les documents** (`/documents`) : Liste complète des documents
- **Nouveau document** (`/create`) : Formulaire de création
- **Modifier document** (`/documents/{id}/edit`) : Formulaire de modification
- **Statistiques** (`/stats`) : Analyse des documents référencés

### Fonctionnalités UI

- ✅ Design moderne et épuré (TailwindCSS)
- ✅ Recherche avancée avec filtres combinés
- ✅ Tri par colonne (ascendant/descendant)
- ✅ Pagination des résultats
- ✅ Notifications toast
- ✅ Modales de confirmation
- ✅ Gestion des erreurs
- ✅ Chargement asynchrone

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|------------------|
| `DATABASE_PATH` | Chemin vers la base SQLite | `database\\beems_ged.db` |
| `PORT` | Port du backend | `8000` |
| `HOST` | Hôte du backend | `0.0.0.0` |

### Configuration pour le NAS

Pour utiliser la base de données sur le NAS :

1. Créer un dossier partagé sur le NAS (ex: `BeeMS_GED`)
2. Créer un sous-dossier `database`
3. Configurer la variable d'environnement :
   ```bash
   set DATABASE_PATH=\\NAS\BeeMS_GED\database\beems_ged.db
   ```

### Configuration du proxy (optionnel)

Si le backend et le frontend sont sur des machines différentes, configurez le proxy dans `frontend/vite.config.js` :

```javascript
proxy: {
  '/api': {
    target: 'http://nas-ip:8000',
    changeOrigin: true,
  }
}
```

## 📦 Déploiement

### Pour les utilisateurs finaux

1. **Installer Python** sur chaque PC utilisateur
2. **Cloner le dépôt** ou copier les fichiers
3. **Configurer le chemin** vers la base sur le NAS
4. **Lancer le backend** : `python backend/main.py`
5. **Lancer le frontend** : `npm run dev` dans le dossier frontend

### Script de démarrage (optionnel)

Créer un fichier `start.bat` :

```batch
@echo off
cd backend
start python main.py

cd ..\frontend
start npm run dev
```

## 🔒 Sécurité

- **Authentification** : Le système utilise les permissions du système de fichiers Windows
- **Filtrage** : Les utilisateurs ne voient que les documents auxquels ils ont accès
- **Validation** : Toutes les entrées sont validées côté serveur
- **HTTPS** : Recommandé pour la production (configurer un reverse proxy)

## 📝 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! Ouvrez une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, contactez l'administrateur système.
