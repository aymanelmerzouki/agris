# Rapport de Construction — Application Agris

## Contexte

Application web de gestion agricole destinée au marché marocain. Deux types d'utilisateurs : les **entreprises agricoles** (manager + ouvriers) et les **agriculteurs indépendants**.

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Backend | Laravel 11 (PHP) |
| Authentification | Laravel Sanctum (tokens API) |
| Frontend | React 18 + Vite 6 |
| Style | Tailwind CSS 4 |
| Graphiques | Chart.js + react-chartjs-2 |
| Icônes | Lucide React |
| Base de données | SQLite |
| Actualités | NewsData.io API |

---

## Architecture

### Rôles Utilisateurs

- **Admin** — administration générale
- **Manager** — gère stocks, todo-lists, ouvriers, abonnements
- **Agriculteur** — suit ses cultures, publie des offres
- **Ouvrier** — exécute les tâches assignées

### Modèles de Données

- `User` → `Plante` → `Biblio` (many-to-many)
- `User` → `SuiviPlante` → `AlerteArrosage`
- `User` → `Offre` (vendeur + acheteur)
- `User` → `PlanteFavori` (pivot)
- `Manager` → `TodoList` → `Tache`
- `Manager` → `Stock`
- `User` → `Abonnement`
- `User` → `Message`

---

## Fonctionnalités Backend (Laravel API REST)

### Authentification
- Register / Login / Logout via Sanctum
- Middleware `RoleMiddleware` pour contrôle d'accès par rôle

### Bibliothèque Plantes
- 12 plantes marocaines réelles seedées : Safran, Arganier, Dattier, Clémentine, Tomate, Blé dur, Menthe, Cactus figuier de Barbarie, Oignon, Pastèque, Pomme de terre, Olivier
- Données complètes : température min/max, saison de plantation, durée de pousse, rendement moyen, type d'irrigation, conditions de culture

### Suivi des Cultures
- Enregistrement avec sélection visuelle de la nature du sol (5 types : argileux, sableux, limoneux, calcaire, humifère)
- Calcul automatique du pH et des besoins en eau via `SolCalculator` (type de sol × type d'irrigation × superficie)
- Stades végétatifs, notes agriculteur, statut (en cours / récolté / abandonné)

### Alertes Arrosage
- Job quotidien `EnvoyerAlertesArrosage` planifié à 07h00
- Notification en base de données par suivi actif
- Endpoint pour lire et marquer les alertes comme lues

### Marketplace Offres
- CRUD complet avec filtres (statut, localisation, plante, livraison)
- Endpoint `POST /offres/{id}/accepter` avec validation métier
- Devise en MAD (Dirham marocain)

### Favoris Plantes
- Toggle favori par utilisateur (table pivot `plante_favoris`)

### TodoList & Tâches
- Manager crée et assigne à un ouvrier par nom (sélection depuis liste)
- Tâches avec catégorie, priorité, durée estimée
- Statut enum : `en_attente` / `en_cours` / `termine`
- Horodatage automatique à la complétion

### Stocks
- CRUD avec seuil d'alerte, localisation, date d'expiration
- Barre de progression visuelle

### Dashboard Stats
- Endpoint différencié par rôle : stats complètes pour agriculteur/manager, stats tâches pour ouvrier

### Actualités Agricoles
- Intégration NewsData.io API avec cache 1h
- Fallback sur articles marocains statiques si pas de clé API

---

## Fonctionnalités Frontend (React)

### Pages Construites

| Page | Description |
|---|---|
| Landing | Page d'accueil publique professionnelle |
| Login / Register | Auth avec sélection de rôle |
| Dashboard | Graphiques, stat cards, actualités |
| Bibliothèque | Liste paginée, détail plante, favoris |
| Suivi cultures | Formulaire avec sélection sol par images |
| Marketplace | Offres avec achat/vente |
| Stocks | Gestion avec indicateur seuil |
| TodoList | Vue manager et vue ouvrier |
| Alertes | Notifications arrosage |

### UX / UI

- Dark mode avec toggle ☀️/🌙, persisté en localStorage, appliqué sans flash
- Transitions de page fade-in 0.25s à chaque changement de route
- Navbar sticky glassmorphism avec items actifs surlignés
- Bottom navigation mobile
- Stat cards premium avec icônes SVG Lucide, dégradés, glow effect, ombres flottantes
- Skeleton loading sur tous les chargements asynchrones

---

## Sécurité

### Frontend
- `PrivateRoute` avec gestion du loading pour éviter les redirections prématurées
- Axios interceptor 401 → redirect `/login` + clear localStorage (évite boucle page blanche)
- User mis en cache localStorage pour affichage instantané sans flash
- Accès ouvrier restreint : pas de Marketplace, Favoris, Cultures, Stocks, Alertes

### Backend
- `TachePolicy` : ouvrier limité à ses propres tâches, manager a tous les droits
- `TacheController` : `authorize()` sur update/delete, champs modifiables restreints pour ouvrier
- `DashboardController` : `abort(403)` si rôle non autorisé
- Routes API groupées par rôle avec middleware `role:`

---

## Déploiement Local

```bash
php artisan serve        # Backend sur :8000
npm run dev              # Frontend Vite sur :5173
php artisan migrate:fresh --seed   # Reset DB avec données réelles
```

### Comptes de Test

| Email | Mot de passe | Rôle |
|---|---|---|
| manager@agris.com | password | Manager |
| test@example.com | password | Agriculteur |
| ouvrier@agris.com | password | Ouvrier |

---

## Repository

**URL :** https://github.com/aymanelmerzouki/agris

**Branche :** `feature-init-laravel`
