# Jana Distrib - Application E-commerce

Application e-commerce React/TypeScript avec backend Node.js et base de données PostgreSQL pour la distribution de produits alimentaires.

## 🚀 Technologies utilisées

### Frontend
- React 19 avec TypeScript
- Material-UI (MUI) pour l'interface
- React Router pour la navigation
- Axios pour les requêtes HTTP
- Context API pour la gestion d'état

### Backend
- Node.js avec Express
- TypeScript
- PostgreSQL pour la base de données
- JWT pour l'authentification
- Nodemailer pour les emails
- Multer pour l'upload d'images

## 📁 Structure du projet

```
aSFDE/
├── client/          # Frontend React
├── server/          # Backend Node.js
├── start.bat        # Script de démarrage local
└── README.md        # Documentation
```

## 🔧 Installation locale

### Prérequis
- Node.js 16+
- PostgreSQL 12+
- Git

### Installation

1. **Cloner le repository**
```bash
git clone <votre-repo>
cd aSFDE
```

2. **Installer les dépendances serveur**
```bash
cd server
npm install
```

3. **Installer les dépendances client**
```bash
cd ../client
npm install
```

4. **Configuration de la base de données**
- Créer une base PostgreSQL nommée `asfde_db`
- Importer le schéma depuis `server/backup.sql`
- Exécuter le script de correction : `server/fix_db_column.sql`

5. **Configuration des variables d'environnement**

**server/.env :**
```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=asfde_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_cle_secrete_forte

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application

# Configuration serveur
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**client/.env :**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

6. **Démarrage**
```bash
# Terminal 1 - Serveur (port 5000)
cd server
npm run dev

# Terminal 2 - Client (port 3000)
cd ../client
npm start
```

## 🚀 Déploiement

### Hébergement recommandé
- **Frontend** : Vercel, Netlify, ou GitHub Pages
- **Backend** : Railway, Render, ou Heroku
- **Base de données** : Supabase, Railway PostgreSQL, ou AWS RDS

### Variables d'environnement de production
Assurez-vous de configurer toutes les variables d'environnement sur votre plateforme d'hébergement.

## 📝 Fonctionnalités

### Public
- ✅ Catalogue de produits avec filtres
- ✅ Système de panier avancé
- ✅ Formulaire de contact
- ✅ Interface responsive
- ✅ Mode sombre/clair

### Administration
- ✅ Authentification sécurisée
- ✅ Gestion des produits (CRUD)
- ✅ Gestion des catégories
- ✅ Upload d'images
- ✅ Tableau de bord

### Sécurité
- ✅ Authentification JWT
- ✅ Rate limiting
- ✅ Validation des données
- ✅ Hashage des mots de passe
- ✅ Protection CORS

## 📞 Support

Pour toute question ou problème :
- Email : jana.distribution@gmail.com
- Téléphone : 06 61 54 75 52

## 📄 Licence

© 2025 Jana Distrib. Tous droits réservés.