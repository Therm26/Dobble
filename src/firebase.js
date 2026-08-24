import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)

// Tant que les clés VITE_FIREBASE_* ne sont pas renseignées (voir .env.example),
// on évite d'initialiser Firebase : getDatabase() plante sinon toute l'app
// (y compris les modes Solo/Duo qui n'en ont pas besoin).
export const db = isFirebaseConfigured ? getDatabase(initializeApp(firebaseConfig)) : null
