# crm

Application CRM Commerciale, Facturation, Contrats et Suivi Clients pour l'agence **M-It LevelUp**.

## Fonctionnalités
- Gestion des Prospects & Clients (cycle 360°)
- Devis & Factures Proforma (avec calculs d'acomptes et remises)
- Factures Officielles avec cachet électronique et signature
- Multidevise intégrée (Ariary par défaut, Euro, Dollar)
- Protection anti-indexation totale (Googlebot / moteurs de recherche désactivés)
- GED & export documentaire

## Déploiement Hostinger
1. Créer une base de données MySQL dans le hPanel Hostinger.
2. Importer le fichier `database_hostinger.sql` dans phpMyAdmin.
3. Renseigner vos variables d'environnement dans `.env` (voir `.env.example`).
4. Installer les dépendances et compiler :
   ```bash
   npm install
   npm run build
   npm run start
   ```
