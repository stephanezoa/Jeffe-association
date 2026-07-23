# VESTIGE — Plateforme Communautaire & Parrainage

Plateforme communautaire complète construite sur un **Modular Monolith** Node.js/Express + React 18 TypeScript.

---

## 🚀 Fonctionnalités Clés

1. **Parrainage Strict** : Aucune auto-inscription publique. Rejoint uniquement via jeton d'invitation à usage unique.
2. **Arbre Généalogique Illimité** : Chemin matérialisé (`tree_path`) combiné à une CTE récursive ANSI SQL pour calculs de réseau ultra-rapides.
3. **Double Dialecte BDD** : Bascule transparente entre **SQLite en développement** et **PostgreSQL en production** via `DB_CLIENT`.
4. **Administration & Back-Office** : Dashboard de métriques, file de modération unifiée et gestion granulaire des permissions RBAC.
5. **Newsletter & Campagnes** : Module d'inscription publique aux actualités et créateur/expéditeur de campagnes pour les administrateurs.
6. **Observabilité** : Logs structurés JSON Pino avec `X-Request-Id` propagé (`AsyncLocalStorage`) et journal d'audit métier append-only (`audit_logs`).

---

## 🛠️ Stack Technique

- **Frontend** : React 18, Vite, TypeScript, TailwindCSS
- **Backend** : Node.js 20, Express 4, Knex.js, Objection.js, Zod, Pino
- **Base de Données** : SQLite 3 (dev) / PostgreSQL (prod)

---

## ⚙️ Installation & Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement
Créez le fichier `.env` dans `apps/api/` (ou copiez `.env.example`) :
```bash
cp apps/api/.env.example apps/api/.env
```

### 3. Exécution des migrations et seeds
```bash
# SQLite par défaut
npm run db:migrate
npm run db:seed
```

### 4. Démarrage en mode développement
```bash
# Démarrer le backend API (port 4000)
npm run dev:api

# Démarrer le frontend Web (port 3000)
npm run dev:web
```

---

## 🐘 Procédure de Bascule vers PostgreSQL

Pour passer de SQLite à PostgreSQL en production :

1. Définissez les variables d'environnement dans `apps/api/.env` :
   ```env
   DB_CLIENT=pg
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USER=mon_utilisateur
   DB_PASSWORD=mon_mot_de_passe
   DB_NAME=vestige_prod
   ```

2. Exécutez le script de vérification de compatibilité double dialecte :
   ```bash
   npm run db:check-compat
   ```

3. Exécutez les migrations Knex sur PostgreSQL :
   ```bash
   npm run db:migrate
   ```

---

## 🔐 Identifiants Super Admin (Seed par défaut)

- **Email** : `admin@vestige.org`
- **Mot de passe** : `SuperAdminPassword123!`
- **Matricule** : `VEST-000001`
# Jeffe-association
