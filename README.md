# Dobble

Une appli web (PWA) inspirée du jeu Dobble (Spot It!), faite avec React et Vite.

Le principe : deux cartes quelconques du jeu partagent toujours exactement un seul symbole en commun. Il faut le repérer et cliquer sur ce symbole le plus vite possible. La génération des cartes suit le vrai principe mathématique du jeu (un plan projectif fini d'ordre 7), dans `src/dobble.js` : 57 cartes, 8 symboles par carte, et la propriété "un seul symbole en commun" garantie entre deux cartes quelconques.

## Les trois modes de jeu

**Solo contre la montre** (`src/components/SoloGame.jsx`) : le deck entier (57 cartes) est posé en pioche. Une carte "table" et une carte "pioche" sont affichées côte à côte, il faut cliquer sur leur symbole commun pour faire avancer la pioche. Un chrono tourne pendant toute la partie, l'objectif est de vider la pioche le plus vite possible.

**Duo** (`src/components/MultiplayerSetup.jsx` et `MultiplayerGame.jsx`) : 2 joueurs sur le même écran, chacun a sa propre carte. Le premier qui clique le bon symbole sur SA carte marque le point, les deux cartes sont alors remplacées par les deux suivantes de la pioche. La partie se termine quand la pioche est épuisée, le joueur avec le plus de points gagne.

**En ligne** (`src/components/OnlineSetup.jsx` et `OnlineGame.jsx`) : 1v1 à distance. Un joueur crée une partie et obtient un code à 4 caractères, l'autre le rejoint avec ce code. La synchronisation passe par Firebase Realtime Database (`src/firebase.js`, `src/onlineRoom.js`) : la pioche est stockée côté serveur, et une transaction Firebase (`runTransaction`) départage qui a cliqué le bon symbole en premier en cas d'égalité de frappe.

Ce mode a besoin de clés Firebase. Sans elles, le bouton "En ligne" reste accessible mais affiche "Le mode en ligne n'est pas encore configuré." (voir `isFirebaseConfigured` dans `src/firebase.js`), les modes Solo et Duo fonctionnent sans aucune config.

## Lancer le projet

```bash
npm install
npm run dev
```

L'appli démarre sur `http://localhost:5173` (port par défaut de Vite).

## Activer le mode en ligne (optionnel)

1. Créer un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com), activer Realtime Database.
2. Copier `.env.example` en `.env.local` et renseigner les clés :

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Redémarrer `npm run dev`.

## Build et déploiement

```bash
npm run build    # génère le dossier dist/
npm run preview  # pour tester le build en local
```

Le projet est prêt pour un déploiement sur Netlify (`netlify.toml` pointe déjà sur `npm run build` et le dossier `dist`). Si le site est déployé ailleurs que sur Netlify, penser à renseigner les variables `VITE_FIREBASE_*` dans les paramètres d'environnement de l'hébergeur pour que le mode en ligne fonctionne en prod.

L'appli est installable comme PWA (icône sur l'écran d'accueil, mode standalone) grâce à `vite-plugin-pwa`, configuré dans `vite.config.js`.

## Structure du projet

```
src/
  dobble.js                     -> génération du deck et recherche du symbole commun
  symbols.js                    -> les 57 emojis utilisés
  firebase.js, onlineRoom.js    -> connexion et logique des parties en ligne
  decorColors.js, playerColors.js -> couleurs de l'interface et des joueurs
  components/
    Home.jsx                    -> écran d'accueil, choix du mode
    Card.jsx                    -> affichage d'une carte (disposition circulaire des symboles)
    SoloGame.jsx                -> mode solo
    MultiplayerSetup.jsx        -> saisie des noms avant une partie Duo
    MultiplayerGame.jsx         -> mode Duo
    OnlineSetup.jsx             -> création/connexion à une partie en ligne
    OnlineGame.jsx              -> mode en ligne
```

## Lint

```bash
npm run lint
```

Utilise [oxlint](https://oxc.rs), configuré dans `.oxlintrc.json`.
