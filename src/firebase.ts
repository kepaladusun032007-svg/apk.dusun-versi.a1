/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
// Safe dynamic lookup of local config using Vite's glob import (which won't fail the build if the file is absent)
let localConfig: any = {};
try {
  const configs = import.meta.glob("../firebase-applet-config*.json", { eager: true });
  const keys = Object.keys(configs);
  if (keys.length > 0) {
    localConfig = (configs[keys[0]] as any).default || configs[keys[0]];
  }
} catch (e) {
  // Safe fallback
}

// Support both environment variables (for production deployments like Vercel) and the config file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId || "",
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || localConfig.firestoreDatabaseId || "(default)";

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firestoreDatabaseId);
export const auth = getAuth();
